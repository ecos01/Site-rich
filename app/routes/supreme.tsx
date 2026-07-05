import {CategoryDivider} from '@/components/site';
import {ShopGrid} from '@/components/shop-grid';
import {MegaNav} from '@/components/mega-nav';
import {ShopBanner} from '@/components/shop-banner';
import {FEATURED} from '@/lib/products';

export const meta = () => [{title: 'Supreme — RICK'}];

export default function SupremePage() {
  return (
    <>
      <ShopBanner />
      <MegaNav />
      <CategoryDivider title="Supreme" align="left" />
      <ShopGrid products={FEATURED} />
    </>
  );
}
