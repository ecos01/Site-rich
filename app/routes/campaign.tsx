import {ArrowUpRight} from 'lucide-react';
import {Reveal} from '@/components/reveal';
import {CategoryDivider} from '@/components/site';

export const meta = () => [{title: 'Campaign — RICK'}];

const STORIES = [
  {
    title: 'The making of Drop 04',
    text: 'Twelve weeks in the print room. Every seam starts as a paste-up: type first, fabric second.',
  },
  {
    title: 'Printed at full volume',
    text: 'Why we set our graphics at poster scale — and what breaks when you shrink them.',
  },
  {
    title: 'Studio visit: Basel',
    text: 'Inside the atelier where the warm palette was mixed, one pigment at a time.',
  },
];

export default function CampaignPage() {
  return (
    <>
      <div>
        <CategoryDivider title="Campaign" align="left" />
      </div>
      <section className="bg-[#FFE1BA] px-6 py-12 md:px-8 md:py-14">
        <div className="mx-auto grid w-full max-w-[948px] grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="font-display uppercase text-[clamp(2rem,4vw,3.75rem)] leading-[0.9] tracking-tight">
                Garments set like headlines, worn like manifestos.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[480px] text-lg leading-relaxed text-foreground/80">
                The season reads like a front page: three stories, one voice, no
                small print. Shot on location between the press hall and the
                street.
              </p>
            </Reveal>
          </div>
          <div className="flex flex-col justify-end md:col-span-4">
            {STORIES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="border-t border-[#171717]/20 py-6 last:border-b">
                  <a href="#" className="group block">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-medium">{s.title}</span>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#171717]/40 transition-colors duration-300 group-hover:border-[#008F95] group-hover:text-[#008F95]">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                    <p className="mt-2 max-w-[90%] text-[14px] text-foreground/60">
                      {s.text}
                    </p>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
