import {useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {ShopPage} from '@/components/ShopPage';
import {loadShopCollection} from '@/lib/shop';

export const meta = ({data}: {data?: {title: string}}) => [
  {title: `${data?.title ?? 'Shop'} — LAB19`},
];

export async function loader({context, request, params}: Route.LoaderArgs) {
  return loadShopCollection(context.storefront, request, params.handle);
}

export default function CollectionPage() {
  const {title, products, sizes} = useLoaderData<typeof loader>();
  return <ShopPage title={title} products={products} sizes={sizes} />;
}
