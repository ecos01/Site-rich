import {Await} from 'react-router';
import {Suspense} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Aside} from '@/components/Aside';
import {CartMain} from '@/components/CartMain';
import {QuickShopProvider, QuickShopAside} from '@/components/QuickShop';
import {Nav} from '@/components/site';
import {Footer} from '@/components/footer';

// Site chrome: my StaggeredMenu Nav + Footer, wrapped in the Aside provider so the
// bag icon can open the Shopify-backed cart drawer. Search/mobile asides dropped
// (my Nav has its own). Root passes the deferred cart promise.
interface PageLayoutProps {
  cart?: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function PageLayout({cart, children = null}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <QuickShopProvider>
        <CartAside cart={cart} />
        <QuickShopAside />
        <Nav cart={cart} />
        <main className="flex-1">{children}</main>
        <Footer />
      </QuickShopProvider>
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart?: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="Carrello">
      <Suspense fallback={<p className="text-sm text-[#171717]/60">Carico…</p>}>
        <Await resolve={cart}>
          {(resolved) => <CartMain cart={resolved ?? null} layout="aside" />}
        </Await>
      </Suspense>
    </Aside>
  );
}
