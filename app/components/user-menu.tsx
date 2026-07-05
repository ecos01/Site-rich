'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';

// Header account button: click toggles a small dropdown (Ordini / Profilo)
// anchored to the right so it opens toward the left of the icon.
export function UserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-label="Account"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer transition-opacity hover:opacity-60"
      >
        <User className="size-5" />
      </button>

      {open && (
        <>
          {/* click-away backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <nav className="absolute right-0 top-full z-50 mt-3 w-44 border border-[#171717]/15 bg-[#ffffff] shadow-[0_16px_32px_-16px_rgba(23,23,23,0.35)]">
            {[
              { label: 'Ordini', href: '/orders' },
              { label: 'Profilo', href: '/profile' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-[#171717]/10 px-4 py-3 text-[13px] font-bold uppercase tracking-[0.12em] transition-colors last:border-b-0 hover:bg-[#FFE1BA]/40 hover:text-[#008F95]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
