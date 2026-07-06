import {useState} from 'react';
import {Link, useLoaderData, useFetcher} from 'react-router';
import type {Route} from './+types/products.$handle';
import {CartForm, Image} from '@shopify/hydrogen';
import {Ruler, Truck, Package} from 'lucide-react';
import {AddToCartButton} from '@/components/AddToCartButton';
import {useAside} from '@/components/Aside';
import {money} from '@/components/QuickShop';
import {JsonLd} from '@/components/JsonLd';
import {breadcrumbSchema, productSchema} from '@/lib/structured-data';
import {SizeOptionGrid} from '@/components/SizeOptionGrid';
import {SizeChartModal} from '@/components/SizeChartModal';
import {
  ShippingModal,
  shippingAttributes,
  type ShippingSpeed,
} from '@/components/ShippingModal';
import {
  isShoe,
  baseTitle,
  colorLabel,
  NINETEEN_HANDLES,
  getShopProducts,
} from '@/lib/shop';
import {isAvailable, USE_LOCAL_CATALOG} from '@/lib/testing';
import {LAB19_CATALOG} from '@/lib/fixtures/catalog';
import paypalLogo from '@/assets/paypal-logo.png';
import {MegaNav} from '@/components/mega-nav';
import {GlareHover} from '@/components/GlareHover';
import {StarBorder} from '@/components/StarBorder';

export const meta = ({data}: {data?: {product?: {title: string}}}) => [
  {title: `${data?.product?.title ?? 'Prodotto'} — LAB19`},
];

export async function loader({context, params, request}: Route.LoaderArgs) {
  const handle = params.handle!;
  const isNineteen = NINETEEN_HANDLES.has(handle);

  if (USE_LOCAL_CATALOG) {
    const product = LAB19_CATALOG.find((p) => p.handle === handle);
    if (!product) throw new Response('Not found', {status: 404});
    const colorSiblings = siblingsOf(LAB19_CATALOG, product.title, handle);
    return {product, url: request.url, isNineteen, colorSiblings};
  }

  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {handle},
  });
  if (!product) throw new Response('Not found', {status: 404});

  // Sibling colorways = other products sharing the same base name.
  const catalog = await getShopProducts(context.storefront, {first: 100});
  const colorSiblings = siblingsOf(catalog, product.title, handle);

  return {product, url: request.url, isNineteen, colorSiblings};
}

// Products sharing this product's base name (its colorways), self included.
function siblingsOf(
  catalog: Array<{handle: string; title: string; featuredImage?: {url: string} | null}>,
  title: string,
  handle: string,
) {
  const base = baseTitle(title);
  const group = catalog
    .filter((p) => baseTitle(p.title) === base)
    .map((p) => ({
      handle: p.handle,
      color: colorLabel(p.title),
      image: p.featuredImage?.url ?? null,
      current: p.handle === handle,
    }));
  // Only meaningful if there's more than one colorway.
  return group.length > 1 ? group : [];
}

const isColor = (n: string) => /color|colore/i.test(n);
const isSize = (n: string) => /size|taglia/i.test(n);

