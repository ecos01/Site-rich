import {useLoaderData} from 'react-router';
import type {Route} from './+types/nineteen';
import {ShopPage} from '@/components/ShopPage';
import {loadShopCollection} from '@/lib/shop';
import nineteenLogo from '@/assets/nineteen-logo-transparent.png';

// /nineteen — the brand's own line. loadShopCollection('nineteen') returns only
// the NINETEEN_HANDLES products, which are excluded from every other page.
export const meta = () => [{title: 'Nineteen — LAB19'}];

export async function loader({context, request}: Route.LoaderArgs) {
  return loadShopCollection(context.storefront, request, 'nineteen');
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
