import {useMemo, useState} from 'react';
import Link from 'next/link';
import {Search} from 'lucide-react';
import {Reveal} from '@/components/reveal';
import {BRANDS, ALPHABET, brandLetter, brandSlug} from '@/lib/brands';

export const meta = () => [{title: 'Brands — RICK'}];

export default function BrandsPage() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const name of BRANDS) {
      if (q && !name.toLowerCase().includes(q)) continue;
      const l = brandLetter(name);
      (map.get(l) ?? map.set(l, []).get(l)!).push(name);
    }
    return map;
  }, [q]);

  return (
    <section className="mx-auto w-full max-w-[948px] px-6 py-16 md:px-8">
      <Reveal>
        <h1 className="font-display text-center uppercase text-[clamp(2.5rem,6vw,5rem)]">
          Brands
        </h1>
      </Reveal>

      <Reveal>
        <nav className="mt-10 flex flex-wrap justify-center gap-x-2 gap-y-2 text-[13px] font-bold uppercase tracking-[0.1em]">
          {ALPHABET.map((l) => {
            const has = groups.has(l);
            return has ? (
              <a
                key={l}
                href={`#letter-${l}`}
                className="text-[#171717] transition-colors hover:text-[#008F95]"
              >
                {l}
              </a>
            ) : (
              <span key={l} className="text-[#171717]/25">
                {l}
              </span>
            );
          })}
        </nav>
      </Reveal>

      <Reveal>
        <label className="mx-auto mt-10 flex max-w-[520px] items-center gap-3 border-b border-[#171717]/30 pb-3 focus-within:border-[#008F95]">
          <Search className="size-4 shrink-0 text-[#171717]/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Brands…"
            aria-label="Search brands"
            className="w-full bg-transparent text-[14px] uppercase tracking-[0.1em] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-[#171717]/40"
          />
        </label>
      </Reveal>

      <div className="mt-14 gap-x-10 md:columns-3">
        {ALPHABET.filter((l) => groups.has(l)).map((l) => (
          <div key={l} id={`letter-${l}`} className="mb-10 break-inside-avoid scroll-mt-28">
            <h2 className="font-display mb-4 border-b border-[#171717]/20 pb-2 text-2xl uppercase">
              {l}
            </h2>
            <ul className="space-y-3">
              {groups.get(l)!.map((name) => (
                <li key={name}>
                  <Link
                    href={`/collections/${brandSlug(name)}`}
                    className="text-[15px] text-[#171717]/80 transition-colors hover:text-[#008F95]"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {groups.size === 0 && (
        <p className="mt-14 text-center text-[15px] text-[#171717]/60">
          Nessun brand per “{query}”.
        </p>
      )}
    </section>
  );
}
