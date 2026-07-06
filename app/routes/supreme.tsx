import {useLoaderData} from 'react-router';
import type {Route} from './+types/supreme';
import {ShopPage} from '@/components/ShopPage';
import {loadShopCollection} from '@/lib/shop';

export const meta = () => [{title: 'Supreme — LAB19'}];

export async function loader({context, request}: Route.LoaderArgs) {
  return loadShopCollection(context.storefront, request, 'all');
}

export default function SupremePage() {
  const {products, sizes} = useLoaderData<typeof loader>();
  return <ShopPage title="Supreme" products={products} sizes={sizes} />;
}
