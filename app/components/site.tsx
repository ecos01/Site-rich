'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';
import { Await } from 'react-router';
import { ShoppingBag } from 'lucide-react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import nineteenLogo from '~/assets/nineteen-logo-transparent.png';
import { buyNow } from '@/actions';
import { useAside } from '@/components/Aside';
import StaggeredMenu from '@/components/StaggeredMenu';
import { SearchButton } from '@/components/search-overlay';
import { UserMenu } from '@/components/user-menu';
import { Reveal } from '@/components/reveal';
import type { Product } from '@/lib/products';

const MENU_ITEMS = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Abbigliamento', ariaLabel: 'Abbigliamento', link: '/collections/abbigliamento' },
  { label: 'Calzature', ariaLabel: 'Calzature', link: '/collections/calzature' },
  {
    label: (
      <img src={nineteenLogo} alt="" className="h-10 w-auto" />
    ),
    ariaLabel: 'Shop Nineteen',
    link: '/nineteen',
  },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
];

const SOCIAL_ITEMS = [
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'YouTube', link: 'https://youtube.com' },
];

export function Nav({
  cart,
}: {
  cart?: Promise<CartApiQueryFragment | null>;
}) {
  const pathname = usePathname();
  const {open} = useAside();
  // Pages that render the black ShopBanner at the very top — controls must be
  // white there so they read on the dark strip (see ShopPage).
  const onShopBanner =
    pathname === '/shop' ||
    pathname.startsWith('/shop/') ||
    pathname.startsWith('/collections/') ||
    ['/essential', '/altro', '/supreme', '/nineteen'].includes(pathname);
  return (
    <StaggeredMenu
      isFixed
      position="right"
      showLogo={pathname === '/'}
      items={MENU_ITEMS}
      socialItems={SOCIAL_ITEMS}
      displaySocials
      displayItemNumbering={false}
      menuButtonColor="#171717"
      openMenuButtonColor="#171717"
      changeMenuColorOnOpen={false}
      whiteControlsAtTop={onShopBanner}
      logoUrl="/logo.png"
      colors={['#9BDCEC', '#008F95']}
      accentColor="#008F95"
      headerExtras={
        <>
          <SearchButton />
          <button
            aria-label="Shopping bag"
            onClick={() => open('cart')}
            className="relative cursor-pointer transition-opacity hover:opacity-60"
          >
            <ShoppingBag className="size-5" />
            {cart && (
              <Suspense fallback={null}>
                <Await resolve={cart}>
                  {(resolved) => {
                    const count = resolved?.totalQuantity ?? 0;
                    if (!count) return null;
                    return (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#008F95] px-1 text-[10px] font-bold leading-none text-white">
                        {count}
                      </span>
                    );
                  }}
                </Await>
              </Suspense>
            )}
          </button>
          <UserMenu />
        </>
      }
    />
  );
}

export function CategoryDivider({
  title,
  align,
}: {
  title: ReactNode;
  align: 'left' | 'right';
}) {
  return (
    <section
      className="relative overflow-hidden py-10 md:py-14"
      style={{
        background:
          'radial-gradient(60% 100% at 50% 50%, rgb(255 225 186 / 0.55), transparent)',
      }}
    >
      <Reveal>
        <h2
          className={`font-display mx-auto w-full max-w-[948px] uppercase text-[clamp(2.25rem,5vw,4.5rem)] tracking-tighter opacity-90 px-6 md:px-8 ${
            align === 'right' ? 'text-right' : 'text-left'
          }`}
        >
          {title}
        </h2>
      </Reveal>
    </section>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const onSale = Boolean(product.salePrice);
  const frame = (
    <div className="relative aspect-[3/4] overflow-hidden">
      {product.isNew && (
        <span className="absolute left-3 top-3 z-10 bg-[#008F95] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
          New
        </span>
      )}
      {onSale && (
        <span className="absolute right-3 top-3 z-10 bg-[#171717] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FFE1BA]">
          Sale
        </span>
      )}
      <Image
        src={product.img}
        alt={product.name}
        width={600}
        height={800}
        unoptimized
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
  );
  return (
    <div className="group block">
      <Link href="/shop" className="block">
        {frame}
        <div className="mt-4 flex items-baseline justify-between">
          <h3 className="text-[14px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 group-hover:text-[#008F95]">
            {product.name}
          </h3>
          {onSale ? (
            <span className="text-[14px]">
              <span className="mr-2 text-[#171717]/40 line-through">{product.price}</span>
              <span className="font-bold text-[#008F95]">{product.salePrice}</span>
            </span>
          ) : (
            <span className="text-[14px] text-[#171717]/60">{product.price}</span>
          )}
        </div>
      </Link>
      {/* Shopify checkout: only shows when the product carries a variantId (live store). */}
      {product.variantId && (
        <form action={buyNow} className="mt-3">
          <input type="hidden" name="variantId" value={product.variantId} />
          <button
            type="submit"
            className="w-full border border-[#171717] py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-[#171717] hover:text-white"
          >
            Add to bag
          </button>
        </form>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#171717] px-6 pt-24 text-[#FFFFFF] md:px-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
        <div>
          <span className="font-display text-3xl uppercase">RICK</span>
          <div className="mt-6 flex gap-4 text-[14px] uppercase tracking-[0.1em]">
            {SOCIAL_ITEMS.map((s) => (
              <a
                key={s.label}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#FFE1BA]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-[14px] font-bold uppercase tracking-[0.15em]">Shop</h4>
          <ul className="space-y-2 text-[14px] text-[#FFFFFF]/70">
            {['New arrivals', 'Outerwear', 'Tops', 'Shoes'].map((l) => (
              <li key={l}>
                <Link href="/shop" className="transition-colors hover:text-[#FFE1BA]">{l}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[14px] font-bold uppercase tracking-[0.15em]">House</h4>
          <ul className="space-y-2 text-[14px] text-[#FFFFFF]/70">
            <li><Link href="/about" className="transition-colors hover:text-[#FFE1BA]">About</Link></li>
            <li><Link href="/nineteen" className="transition-colors hover:text-[#FFE1BA]">Nineteen</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-[#FFE1BA]">Stockists</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-[#FFE1BA]">Contact</Link></li>
          </ul>
        </div>
        <div className="text-[14px] text-[#FFFFFF]/70">
          <h4 className="mb-4 font-bold uppercase tracking-[0.15em] text-[#FFFFFF]">Newsletter</h4>
          <p>Occasional loud dispatches. No noise about the noise.</p>
        </div>
      </div>
      <div className="relative mt-24 flex items-end justify-between pb-8">
        <span className="font-display select-none uppercase text-[clamp(3.5rem,7vw,7rem)] leading-none text-white/10">
          2024
        </span>
        <span className="pb-2 text-right text-[13px] text-[#FFFFFF]/50">
          © Ecos Studio. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
