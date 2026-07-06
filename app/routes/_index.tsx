import Link from 'next/link';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {ArrowRight, ArrowUpRight} from 'lucide-react';
import {HeroSection} from '@/components/hero';
import {Reveal} from '@/components/reveal';
import {CategoryDivider} from '@/components/site';
import {StoreCard} from '@/components/StoreCard';
import {ProductCarousel} from '@/components/product-carousel';
import type {StoreProduct} from '@/components/QuickShop';
import {getShopProducts} from '@/lib/shop';

export const meta = () => [{title: 'LAB19 — Wear the Noise'}];

export async function loader({context}: Route.LoaderArgs) {
  const [recent, featured] = await Promise.all([
    getShopProducts(context.storefront, {first: 5, sort: 'created-desc'}),
    getShopProducts(context.storefront, {first: 10, sort: 'best-selling'}),
  ]);
  return {recent, featured};
}

export default function Home() {
  const {recent, featured} = useLoaderData<typeof loader>();
  return (
    <>
      <HeroSection />
      <CategoryDivider title="New Drop" align="left" />
      <ProductCarousel products={recent as StoreProduct[]} />
      <FeaturedSection products={featured as StoreProduct[]} />
      <CampaignTeaser />
    </>
  );
}

function FeaturedSection({products}: {products: StoreProduct[]}) {
  return (
    <section className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-8">
      <Reveal>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#008F95]">
              In evidenza
            </span>
            <h3 className="font-display mt-2 uppercase text-[clamp(1.75rem,3.5vw,3rem)]">
              Featured pieces
            </h3>
          </div>
          <Link
            href="/shop"
            className="group hidden items-center gap-2 text-sm font-medium uppercase tracking-[0.1em] text-[#008F95] md:inline-flex"
          >
            View all
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:grid-cols-5">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 5) * 0.08}>
            <StoreCard product={p} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-12 flex justify-center">
        <Link href="/collections/abbigliamento" className="btn-brutal">
          <span>Tutto lo shop</span>
        </Link>
      </Reveal>
    </section>
  );
}

function CampaignTeaser() {
  return (
    <section className="mt-16 bg-[#FFE1BA] px-6 py-12 md:px-8 md:py-14">
      <div className="mx-auto grid w-full max-w-[948px] grid-cols-1 gap-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Reveal>
            <h2 className="font-display uppercase text-[clamp(2rem,4vw,3.75rem)] leading-[0.9] tracking-tight">
              Garments set like headlines, worn like manifestos.
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-4">
          <Reveal delay={0.1}>
            <Link
              href="/nineteen"
              className="group flex items-center justify-between border-t border-[#171717]/20 py-6"
            >
              <span className="text-[15px] font-medium">Shop Nineteen</span>
              <span className="flex size-9 items-center justify-center rounded-full border border-[#171717]/40 transition-colors duration-300 group-hover:border-[#008F95] group-hover:text-[#008F95]">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
