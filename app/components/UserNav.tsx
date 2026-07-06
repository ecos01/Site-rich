import {NavLink} from 'react-router';

const TABS = [
  {label: 'Profilo', to: '/user', end: true},
  {label: 'Ordini', to: '/user/orders', end: false},
];

export function UserNav() {
  return (
    <nav className="flex shrink-0 flex-row gap-6 border-b border-[#171717]/10 pb-4 md:w-48 md:flex-col md:gap-3 md:border-b-0 md:border-r md:pb-0 md:pr-6">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({isActive}) =>
            `text-[14px] font-medium transition-colors ${
              isActive ? 'font-bold text-[#171717]' : 'text-[#171717]/60 hover:text-[#171717]'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
