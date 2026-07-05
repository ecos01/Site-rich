import type {Storefront} from '@shopify/hydrogen';
import type {StoreProduct} from '@/components/QuickShop';
import {BRANDS, brandSlug} from '@/lib/brands';

// Storefront product data for the shop grid + quick-shop size drawer.
// Works against mock.shop now and the real store later (same Storefront API).

export const STORE_PRODUCT_FRAGMENT = `#graphql
  fragment StoreProduct on Product {
    id
    handle
    title
    vendor
    tags
    productType
    availableForSale
    featuredImage { id url altText width height }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    options { name optionValues { name } }
    variants(first: 40) {
      nodes {
        id
        availableForSale
        selectedOptions { name value }
        price { amount currencyCode }
      }
    }
  }
` as const;

const STORE_PRODUCTS_QUERY = `#graphql
  ${STORE_PRODUCT_FRAGMENT}
  query StoreProducts(
    $first: Int
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      nodes { ...StoreProduct }
    }
  }
` as const;

// Sort options exactly as requested (label shown in the ORDINARE menu).
export const SORT_OPTIONS = [
  {value: 'featured', label: 'In primo piano', sortKey: 'BEST_SELLING', reverse: false},
  {value: 'relevant', label: 'Più rilevanti', sortKey: 'RELEVANCE', reverse: false},
  {value: 'best-selling', label: 'Best seller', sortKey: 'BEST_SELLING', reverse: false},
  {value: 'title-asc', label: 'In ordine alfabetico, A-Z', sortKey: 'TITLE', reverse: false},
  {value: 'title-desc', label: 'In ordine alfabetico, Z-A', sortKey: 'TITLE', reverse: true},
  {value: 'price-asc', label: 'Prezzo crescente', sortKey: 'PRICE', reverse: false},
  {value: 'price-desc', label: 'Prezzo decrescente', sortKey: 'PRICE', reverse: true},
  {value: 'created-asc', label: 'Data, da meno a più recente', sortKey: 'CREATED_AT', reverse: false},
  {value: 'created-desc', label: 'Data, da più a meno recente', sortKey: 'CREATED_AT', reverse: true},
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

// Build a Shopify search query string from filter params.
export function buildQuery(opts: {
  vendor?: string | null;
  available?: boolean;
  minPrice?: number | null;
  maxPrice?: number | null;
  productType?: string | null;
  search?: string | null;
}): string | undefined {
  const parts: string[] = [];
  if (opts.search) parts.push(opts.search);
  if (opts.vendor) parts.push(`vendor:'${opts.vendor}'`);
  if (opts.productType) parts.push(`product_type:'${opts.productType}'`);
  if (opts.available) parts.push('available_for_sale:true');
  if (opts.minPrice != null) parts.push(`variants.price:>=${opts.minPrice}`);
  if (opts.maxPrice != null) parts.push(`variants.price:<=${opts.maxPrice}`);
  return parts.length ? parts.join(' ') : undefined;
}

export async function getShopProducts(
  storefront: Storefront,
  opts: {
    first?: number;
    sort?: SortValue;
    query?: string;
  } = {},
) {
  const sort =
    SORT_OPTIONS.find((s) => s.value === opts.sort) ?? SORT_OPTIONS[0];
  // RELEVANCE requires a search term; fall back to BEST_SELLING without one.
  const sortKey =
    sort.sortKey === 'RELEVANCE' && !opts.query ? 'BEST_SELLING' : sort.sortKey;
  const {products} = await storefront.query(STORE_PRODUCTS_QUERY, {
    variables: {
      first: opts.first ?? 24,
      sortKey,
      reverse: sort.reverse,
      query: opts.query,
    },
  });
  return products.nodes;
}

// --- Collection loader (shared by /shop and /collections/:handle) -----------

// Virtual collections mapped onto the products query.
const SPECIAL: Record<string, {title: string; sort?: SortValue}> = {
  novita: {title: 'Novità', sort: 'created-desc'},
  abbigliamento: {title: 'Abbigliamento'},
  calzature: {title: 'Calzature'},
  all: {title: 'Shop'},
};
const VENDOR_BY_SLUG: Record<string, string> = Object.fromEntries(
  BRANDS.map((b) => [brandSlug(b), b]),
);

const isSizeOption = (name: string) => /size|taglia/i.test(name);
function uniqueSizes(products: StoreProduct[]): string[] {
  const set = new Set<string>();
  for (const p of products)
    for (const o of p.options)
      if (isSizeOption(o.name)) for (const v of o.optionValues) set.add(v.name);
  return [...set];
}
const hasSize = (p: StoreProduct, size: string) =>
  p.variants.nodes.some(
    (v) =>
      v.availableForSale &&
      v.selectedOptions.some((o) => isSizeOption(o.name) && o.value === size),
  );
const hasGenre = (p: StoreProduct, genre: string) =>
  (p.tags ?? []).some((t) => t.toLowerCase() === genre.toLowerCase());

// Footwear detector — by product type or tag. Lets /collections/calzature show
// only shoes and /collections/abbigliamento exclude them.
const SHOE_RE = /shoe|sneaker|calzatur|footwear|boot|stivali|sandal|ciabatt|scarp/i;
const isShoe = (p: StoreProduct) =>
  SHOE_RE.test(p.productType ?? '') || (p.tags ?? []).some((t) => SHOE_RE.test(t));

export async function loadShopCollection(
  storefront: Storefront,
  request: Request,
  handle = 'abbigliamento',
): Promise<{title: string; products: StoreProduct[]; sizes: string[]}> {
  const sp = new URL(request.url).searchParams;
  const special = SPECIAL[handle];
  const vendorFromSlug = VENDOR_BY_SLUG[handle];
  const title = special?.title ?? vendorFromSlug ?? handle;

  const query = buildQuery({
    vendor: sp.get('brand') ?? vendorFromSlug ?? null,
    available: sp.get('available') === '1',
    minPrice: sp.get('minPrice') ? Number(sp.get('minPrice')) : null,
    maxPrice: sp.get('maxPrice') ? Number(sp.get('maxPrice')) : null,
  });
  const sort = (sp.get('sort') as SortValue) ?? special?.sort;

  const raw = (await getShopProducts(storefront, {
    first: 100,
    sort,
    query,
  })) as StoreProduct[];

  const sizes = uniqueSizes(raw);
  const sizeSel = sp.get('size');
  const genreSel = sp.get('genre');
  let products = raw;
  if (handle === 'calzature') products = products.filter(isShoe);
  else if (handle === 'abbigliamento') products = products.filter((p) => !isShoe(p));
  if (sizeSel) products = products.filter((p) => hasSize(p, sizeSel));
  if (genreSel) products = products.filter((p) => hasGenre(p, genreSel));

  return {title, products, sizes};
}
