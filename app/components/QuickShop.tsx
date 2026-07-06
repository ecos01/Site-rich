import {createContext, useContext, useMemo, useState, type ReactNode} from 'react';
import {Image} from '@shopify/hydrogen';
import {Aside, useAside} from '@/components/Aside';
import {AddToCartButton} from '@/components/AddToCartButton';
import {SizeOptionGrid} from '@/components/SizeOptionGrid';
import {isShoe} from '@/lib/shop';
import {isAvailable} from '@/lib/testing';

const isSizeOption = (name: string) => /size|taglia/i.test(name);
const isColorOption = (name: string) => /color|colore/i.test(name);

type Money = {amount: string; currencyCode: string};

export type StoreProduct = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  tags?: string[];
  productType?: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  featuredImage?: {
    id?: string;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  priceRange: {minVariantPrice: Money};
  compareAtPriceRange: {minVariantPrice: Money};
  options: {name: string; optionValues: {name: string}[]}[];
  variants: {
    nodes: {
      id: string;
      sku?: string | null;
      availableForSale: boolean;
      selectedOptions: {name: string; value: string}[];
      price: Money;
    }[];
  };
};

// ponytail: mock.shop (the demo backend used in testing) ignores @inContext
// country and always returns CAD — there's no real store to configure a
// market/currency on. Relabels the same amount as EUR instead of converting
// it. Drop this override once a real Storefront API connection is live.
export const money = (m?: Money | null) =>
  m
    ? new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(Number(m.amount))
    : '';

// --- Context: which product the quick-shop drawer is showing ----------------

type QuickShopContextValue = {
  product: StoreProduct | null;
  openQuickShop: (p: StoreProduct) => void;
};
const QuickShopContext = createContext<QuickShopContextValue | null>(null);

export function QuickShopProvider({children}: {children: ReactNode}) {
  const {open} = useAside(); // must live inside Aside.Provider
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const value = useMemo(
    () => ({
      product,
      openQuickShop: (p: StoreProduct) => {
        setProduct(p);
        open('quickshop');
      },
    }),
    [product, open],
  );
  return (
    <QuickShopContext.Provider value={value}>
      {children}
    </QuickShopContext.Provider>
  );
}

// Falls back to a no-op instead of throwing: a transient render (e.g. root
// loader data momentarily unavailable during a dev HMR/hydration hiccup) would
// otherwise 500 the whole page just because the "choose a size" button broke.
const NOOP_QUICKSHOP: QuickShopContextValue = {
  product: null,
  openQuickShop: () => {},
};

export function useQuickShop() {
  return useContext(QuickShopContext) ?? NOOP_QUICKSHOP;
}

// --- The drawer content (rendered inside the shared Aside) -------------------

export function QuickShopAside() {
  const {product} = useQuickShop();
  return (
    <Aside type="quickshop" heading="Scegli la taglia">
      {product ? <QuickShopContent product={product} /> : null}
    </Aside>
  );
}

