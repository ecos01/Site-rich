import {useState} from 'react';
import {useSearchParams} from 'react-router';
import {ChevronDown} from 'lucide-react';
import {SORT_OPTIONS} from '@/lib/shop';
import {BRANDS} from '@/lib/brands';

const GENRES = ['Children', 'Man', 'Unisex', 'Woman'];
const PRICE_CEIL = 1000;

// FILTRO / ORDINARE bar. Both open as vertical dropdown menus. Everything is
// driven through URL search params, so the loader re-queries + re-filters.
export function ShopToolbar({count, sizes}: {count: number; sizes: string[]}) {
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState<'filter' | 'sort' | null>(null);

  const activeSort = params.get('sort') ?? 'featured';
  const activeBrand = params.get('brand');
  const activeSize = params.get('size');
  const activeGenre = params.get('genre');
  const available = params.get('available') === '1';

  // Local price state (commit to URL on slider release).
  const [minP, setMinP] = useState(Number(params.get('minPrice') ?? 0));
  const [maxP, setMaxP] = useState(Number(params.get('maxPrice') ?? PRICE_CEIL));

  function update(mutate: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params);
    mutate(next);
    setParams(next, {preventScrollReset: true});
  }
  const toggle = (key: string, val: string) =>
    update((p) => (p.get(key) === val ? p.delete(key) : p.set(key, val)));

  const activeCount =
    (activeBrand ? 1 : 0) +
    (activeSize ? 1 : 0) +
    (activeGenre ? 1 : 0) +
    (available ? 1 : 0) +
    (params.get('minPrice') || params.get('maxPrice') ? 1 : 0);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 md:px-8">
      <div className="flex items-center justify-between border-y border-[#171717]/15 py-4">
        {/* FILTRO */}
        <div className="relative">
          <button
            onClick={() => setOpen(open === 'filter' ? null : 'filter')}
            className="flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.12em]"
          >
            Filtro{activeCount ? ` (${activeCount})` : ''}
            <ChevronDown
              className={`size-4 transition-transform ${open === 'filter' ? 'rotate-180' : ''}`}
            />
          </button>
          {open === 'filter' && (
            <div className="absolute left-0 top-full z-40 mt-3 max-h-[70vh] w-[300px] overflow-y-auto border border-[#171717]/15 bg-white p-5 shadow-[0_16px_32px_-16px_rgba(23,23,23,0.35)]">
              {/* Disponibilità */}
              <FilterSection title="Disponibilità">
                <label className="flex cursor-pointer items-center gap-2 text-[14px]">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) =>
                      update((p) =>
                        e.target.checked ? p.set('available', '1') : p.delete('available'),
                      )
                    }
                  />
                  Solo disponibili
                </label>
              </FilterSection>

              {/* Genere */}
              <FilterSection title="Genere">
                <div className="flex flex-col gap-1.5">
                  {GENRES.map((g) => (
                    <label
                      key={g}
                      className="flex cursor-pointer items-center gap-2 text-[14px]"
                    >
                      <input
                        type="checkbox"
                        checked={activeGenre === g}
                        onChange={() => toggle('genre', g)}
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Taglia */}
              {sizes.length > 0 && (
                <FilterSection title="Taglia">
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggle('size', s)}
                        className={`min-w-[3rem] border px-2 py-1.5 text-[13px] transition-colors ${
                          activeSize === s
                            ? 'border-[#171717] bg-[#171717] text-white'
                            : 'border-[#171717]/25 hover:border-[#171717]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </FilterSection>
              )}

              {/* Prezzo (slider) */}
              <FilterSection title="Prezzo">
                <div className="text-[13px]">
                  Da €{minP} – A €{maxP}
                </div>
                <input
                  type="range"
                  aria-label="Prezzo minimo"
                  min={0}
                  max={PRICE_CEIL}
                  step={10}
                  value={minP}
                  onChange={(e) => setMinP(Math.min(Number(e.target.value), maxP))}
                  onPointerUp={() =>
                    update((p) => (minP > 0 ? p.set('minPrice', String(minP)) : p.delete('minPrice')))
                  }
                  className="mt-2 w-full accent-[#008F95]"
                />
                <input
                  type="range"
                  aria-label="Prezzo massimo"
                  min={0}
                  max={PRICE_CEIL}
                  step={10}
                  value={maxP}
                  onChange={(e) => setMaxP(Math.max(Number(e.target.value), minP))}
                  onPointerUp={() =>
                    update((p) =>
                      maxP < PRICE_CEIL ? p.set('maxPrice', String(maxP)) : p.delete('maxPrice'),
                    )
                  }
                  className="mt-1 w-full accent-[#008F95]"
                />
              </FilterSection>

              {/* Brand */}
              <FilterSection title="Brand">
                <div className="max-h-40 overflow-y-auto pr-1">
                  {BRANDS.map((b) => (
                    <label
                      key={b}
                      className="flex cursor-pointer items-center gap-2 py-1 text-[14px]"
                    >
                      <input
                        type="checkbox"
                        checked={activeBrand === b}
                        onChange={() => toggle('brand', b)}
                      />
                      {b}
                    </label>
                  ))}
                </div>
              </FilterSection>

              {activeCount > 0 && (
                <button
                  onClick={() => {
                    setMinP(0);
                    setMaxP(PRICE_CEIL);
                    setParams(
                      activeSort === 'featured' ? {} : {sort: activeSort},
                      {preventScrollReset: true},
                    );
                  }}
                  className="mt-2 text-[13px] font-bold uppercase tracking-[0.12em] text-[#008F95] hover:opacity-70"
                >
                  Azzera filtri
                </button>
              )}
            </div>
          )}
        </div>

        {/* ORDINARE */}
        <div className="relative">
          <button
            onClick={() => setOpen(open === 'sort' ? null : 'sort')}
            className="flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.12em]"
          >
            Ordinare
            <ChevronDown
              className={`size-4 transition-transform ${open === 'sort' ? 'rotate-180' : ''}`}
            />
          </button>
          {open === 'sort' && (
            <div className="absolute right-0 top-full z-40 mt-3 w-64 border border-[#171717]/15 bg-white shadow-[0_16px_32px_-16px_rgba(23,23,23,0.35)]">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    update((p) =>
                      o.value === 'featured' ? p.delete('sort') : p.set('sort', o.value),
                    );
                    setOpen(null);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-[#FFE1BA]/40 ${
                    activeSort === o.value ? 'font-bold text-[#008F95]' : 'text-[#171717]/80'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-[#008F95]">
        {String(count).padStart(2, '0')} prodotti
      </p>
    </div>
  );
}

function FilterSection({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div className="mb-5 border-b border-[#171717]/10 pb-5 last:border-b-0">
      <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em]">{title}</p>
      {children}
    </div>
  );
}
