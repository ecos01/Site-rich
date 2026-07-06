import {useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {ShopPage} from '@/components/ShopPage';
import {loadShopCollection} from '@/lib/shop';
import {JsonLd} from '@/components/JsonLd';
import {breadcrumbSchema} from '@/lib/structured-data';

export const meta = ({data}: {data?: {title: string}}) => [
  {title: `${data?.title ?? 'Shop'} — LAB19`},
];

export async function loader({context, request, params}: Route.LoaderArgs) {
  const data = await loadShopCollection(context.storefront, request, params.handle);
  return {...data, origin: new URL(request.url).origin};
}

export default function CollectionPage() {
  const {title, products, sizes, origin} = useLoaderData<typeof loader>();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          {name: 'Home', url: origin},
          {name: 'Shop', url: `${origin}/shop`},
          {name: title},
        ])}
      />
      <ShopPage title={title} products={products} sizes={sizes} />
    </>
  );
}
