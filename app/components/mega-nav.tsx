'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';

type Col = { heading: string; links: { label: string; href: string }[] };
type Panel = { cols: Col[]; cards: { name: string; img: string; href: string }[] };

const shoe = (i: number) => PRODUCTS.filter((p) => p.category === 'Shoes')[i];

const PANELS: Record<string, Panel> = {
  ABBIGLIAMENTO: {
    cols: [
      {
        heading: 'Per prodotto',
        links: [
          { label: 'Vedi Tutto', href: '/collections/abbigliamento' },
          { label: 'Essentials', href: '/essential' },
          { label: 'Supreme', href: '/supreme' },
          { label: 'Altro', href: '/altro' },
        ],
      },
    ],
    cards: [
      { name: 'Essentials', img: PRODUCTS[0].img, href: '/collections/abbigliamento' },
      { name: 'Altro', img: PRODUCTS[2].img, href: '/collections/abbigliamento' },
    ],
  },
  CALZATURE: {
    cols: [
      {
        heading: 'Per prodotto',
        links: [
          { label: 'Vedi Tutto', href: '/collections/calzature' },
        ],
      },
      {
        heading: 'Brand in evidenza',
        links: [
          { label: 'Nike', href: '/collections/nike' },
          { label: 'Adidas', href: '/collections/adidas' },
          { label: 'Asics', href: '/collections/asics' },
          { label: 'New Balance', href: '/collections/new-balance' },
        ],
      },
    ],
    cards: [
      { name: shoe(0).name, img: shoe(0).img, href: '/collections/calzature' },
      { name: shoe(2).name, img: shoe(2).img, href: '/collections/calzature' },
    ],
  },
};

// NOVITÀ + BRAND are direct links; ABBIGLIAMENTO + CALZATURE open panels.
const ITEMS: { label: string; href: string; panel?: boolean }[] = [
  { label: 'NOVITÀ', href: '/collections/novita' },
  { label: 'BRAND', href: '/brands' },
  { label: 'ABBIGLIAMENTO', href: '/collections/abbigliamento', panel: true },
  { label: 'CALZATURE', href: '/collections/calzature', panel: true },
];

export function MegaNav() {
  const [open, setOpen] = useState<string | null>(null);
  const panel = open ? PANELS[open] : null;

  return (
    <div
      className="relative border-y border-[#171717]/15 bg-[#fafafa]"
      onMouseLeave={() => setOpen(null)}
    >
      <nav className="mx-auto flex w-full max-w-[948px] items-center justify-start gap-5 overflow-x-auto whitespace-nowrap px-4 pb-[9px] [scrollbar-width:none] md:justify-center md:gap-8 md:overflow-visible md:px-8 [&::-webkit-scrollbar]:hidden">
        {ITEMS.map((it) => (
          <Link
            key={it.label}
            href={it.href}
            onMouseEnter={() => setOpen(it.panel ? it.label : null)}
            className={`flex items-center gap-1 py-3 text-[13px] font-bold uppercase tracking-[0.12em] transition-colors hover:text-[#008F95] ${
              open === it.label ? 'text-[#008F95]' : 'text-[#171717]'
            }`}
          >
            {it.label}
            {it.panel && (
              <ChevronDown
                className={`size-3.5 transition-transform duration-300 ${
                  open === it.label ? 'rotate-180' : ''
                }`}
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Dropdown — expands downward (grid-rows 0fr→1fr) */}
      <div
        className={`absolute inset-x-0 top-full z-40 grid overflow-hidden bg-[#ffffff] transition-[grid-template-rows] duration-500 ease-out ${
          panel ? 'grid-rows-[1fr] border-b border-[#171717]/15 shadow-[0_20px_40px_-24px_rgba(23,23,23,0.35)]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0">
          {panel && (
            <div className="mx-auto grid w-full max-w-[948px] grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4 md:px-8">
              {panel.cols.map((col) => (
                <div key={col.heading}>
                  <h3 className="mb-5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#171717]">
                    {col.heading}
                  </h3>
                  <ul className="space-y-3">
                    {col.links.map((l, i) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className={`text-[15px] transition-colors hover:text-[#008F95] ${
                            i === 0 ? 'font-bold text-[#171717]' : 'text-[#171717]/70'
                          }`}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {panel.cards.map((c) => (
                <Link key={c.name} href={c.href} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f0efec]">
                    <Image
                      src={c.img}
                      alt={c.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <span className="mt-2 block text-[12px] font-bold uppercase tracking-[0.15em] text-[#171717] transition-colors group-hover:text-[#008F95]">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
