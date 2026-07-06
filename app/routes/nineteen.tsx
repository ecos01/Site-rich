import {useLoaderData} from 'react-router';
import type {Route} from './+types/nineteen';
import {ShopPage} from '@/components/ShopPage';
import {loadShopCollection} from '@/lib/shop';
import nineteenLogo from '@/assets/nineteen-logo-transparent.png';

// /nineteen — the brand's own shop: every article across the store, same
// grid/filter/quick-shop as /collections/calzature (both go through ShopPage +
// loadShopCollection('all')).
export const meta = () => [{title: 'Nineteen — LAB19'}];

// ponytail: capped to a handful while the page is still a placeholder for the
// brand's own line — raise/remove once real Nineteen-branded products exist.
const PREVIEW_COUNT = 4;

export async function loader({context, request}: Route.LoaderArgs) {
  const data = await loadShopCollection(context.storefront, request, 'all');
  return {...data, products: data.products.slice(0, PREVIEW_COUNT)};
}

const logoTitle = (
  <img
    src={nineteenLogo}
    alt="Nineteen"
    className="h-[clamp(2.25rem,5vw,4.5rem)] w-auto"
  />
);

export default function NineteenPage() {
  const {products, sizes} = useLoaderData<typeof loader>();
  return <ShopPage title={logoTitle} products={products} sizes={sizes} />;
}
