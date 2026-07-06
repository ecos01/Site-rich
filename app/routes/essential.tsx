import {useLoaderData} from 'react-router';
import type {Route} from './+types/essential';
import {ShopPage} from '@/components/ShopPage';
import {loadShopCollection} from '@/lib/shop';

// Essentials = wardrobe basics — same product set as /collections/abbigliamento.
export const meta = () => [{title: 'Essentials — LAB19'}];

export async function loader({context, request}: Route.LoaderArgs) {
  const data = await loadShopCollection(context.storefront, request, 'abbigliamento');
  return {...data, products: data.products.slice(0, 5)};
}

export default function EssentialPage() {
  const {products, sizes} = useLoaderData<typeof loader>();
  return <ShopPage title="Essentials" products={products} sizes={sizes} />;
}