function QuickShopContent({product}: {product: StoreProduct}) {
  const {open} = useAside();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const shoe = isShoe(product);

  // A value is buyable if some in-stock variant carries it.
  const availableValues = useMemo(() => {
    const set = new Set<string>();
    for (const v of product.variants.nodes) {
      if (!isAvailable(v)) continue;
      for (const o of v.selectedOptions) set.add(`${o.name}:${o.value}`);
    }
    return set;
  }, [product]);

  // Single-value and color options need no UI choice (each colorway is its own product).
  const requiresChoice = (name: string) =>
    !isColorOption(name) &&
    (product.options.find((o) => o.name === name)?.optionValues?.length ?? 0) > 1;

  const allChosen = product.options.every(
    (o) => !requiresChoice(o.name) || selected[o.name],
  );
  const variant = allChosen
    ? product.variants.nodes.find((v) =>
        v.selectedOptions.every(
          (o) => !requiresChoice(o.name) || selected[o.name] === o.value,
        ),
      )
    : null;
  const canAdd = Boolean(variant) && isAvailable(variant!);

  // Per-size price: look up a variant carrying this value, honoring any other
  // option (e.g. color) already chosen — sizes can be priced differently.
  const priceForValue = (optionName: string, value: string) =>
    product.variants.nodes.find((v) =>
      v.selectedOptions.every((o) =>
        o.name === optionName
          ? o.value === value
          : !selected[o.name] || selected[o.name] === o.value,
      ),
    )?.price;

  return (
    <div className="flex flex-col gap-6">
      {/* product summary */}
      <div className="flex gap-4">
        {product.featuredImage && (
          <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#f0efec]">
            <Image
              data={product.featuredImage}
              width={80}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div>
          {product.vendor && (
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#008F95]">
              {product.vendor}
            </p>
          )}
          <h3 className="mt-1 text-[15px] font-bold leading-tight">
            {product.title}
          </h3>
          <p className="mt-1 text-[14px] text-[#171717]/70">
            {money(variant?.price ?? product.priceRange.minVariantPrice)}
          </p>
          <p className="mt-1 text-[11px] text-[#171717]/50">
            Tasse incluse. Spedizione calcolata al checkout.
          </p>
        </div>
      </div>

      {/* option grids (sizes) */}
      {product.options.map((option) => {
        // Skip single-value and color options (each colorway is its own product).
        if (option.optionValues.length <= 1 || isColorOption(option.name)) return null;
        const size = isSizeOption(option.name);
        return (
          <div key={option.name}>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em]">
              {option.name}
            </p>
            {size ? (
              <SizeOptionGrid
                values={option.optionValues.map((v) => v.name)}
                selected={selected[option.name]}
                onSelect={(value) =>
                  setSelected((s) => ({...s, [option.name]: value}))
                }
                priceFor={(value) => priceForValue(option.name, value)}
                euConvert={shoe}
                isAvailable={(value) => availableValues.has(`${option.name}:${value}`)}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {option.optionValues.map((val) => {
                  const isSel = selected[option.name] === val.name;
                  const avail = availableValues.has(`${option.name}:${val.name}`);
                  return (
                    <button
                      key={val.name}
                      type="button"
                      disabled={!avail}
                      onClick={() =>
                        setSelected((s) => ({...s, [option.name]: val.name}))
                      }
                      className={`min-w-[3.25rem] rounded-2xl border px-3 py-2 text-[13px] transition-colors ${
                        isSel
                          ? 'border-[#171717] bg-[#171717] text-white'
                          : 'border-[#171717]/25 hover:border-[#171717]'
                      } ${!avail ? 'cursor-not-allowed text-[#171717]/30 line-through' : ''}`}
                    >
                      {val.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* quantity */}
      <div>
        <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em]">
          Quantità
        </p>
        <div className="inline-flex items-center overflow-hidden rounded-full border border-[#171717]/25">
          <button
            type="button"
            aria-label="Diminuisci"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-lg hover:bg-[#171717] hover:text-white"
          >
            −
          </button>
          <span className="min-w-[2.5rem] text-center text-[14px]">{qty}</span>
          <button
            type="button"
            aria-label="Aumenta"
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-2 text-lg hover:bg-[#171717] hover:text-white"
          >
            +
          </button>
        </div>
      </div>

      {/* add to cart */}
      <div className="quickshop-add [&_button]:w-full [&_button]:rounded-full [&_button]:bg-[#171717] [&_button]:py-4 [&_button]:text-[13px] [&_button]:font-bold [&_button]:uppercase [&_button]:tracking-[0.2em] [&_button]:text-white [&_button:disabled]:opacity-40">
        <AddToCartButton
          disabled={!canAdd}
          onClick={() => open('cart')}
          lines={
            variant
              ? [{merchandiseId: variant.id, quantity: qty}]
              : []
          }
        >
          {!allChosen
            ? 'Seleziona la taglia'
            : canAdd
              ? 'Aggiungi al carrello'
              : 'Esaurito'}
        </AddToCartButton>
      </div>
    </div>
  );
}
