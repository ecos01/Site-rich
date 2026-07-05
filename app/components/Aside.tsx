import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useId} from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'quickshop' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * Slide-in side drawer (right) with overlay — brutalist theme, Tailwind styled.
 * Same API as before: <Aside type="cart" heading="CART">…</Aside> + useAside().
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();

  useEffect(() => {
    const abortController = new AbortController();
    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') close();
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      role="dialog"
      aria-labelledby={id}
      className={`fixed inset-0 z-[70] transition-opacity duration-300 ${
        expanded ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* click-outside backdrop */}
      <button
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-[#171717]/40"
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-[min(92vw,420px)] flex-col bg-[#fafafa] shadow-[0_0_60px_-15px_rgba(23,23,23,0.5)] transition-transform duration-400 ease-out ${
          expanded ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between bg-[#171717] px-5 py-4 text-white">
          <h3
            id={id}
            className="text-[13px] font-bold uppercase tracking-[0.2em]"
          >
            {heading}
          </h3>
          <button
            onClick={close}
            aria-label="Close"
            className="text-2xl leading-none transition-colors hover:text-[#FFE1BA]"
          >
            &times;
          </button>
        </header>
        <main className="flex-1 overflow-y-auto px-5 py-6">{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
