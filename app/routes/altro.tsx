import {CategoryDivider} from '@/components/site';
import {ShopGrid} from '@/components/shop-grid';
import {MegaNav} from '@/components/mega-nav';
import {ShopBanner} from '@/components/shop-banner';
import {PRODUCTS} from '@/lib/products';

export const meta = () => [{title: 'Altro — RICK'}];

// Altro = the rest (outerwear + shoes).
const ITEMS = PRODUCTS.filter(
  (p) => p.category === 'Outerwear' || p.category === 'Shoes',
);

export default function AltroPage() {
  return (
    <>
      <ShopBanner />
      <MegaNav />
      <CategoryDivider title="Altro" align="left" />
      <ShopGrid products={ITEMS} />
    </>
  );
}