export default function Product() {
  const {product, url, isNineteen, colorSiblings} = useLoaderData<typeof loader>();
  const {open} = useAside();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [shippingSpeed, setShippingSpeed] = useState<ShippingSpeed>('standard');
  const [pendingSizeOption, setPendingSizeOption] = useState<{
    name: string;
    value: string;
  } | null>(null);
  // Lives on the page (not inside the modal) so the submit survives the modal closing.
  const cartFetcher = useFetcher();
  const shoe = isShoe(product);

  const available = new Set<string>();
  for (const v of product.variants.nodes)
    if (isAvailable(v))
      for (const o of v.selectedOptions) available.add(`${o.name}:${o.value}`);

  // Per-size price: look up a variant carrying this value, honoring any other
  // option (e.g. color) already chosen — sizes can be priced differently.
  const priceForValue = (optionName: string, value: string) =>
    product.variants.nodes.find((v: any) =>
      v.selectedOptions.every((o: any) =>
        o.name === optionName
          ? o.value === value
          : !selected[o.name] || selected[o.name] === o.value,
      ),
    )?.price;

  // A single-value option has nothing to pick; color options are dropped
  // entirely (each colorway is its own product), so neither needs a UI choice.
  const requiresChoice = (name: string) =>
    !isColor(name) &&
    (product.options.find((o: any) => o.name === name)?.optionValues?.length ?? 0) > 1;

  const allChosen = product.options.every(
    (o: any) => !requiresChoice(o.name) || selected[o.name],
  );
  const variant = allChosen
    ? product.variants.nodes.find((v: any) =>
        v.selectedOptions.every(
          (o: any) => !requiresChoice(o.name) || selected[o.name] === o.value,
        ),
      )
    : null;
  const canAdd = variant ? isAvailable(variant) : false;
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const origin = new URL(url).origin;
  const inStock = product.variants.nodes.some((v: any) => isAvailable(v));
  const numericVariantId = variant?.id.split('/').pop();
  const checkoutHref = numericVariantId ? `/cart/${numericVariantId}:${qty}` : undefined;

  return (
    <>
      <div aria-hidden className="h-14 md:h-16" />
      <MegaNav />
      <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-8">
      <JsonLd
        data={[
          productSchema({product, price, url, inStock}),
          breadcrumbSchema([
            {name: 'Home', url: origin},
            {name: 'Shop', url: `${origin}/shop`},
            {name: product.title},
          ]),
        ]}
      />
      <nav className="mb-8 text-[13px] text-[#171717]/60">
        <Link to="/shop" className="hover:text-[#008F95]">
          Shop
        </Link>{' '}
        / <span className="text-[#171717]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div className="overflow-hidden rounded-3xl bg-[#f5f4f1]">
          {product.featuredImage && (
            <Image
              data={product.featuredImage}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-contain p-6"
            />
          )}
        </div>

        <div className="md:max-w-[440px]">
          <h1 className="text-[22px] font-medium leading-tight">{product.title}</h1>
          {product.vendor && (
            <p className="mt-1 text-[15px] text-[#171717]/70">{product.vendor}</p>
          )}
          {variant?.sku && (
            <p className="mt-3 text-[13px] tracking-wide text-[#171717]/60">
              {variant.sku}
            </p>
          )}

          <p className="mt-4 text-[20px]">{money(price)}</p>
          <p className="mt-1 text-[13px] text-[#171717]/60">
            Tasse incluse.{' '}
            {!isNineteen && selected[pendingSizeOption?.name ?? '']
              ? shippingSpeed === 'express'
                ? 'Spedizione in 1-2 giorni lavorativi.'
                : 'Spedizione in 5-10 giorni lavorativi.'
              : 'Spedizione calcolata al momento del pagamento.'}
          </p>

          {/* Colorways: sibling products sharing this product's base name. */}
          {colorSiblings.length > 1 && (
            <div className="mt-8">
              <p className="mb-2 text-[14px]">
                Colore:{' '}
                <span className="font-bold">
                  {colorSiblings.find((c) => c.current)?.color}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colorSiblings.map((c) => (
                  <Link
                    key={c.handle}
                    to={`/products/${c.handle}`}
                    title={c.color}
                    aria-label={c.color}
                    prefetch="intent"
                    className={`size-[68px] overflow-hidden rounded-xl border bg-[#f5f4f1] ${
                      c.current
                        ? 'border-2 border-[#171717]'
                        : 'border-[#171717]/15 hover:border-[#171717]/50'
                    }`}
                  >
                    {c.image && (
                      <img
                        src={c.image}
                        alt={c.color}
                        className="h-full w-full object-contain p-1.5"
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 space-y-6">
            {product.options.map((option: any) => {
              // Skip single-value options and color (each colorway is its own product).
              if (option.optionValues.length <= 1 || isColor(option.name)) return null;
              const size = isSize(option.name);
              return (
                <div key={option.name}>
                  <p className="mb-2 text-[14px]">
                    {size ? 'Taglia:' : `${option.name}:`}
                  </p>
                  {size ? (
                    <SizeOptionGrid
                      values={option.optionValues.map((v: any) => v.name)}
                      selected={selected[option.name]}
                      showPrice={!isNineteen}
                      onSelect={(value) => {
                        setSelected((s) => ({...s, [option.name]: value}));
                        // Nineteen = normal checkout: no shipping-speed modal.
                        if (!isNineteen) {
                          setPendingSizeOption({name: option.name, value});
                          setShippingModalOpen(true);
                        }
                      }}
                      priceFor={(value) => priceForValue(option.name, value)}
                      euConvert={shoe}
                      isAvailable={(value) => available.has(`${option.name}:${value}`)}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {option.optionValues.map((val: any) => {
                        const sel = selected[option.name] === val.name;
                        const avail = available.has(`${option.name}:${val.name}`);
                        return (
                          <button
                            key={val.name}
                            type="button"
                            disabled={!avail}
                            onClick={() =>
                              setSelected((s) => ({...s, [option.name]: val.name}))
                            }
                            className={`min-w-[3rem] border px-3 py-2 text-[14px] transition-colors ${
                              sel
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

            <div>
              <p className="mb-2 text-[14px]">Quantità:</p>
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

            {shoe && (
              <button
                type="button"
                onClick={() => setSizeChartOpen(true)}
                className="flex items-center gap-2 text-[14px] text-[#171717]/70 hover:text-[#008F95]"
              >
                <Ruler className="size-4" /> Size Chart
              </button>
            )}

            <StarBorder as="div" color="#008f95" speed="5s" thickness={4} className="sb-addcart">
              <GlareHover
                width="100%"
                height="auto"
                background="transparent"
                borderColor="transparent"
                borderRadius="9999px"
                glareColor="#ffffff"
                glareOpacity={0.35}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={2000}
                style={{placeItems: 'stretch'}}
                className="[&_button]:w-full [&_button]:rounded-full [&_button]:bg-[#171717] [&_button]:py-4 [&_button]:text-[13px] [&_button]:font-bold [&_button]:uppercase [&_button]:tracking-[0.2em] [&_button]:text-white [&_button:disabled]:opacity-40 [&_form]:w-full"
              >
                <AddToCartButton
                  disabled={!canAdd}
                  onClick={() => open('cart')}
                  lines={variant ? [{merchandiseId: variant.id, quantity: qty}] : []}
                >
                  {!allChosen ? 'Seleziona' : canAdd ? 'Aggiungi al carrello' : 'Esaurito'}
                </AddToCartButton>
              </GlareHover>
            </StarBorder>

            {/* Express checkout — skips the cart, creates a fresh cart with just this
                line and redirects straight to Shopify checkout (real PayPal option
                shows there if enabled on the store). */}
            {checkoutHref && canAdd ? (
              <a
                href={checkoutHref}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ffc439] py-4 text-[15px] font-bold text-[#171717] transition-opacity hover:opacity-90"
              >
                Paga con
                <img src={paypalLogo} alt="PayPal" className="h-7 w-auto" />
              </a>
            ) : (
              <span className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#ffc439]/40 py-4 text-[15px] font-bold text-[#171717]/40">
                Paga con
                <img src={paypalLogo} alt="" className="h-7 w-auto opacity-40" />
              </span>
            )}
            {checkoutHref && canAdd ? (
              <a
                href={checkoutHref}
                className="block text-center text-[13px] text-[#171717]/70 underline hover:text-[#171717]"
              >
                Altre opzioni di pagamento
              </a>
            ) : (
              <span className="block text-center text-[13px] text-[#171717]/30 underline">
                Altre opzioni di pagamento
              </span>
            )}
          </div>

          {product.descriptionHtml && (
            <div
              className="mt-8 border-t border-[#171717]/10 pt-6 text-[14px] leading-relaxed text-[#171717]/75"
              dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
            />
          )}

          <div className="mt-8 space-y-4 border-t border-[#171717]/10 pt-6">
            <div className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.12em]">
              <Truck className="size-4" /> Spedizione
            </div>
            <div className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.12em]">
              <Package className="size-4" /> Resi &amp; Rimborsi
            </div>
          </div>
        </div>
      </div>
      <SizeChartModal
        open={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        vendor={product.vendor}
      />
      <ShippingModal
        open={shippingModalOpen}
        onClose={() => setShippingModalOpen(false)}
        basePrice={
          pendingSizeOption
            ? priceForValue(pendingSizeOption.name, pendingSizeOption.value) ?? price
            : price
        }
        onConfirm={(speed) => {
          if (variant) {
            const basePrice = pendingSizeOption
              ? priceForValue(pendingSizeOption.name, pendingSizeOption.value) ?? price
              : price;
            cartFetcher.submit(
              {
                [CartForm.INPUT_NAME]: JSON.stringify({
                  action: CartForm.ACTIONS.LinesAdd,
                  inputs: {
                    lines: [
                      {
                        merchandiseId: variant.id,
                        quantity: qty,
                        attributes: shippingAttributes(speed, basePrice),
                      },
                    ],
                  },
                }),
              },
              {method: 'POST', action: '/cart'},
            );
          }
          setShippingSpeed(speed);
          setShippingModalOpen(false);
          open('cart');
        }}
      />
      </section>
    </>
  );
}

const PRODUCT_QUERY = `#graphql
  query PdpProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      handle
      productType
      title
      vendor
      descriptionHtml
      tags
      featuredImage { id url altText width height }
      priceRange { minVariantPrice { amount currencyCode } }
      options { name optionValues { name } }
      variants(first: 100) {
        nodes {
          id
          sku
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
        }
      }
    }
  }
` as const;
