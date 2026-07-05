import {useLoaderData} from 'react-router';
import type {Route} from './+types/shop';
import {ShopPage} from '@/components/ShopPage';
import {loadShopCollection} from '@/lib/shop';

// /shop — every article across the store (all products), paginated.
export const meta = () => [{title: 'Shop — LAB19'}];

export async function loader({context, request}: Route.LoaderArgs) {
  return loadShopCollection(context.storefront, request, 'all');
}

export default function ShopPage_() {
  const {title, products, sizes} = useLoaderData<typeof loader>();
  return <ShopPage title={title} products={products} sizes={sizes} />;
}
