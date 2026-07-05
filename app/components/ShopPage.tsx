import {useSearchParams} from 'react-router';
import {CategoryDivider} from '@/components/site';
import {MegaNav} from '@/components/mega-nav';
import {ShopBanner} from '@/components/shop-banner';
import {ShopToolbar} from '@/components/ShopToolbar';
import {StoreCard} from '@/components/StoreCard';
import type {StoreProduct} from '@/components/QuickShop';

const PER_PAGE = 40; // 5 columns × 8 rows

// Full shop UI shared by /shop and /collections/:handle — banner, nav, toolbar,
// a 5-wide grid, and numbered client-side pagination.
export function ShopPage({
  title,
  products,
  sizes,
}: {
  title: string;
  products: StoreProduct[];
  sizes: string[];
}) {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const slice = products.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const goTo = (p: number) => {
    const next = new URLSearchParams(params);
    if (p <= 1) next.delete('page');
    else next.set('page', String(p));
    setParams(next);
    if (typeof window !== 'undefined') window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <>
      {/* Spacer so the fixed nav's dark controls sit over light bg, not the dark
          LAB19 banner (dark-on-dark made them invisible on collection pages). */}
      <div aria-hidden className="h-14 md:h-16" />
      <ShopBanner />
      <MegaNav />
      <CategoryDivider title={title} align="left" />
      <ShopToolbar count={products.length} sizes={sizes} />
      <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-8">
        {slice.length ? (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:grid-cols-5">
              {slice.map((p) => (
                <StoreCard key={p.id} product={p} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pager page={current} totalPages={totalPages} goTo={goTo} />
            )}
          </>
        ) : (
          <p className="py-16 text-center text-[15px] text-[#171717]/60">
            Nessun prodotto trovato per “{title}”. (Su mock.shop i brand reali non
            esistono — con lo store vero questa pagina mostra gli articoli del
            brand.)
          </p>
        )}
      </section>
    </>
  );
}

// Numbered pager: PRECEDENTE · 1 2 3 … N · PROSSIMO
function Pager({
  page,
  totalPages,
  goTo,
}: {
  page: number;
  totalPages: number;
  goTo: (p: number) => void;
}) {
  return (
    <nav className="mt-14 flex items-center justify-between text-[13px] font-medium uppercase tracking-[0.12em]">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
        className="underline-offset-4 hover:underline disabled:opacity-30"
      >
        Precedente
      </button>

      <div className="flex items-center gap-3">
        {pageList(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="text-[#171717]/40">
              …
            </span>
          ) : (
            <button
              type="button"
              key={p}
              onClick={() => goTo(p as number)}
              className={`${
                p === page
                  ? 'font-bold text-[#171717] underline underline-offset-4'
                  : 'text-[#171717]/60 hover:text-[#171717]'
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
        className="underline-offset-4 hover:underline disabled:opacity-30"
      >
        Prossimo
      </button>
    </nav>
  );
}

// e.g. 1 2 3 … 39  — always show first three, the current neighbourhood, and last.
function pageList(current: number, total: number): (number | '…')[] {
  if (total <= 7)
    return Array.from({length: total}, (_, i) => i + 1);
  const set = new Set<number>([1, 2, 3, current - 1, current, current + 1, total]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  let prev = 0;
  for (const n of nums) {
    if (n - prev > 1) out.push('…');
    out.push(n);
    prev = n;
  }
  return out;
}
