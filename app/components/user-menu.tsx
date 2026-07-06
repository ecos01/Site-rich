'use client';

import Link from 'next/link';
import { User } from 'lucide-react';

// Header account button: goes straight to /user (Profilo/Ordini live as
// left-side tabs there) instead of opening a dropdown.
export function UserMenu() {
  return (
    <Link
      href="/user"
      aria-label="Account"
      className="cursor-pointer transition-opacity hover:opacity-60"
    >
      <User className="size-5" />
    </Link>
  );
}
