'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Reveal } from '@/components/reveal';
import { ProductCard } from '@/components/site';
import { PRODUCTS, type Product } from '@/lib/products';

export function ShopGrid({ products = PRODUCTS }: { products?: Product[] }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const results = q
    ? products.filter((p) => p.name.toLowerCase().includes(q))
    : products;

  return (
    <section className="mx-auto w-full max-w-[948px] px-6 pb-16 md:px-8">
      <Reveal>
        <div className="mb-8 border-t border-[#171717]/20 pt-6">
          <label className="flex items-center gap-3 border-b border-[#171717]/30 pb-3 focus-within:border-[#008F95]">
            <Search className="size-4 shrink-0 text-[#171717]/50" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca un prodotto…"
              aria-label="Cerca un prodotto"
              className="w-full bg-transparent text-[14px] uppercase tracking-[0.1em] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-[#171717]/40"
            />
          </label>
          <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.2em] text-[#008F95]">
            {q ? `Risultati — ${String(results.length).padStart(2, '0')}` : `All pieces — ${String(products.length).padStart(2, '0')}`}
          </p>
        </div>
      </Reveal>
      {results.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-4 md:gap-y-10">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-[15px] text-[#171717]/60">
          Nessun prodotto per “{query}”. Prova un altro nome.
        </p>
      )}
    </section>
  );
}
