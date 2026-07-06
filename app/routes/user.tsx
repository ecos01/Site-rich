import {Link, Outlet} from 'react-router';
import {UserNav} from '@/components/UserNav';

// /user — local demo account area (no real customer login wired up yet).
// Left-side Profilo/Ordini tabs + content on the right, replacing the old
// header dropdown popup.
export const meta = () => [{title: 'Il tuo account — LAB19'}];

export default function UserLayout() {
  return (
    <section className="mx-auto w-full max-w-[1100px] px-6 py-10 md:px-8">
      <Link to="/" aria-label="LAB19 — home" className="mb-8 inline-block">
        <img src="/logo.png" alt="LAB19" className="h-7 w-auto" />
      </Link>
      <div className="flex flex-col gap-8 md:flex-row">
        <UserNav />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
