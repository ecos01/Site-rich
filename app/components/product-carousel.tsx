'use client';

import {useRef} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {StoreCard} from '@/components/StoreCard';
import type {StoreProduct} from '@/components/QuickShop';

// Horizontal scroll strip of the same StoreCards used on the shop grid.
export function ProductCarousel({products}: {products: StoreProduct[]}) {
  const items = products.slice(0, 12);
  const track = useRef<HTMLDivElement>(null);

  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    el.scrollBy({left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: 'smooth'});
  };

  if (!items.length) return null;

  return (
    <section className="relative mt-16 px-6 md:px-12">
      <div className="group/carousel relative">
        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((p) => (
            <div
              key={p.id}
              data-card
              className="w-[46%] shrink-0 snap-start md:w-[calc((100%-4rem)/5)]"
            >
              <StoreCard product={p} />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Prodotti precedenti"
          onClick={() => slide(-1)}
          className="absolute left-2 top-[35%] z-10 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#171717]/70 text-white opacity-0 transition-[opacity,background-color] duration-300 hover:bg-[#008F95] group-hover/carousel:opacity-100 max-md:opacity-100"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Prossimi prodotti"
          onClick={() => slide(1)}
          className="absolute right-2 top-[35%] z-10 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#171717]/70 text-white opacity-0 transition-[opacity,background-color] duration-300 hover:bg-[#008F95] group-hover/carousel:opacity-100 max-md:opacity-100"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
