import {useLoaderData} from 'react-router';
import type {Route} from './+types/altro';
import {ShopPage} from '@/components/ShopPage';
import {loadShopCollection} from '@/lib/shop';

export const meta = () => [{title: 'Altro — LAB19'}];

export async function loader({context, request}: Route.LoaderArgs) {
  return loadShopCollection(context.storefront, request, 'all');
}

export default function AltroPage() {
  const {products, sizes} = useLoaderData<typeof loader>();
  return <ShopPage title="Altro" products={products} sizes={sizes} />;
}
