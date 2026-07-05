import Link from 'next/link';
import {Reveal} from '@/components/reveal';
import {CategoryDivider} from '@/components/site';

export const meta = () => [{title: 'About — RICK'}];

export default function AboutPage() {
  return (
    <>
      <div>
        <CategoryDivider title="About" align="left" />
      </div>
      <section className="mx-auto w-full max-w-[948px] px-6 pb-16 md:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <h2 className="font-display uppercase text-[clamp(1.75rem,3vw,2.75rem)] leading-[0.9]">
                A fashion house built like a print shop.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 max-w-[560px] space-y-6 text-lg leading-relaxed text-foreground/80">
                <p>
                  RICK started as a poster studio. The clothes came later — when
                  we realised the best place to hang a headline is a person, not
                  a wall.
                </p>
                <p>
                  Every piece is drafted on paper first: heavy type, tight
                  kerning, warm ink. Then it is cut, printed and stitched in
                  small runs between Basel and Milano.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <Reveal delay={0.2}>
              <dl className="space-y-6">
                {[
                  ['Founded', '2019, Basel'],
                  ['Runs', 'Small batches, numbered'],
                  ['Materials', 'Deadstock cotton, water-based ink'],
                  ['Stockists', '12 stores, 6 countries'],
                ].map(([k, v]) => (
                  <div key={k} className="border-t border-[#171717]/20 pt-4">
                    <dt className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#008F95]">
                      {k}
                    </dt>
                    <dd className="mt-1 text-[15px]">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.3} className="mt-12">
              <Link href="/shop" className="btn-brutal">
                <span>Shop the drop</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
