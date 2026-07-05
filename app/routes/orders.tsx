import Link from 'next/link';
import {Reveal} from '@/components/reveal';

export const meta = () => [{title: 'Ordini — RICK'}];

// ponytail: empty state only — real orders come from the Shopify Customer Account
// API once accounts are wired.
export default function OrdersPage() {
  return (
    <section className="mx-auto w-full max-w-[720px] px-6 py-16 md:px-8">
      <Reveal>
        <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#008F95]">
          Account
        </span>
        <h1 className="font-display mt-2 uppercase text-[clamp(2rem,5vw,3.5rem)]">
          Ordini
        </h1>
      </Reveal>
      <Reveal className="mt-10">
        <p className="text-[15px] text-[#171717]/60">
          Nessun ordine ancora. Quando acquisti, i tuoi ordini appaiono qui.
        </p>
        <Link href="/shop" className="btn-brutal mt-8 inline-flex">
          <span>Vai allo shop</span>
        </Link>
      </Reveal>
    </section>
  );
}
