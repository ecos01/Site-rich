import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useQuickShop, money, type StoreProduct} from '@/components/QuickShop';

// LAB19 / OneBlockDown-style product card: image, brand, title, price, and a
// "SCEGLI LA TAGLIA" button that opens the size drawer.
export function StoreCard({product}: {product: StoreProduct}) {
  const {openQuickShop} = useQuickShop();
  const onSale =
    Number(product.compareAtPriceRange.minVariantPrice.amount) >
    Number(product.priceRange.minVariantPrice.amount);

  return (
    <div className="group flex h-full flex-col">
      <Link to={`/products/${product.handle}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#f5f4f1]">
          {product.featuredImage && (
            <Image
              data={product.featuredImage}
              sizes="(min-width: 768px) 20vw, 45vw"
              className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <div className="mt-4 flex-1 text-center">
          {product.vendor && (
            <p className="text-[13px] font-medium text-[#171717]">
              {product.vendor}
            </p>
          )}
          <p className="mt-0.5 text-[13px] text-[#171717]/70">{product.title}</p>
          <p className="mt-1 text-[13px] text-[#171717]">
            {onSale && (
              <span className="mr-2 text-[#171717]/40 line-through">
                {money(product.compareAtPriceRange.minVariantPrice)}
              </span>
            )}
            {money(product.priceRange.minVariantPrice)}
          </p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => openQuickShop(product)}
        className="mt-3 rounded-full border border-[#171717] py-2.5 text-[12px] font-medium uppercase tracking-[0.15em] transition-colors hover:bg-[#171717] hover:text-white"
      >
        Scegli la taglia
      </button>
    </div>
  );
}
