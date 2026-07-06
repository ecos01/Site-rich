import {useLoaderData} from 'react-router';
import type {Route} from './+types/shop.$slug';
import {ShopPage} from '@/components/ShopPage';
import {loadShopCollection} from '@/lib/shop';

// Mega-nav + /brands landing pages — same grid/filter/quick-shop as
// /collections/:handle (loadShopCollection already resolves brand slugs).
const TITLE_OVERRIDES: Record<string, string> = {
  sneakers: 'Sneakers',
  'comfort-shoes': 'Comfort Shoes',
  'scarpe-classiche': 'Scarpe Classiche',
};

export const meta = ({data}: {data?: {title: string}}) => [
  {title: data ? `${data.title} — LAB19` : 'Shop — LAB19'},
];

export async function loader({context, request, params}: Route.LoaderArgs) {
  const data = await loadShopCollection(context.storefront, request, params.slug);
  const title = TITLE_OVERRIDES[params.slug!] ?? data.title;
  return {...data, title};
}

export default function ShopCategoryPage() {
  const {title, products, sizes} = useLoaderData<typeof loader>();
  return <ShopPage title={title} products={products} sizes={sizes} />;
}
