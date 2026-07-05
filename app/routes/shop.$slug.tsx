import {useLoaderData} from 'react-router';
import {CategoryDivider} from '@/components/site';
import {ShopGrid} from '@/components/shop-grid';
import {MegaNav} from '@/components/mega-nav';
import {ShopBanner} from '@/components/shop-banner';
import {PRODUCTS, type Product} from '@/lib/products';
import {BRANDS, brandSlug} from '@/lib/brands';

// Mega-nav + /brands landing pages: product types + every brand.
// ponytail: fallback catalog has no real brand/type data — every slug filters to
// shoes (or a name match) until the Storefront sync lands.
const shoes = (p: Product) => p.category === 'Shoes';

const SLUGS: Record<string, {title: string; filter: (p: Product) => boolean}> = {
  sneakers: {title: 'Sneakers', filter: shoes},
  'comfort-shoes': {title: 'Comfort Shoes', filter: shoes},
  'scarpe-classiche': {title: 'Scarpe Classiche', filter: shoes},
};
for (const name of BRANDS) {
  const re = new RegExp(name.replace(/[^a-z0-9]+/gi, '.?'), 'i');
  SLUGS[brandSlug(name)] = {
    title: name,
    filter: (p) => re.test(p.name) || shoes(p),
  };
}

export const meta = ({data}: {data?: {title: string}}) => [
  {title: data ? `${data.title} — RICK` : 'Shop — RICK'},
];

export async function loader({params}: {params: {slug: string}}) {
  const entry = SLUGS[params.slug];
  if (!entry) throw new Response('Not Found', {status: 404});
  return {title: entry.title, products: PRODUCTS.filter(entry.filter)};
}

export default function ShopCategoryPage() {
  const {title, products} = useLoaderData<typeof loader>();
  return (
    <>
      <ShopBanner />
      <MegaNav />
      <CategoryDivider title={title} align="left" />
      <ShopGrid products={products} />
    </>
  );
}
