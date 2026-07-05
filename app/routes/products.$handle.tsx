import {useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {Image} from '@shopify/hydrogen';
import {Ruler, Truck, Package} from 'lucide-react';
import {AddToCartButton} from '@/components/AddToCartButton';
import {useAside} from '@/components/Aside';
import {money} from '@/components/QuickShop';

export const meta = ({data}: {data?: {product?: {title: string}}}) => [
  {title: `${data?.product?.title ?? 'Prodotto'} — LAB19`},
];

export async function loader({context, params}: Route.LoaderArgs) {
  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {handle: params.handle},
  });
  if (!product) throw new Response('Not found', {status: 404});
  return {product};
}

const COLORS: Record<string, string> = {
  black: '#171717', nero: '#171717', white: '#ffffff', bianco: '#ffffff',
  red: '#d33', rosso: '#d33', blue: '#2b5cff', blu: '#2b5cff', green: '#2a8', verde: '#2a8',
  grey: '#9a9a9a', gray: '#9a9a9a', grigio: '#9a9a9a', beige: '#e8dcc4', brown: '#7a5230',
  navy: '#1b2a4a', pink: '#f4a', rosa: '#f4a', yellow: '#f2c200', giallo: '#f2c200',
};
const isColor = (n: string) => /color|colore/i.test(n);
const isSize = (n: string) => /size|taglia/i.test(n);

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const {open} = useAside();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);

  const available = new Set<string>();
  for (const v of product.variants.nodes)
    if (v.availableForSale)
      for (const o of v.selectedOptions) available.add(`${o.name}:${o.value}`);

  const allChosen = product.options.every((o: any) => selected[o.name]);
  const variant = allChosen
    ? product.variants.nodes.find((v: any) =>
        v.selectedOptions.every((o: any) => selected[o.name] === o.value),
      )
    : null;
  const canAdd = Boolean(variant?.availableForSale);
  const price = variant?.price ?? product.priceRange.minVariantPrice;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-8">
      <nav className="mb-8 text-[13px] text-[#171717]/60">
        <Link to="/shop" className="hover:text-[#008F95]">
          Shop
        </Link>{' '}
        / <span className="text-[#171717]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div className="bg-[#f5f4f1]">
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
            Tasse incluse. Spedizione calcolata al momento del pagamento.
          </p>

          <div className="mt-8 space-y-6">
            {product.options.map((option: any) => {
              if (option.optionValues.length <= 1) return null;
              const color = isColor(option.name);
              return (
                <div key={option.name}>
                  <p className="mb-2 text-[14px]">
                    {isSize(option.name)
                      ? 'Taglia:'
                      : color
                        ? 'Colore:'
                        : `${option.name}:`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.optionValues.map((val: any) => {
                      const sel = selected[option.name] === val.name;
                      const avail = available.has(`${option.name}:${val.name}`);
                      if (color) {
                        return (
                          <button
                            key={val.name}
                            type="button"
                            title={val.name}
                            disabled={!avail}
                            onClick={() =>
                              setSelected((s) => ({...s, [option.name]: val.name}))
                            }
                            style={{
                              backgroundColor: COLORS[val.name.toLowerCase()] ?? '#cccccc',
                            }}
                            className={`size-8 rounded-full border-2 transition ${
                              sel ? 'border-[#171717]' : 'border-[#171717]/20'
                            } ${!avail ? 'opacity-30' : ''}`}
                          />
                        );
                      }
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
                </div>
              );
            })}

            <div>
              <p className="mb-2 text-[14px]">Quantità:</p>
              <div className="inline-flex items-center border border-[#171717]/25">
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

            <button
              type="button"
              className="flex items-center gap-2 text-[14px] text-[#171717]/70 hover:text-[#008F95]"
            >
              <Ruler className="size-4" /> Size Chart
            </button>

            <div className="[&_button]:w-full [&_button]:bg-[#171717] [&_button]:py-4 [&_button]:text-[13px] [&_button]:font-bold [&_button]:uppercase [&_button]:tracking-[0.2em] [&_button]:text-white [&_button:disabled]:opacity-40">
              <AddToCartButton
                disabled={!canAdd}
                onClick={() => open('cart')}
                lines={variant ? [{merchandiseId: variant.id, quantity: qty}] : []}
              >
                {!allChosen ? 'Seleziona' : canAdd ? 'Aggiungi al carrello' : 'Esaurito'}
              </AddToCartButton>
            </div>
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
    </section>
  );
}

const PRODUCT_QUERY = `#graphql
  query PdpProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      handle
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
