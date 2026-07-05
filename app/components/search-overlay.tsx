'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import { BRANDS, brandSlug } from '@/lib/brands';

const SUGGESTIONS = [
  'air max',
  'new balance',
  'nike',
  'adidas',
  'air jordan',
  'asics',
  'puma lamelo',
  'ys-01',
];

// Header search: slides a panel down from the top (same grid-rows effect as
// the mega-nav dropdown). Left column = frequent suggestions, right = live
// product results.
export function SearchButton() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const q = query.trim().toLowerCase();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // focus after the panel starts expanding
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, [open]);

  const products = q
    ? PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      ).slice(0, 12)
    : [];
  const brands = q ? BRANDS.filter((b) => b.toLowerCase().includes(q)) : [];

  const panel = (
    <div className={`fixed inset-0 z-[200] ${open ? '' : 'pointer-events-none'}`}>
      {/* dim backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-[#171717]/30 transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* slide-down panel — grid-rows 0fr→1fr like the mega-nav */}
      <div
        className={`relative grid overflow-hidden bg-[#fafafa] transition-[grid-template-rows] duration-500 ease-out ${
          open
            ? 'grid-rows-[1fr] border-b border-[#171717]/15 shadow-[0_20px_40px_-24px_rgba(23,23,23,0.35)]'
            : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0">
          <div className="mx-auto w-full max-w-[1400px] px-6 py-6 md:px-10">
            {/* input row */}
            <div className="flex items-center gap-4">
              <label className="flex flex-1 items-center gap-3 border border-[#171717]/30 px-4 py-2.5 focus-within:border-[#008F95]">
                <Search className="size-5 shrink-0 text-[#171717]/60" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ricerca"
                  aria-label="Cerca sul sito"
                  className="w-full bg-transparent text-[15px] uppercase tracking-[0.08em] outline-none placeholder:text-[#171717]/40"
                />
              </label>
              <button
                aria-label="Close search"
                onClick={() => setOpen(false)}
                className="cursor-pointer transition-opacity hover:opacity-60"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* columns */}
            <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[minmax(220px,1fr)_2fr]">
              {/* suggestions */}
              <div>
                <h3 className="border-b border-[#171717]/30 pb-2 text-[13px] font-bold uppercase tracking-[0.15em]">
                  Suggerimenti frequenti
                </h3>
                <ul className="mt-4 space-y-3">
                  {SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button
                        onClick={() => setQuery(s)}
                        className="flex cursor-pointer items-center gap-3 text-[14px] text-[#171717]/80 transition-colors hover:text-[#008F95]"
                      >
                        <Search className="size-4 text-[#171717]/50" />
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* products */}
              <div>
                <h3 className="border-b border-[#171717]/30 pb-2 text-[13px] font-bold uppercase tracking-[0.15em]">
                  Prodotti
                </h3>
                {!q && (
                  <p className="mt-4 text-[14px] text-[#171717]/60">
                    Iniziare a digitare i risultati della ricerca
                  </p>
                )}
                {q && !products.length && !brands.length && (
                  <p className="mt-4 text-[14px] text-[#171717]/60">
                    Nessun risultato per “{query}”.
                  </p>
                )}
                {brands.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {brands.map((b) => (
                      <li key={b}>
                        <Link
                          href={`/shop/${brandSlug(b)}`}
                          onClick={() => setOpen(false)}
                          className="text-[14px] font-bold uppercase tracking-[0.05em] transition-colors hover:text-[#008F95]"
                        >
                          {b}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {products.length > 0 && (
                  <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {products.map((p) => (
                      <li key={p.id}>
                        <Link
                          href="/shop"
                          onClick={() => setOpen(false)}
                          className="group block"
                        >
                          <div className="relative aspect-square overflow-hidden bg-[#f0efec]">
                            <Image
                              src={p.img}
                              alt={p.name}
                              fill
                              unoptimized
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <span className="mt-2 block text-[12px] font-bold uppercase tracking-[0.1em] transition-colors group-hover:text-[#008F95]">
                            {p.name}
                          </span>
                          <span className="text-[12px] text-[#171717]/60">{p.price}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="cursor-pointer transition-opacity hover:opacity-60"
      >
        <Search className="size-5" />
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
