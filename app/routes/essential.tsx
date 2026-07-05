import {CategoryDivider} from '@/components/site';
import {ShopGrid} from '@/components/shop-grid';
import {MegaNav} from '@/components/mega-nav';
import {ShopBanner} from '@/components/shop-banner';
import {PRODUCTS} from '@/lib/products';

export const meta = () => [{title: 'Essentials — RICK'}];

// Essentials = wardrobe basics (tops + bottoms).
const ITEMS = PRODUCTS.filter(
  (p) => p.category === 'Tops' || p.category === 'Bottoms',
);

export default function EssentialPage() {
  return (
    <>
      <ShopBanner />
      <MegaNav />
      <CategoryDivider title="Essentials" align="left" />
      <ShopGrid products={ITEMS} />
    </>
  );
}
