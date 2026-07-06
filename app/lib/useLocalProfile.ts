import {useCallback, useEffect, useState} from 'react';
import {EMPTY_LOYALTY, grantTierBonuses, type LoyaltyState} from '@/lib/loyalty';

// Local, browser-only account profile — no real customer login/DB wired up
// yet (site is in testing), so every new visitor starts at zero and state
// lives in localStorage per browser.

export type Address = {
  id: string;
  country: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  zip: string;
  city: string;
  province: string;
  phone?: string;
  isDefault?: boolean;
};

export type LocalProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string | null; // 'MM-DD'
  marketingEmail: boolean;
  addresses: Address[];
  loyalty: LoyaltyState;
};

// v2: bumped to drop the old key an earlier build wrote non-zero starting
// points/history under, so every browser reloads to a true zero state.
const STORAGE_KEY = 'lab19_profile_v2';

const EMPTY_PROFILE: LocalProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthday: null,
  marketingEmail: false,
  addresses: [],
  loyalty: EMPTY_LOYALTY,
};

function load(): LocalProfile {
  if (typeof window === 'undefined') return EMPTY_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROFILE;
    const parsed = JSON.parse(raw) as Partial<LocalProfile>;
    return {
      ...EMPTY_PROFILE,
      ...parsed,
      loyalty: {...EMPTY_LOYALTY, ...parsed.loyalty},
    };
  } catch {
    return EMPTY_PROFILE;
  }
}

function save(profile: LocalProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function todayMonthDay(): string {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useLocalProfile() {
  const [profile, setProfile] = useState<LocalProfile>(EMPTY_PROFILE);
  const [ready, setReady] = useState(false);

  // First mount: load from localStorage. Merely visiting the page writes
  // nothing — points/history/dates stay untouched (zero) until the visitor
  // takes a real action (newsletter opt-in, birthday match, a purchase).
  useEffect(() => {
    const loaded = load();
    const now = new Date().toISOString();
    let loyalty = loaded.loyalty;

    const thisYear = new Date().getFullYear();
    if (
      loaded.birthday &&
      loaded.birthday === todayMonthDay() &&
      loyalty.birthdayGrantedYear !== thisYear
    ) {
      loyalty = {
        ...loyalty,
        points: loyalty.points + 200,
        yearPoints: loyalty.yearPoints + 200,
        lastActivityAt: now,
        birthdayGrantedYear: thisYear,
        history: [
          {action: 'Buon Compleanno!', points: 200, date: now},
          ...loyalty.history,
        ],
      };
    }

    loyalty = grantTierBonuses(loyalty);

    const next = {...loaded, loyalty};
    save(next);
    setProfile(next);
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<LocalProfile>) => {
    setProfile((prev) => {
      const next = {...prev, ...patch};
      save(next);
      return next;
    });
  }, []);

  const toggleNewsletter = useCallback((on: boolean) => {
    setProfile((prev) => {
      const grantNow = on && !prev.loyalty.newsletterGranted;
      const now = new Date().toISOString();
      let loyalty: LoyaltyState = grantNow
        ? {
            ...prev.loyalty,
            points: prev.loyalty.points + 50,
            yearPoints: prev.loyalty.yearPoints + 50,
            lastActivityAt: now,
            newsletterGranted: true,
            history: [
              {action: 'Iscrizione alla Newsletter', points: 50, date: now},
              ...prev.loyalty.history,
            ],
          }
        : prev.loyalty;
      if (grantNow) loyalty = grantTierBonuses(loyalty);
      const next = {...prev, marketingEmail: on, loyalty};
      save(next);
      return next;
    });
  }, []);

  const addAddress = useCallback((addr: Omit<Address, 'id'>) => {
    setProfile((prev) => {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now());
      const makeDefault = addr.isDefault || prev.addresses.length === 0;
      const addresses = [
        ...prev.addresses.map((a) =>
          makeDefault ? {...a, isDefault: false} : a,
        ),
        {...addr, id, isDefault: makeDefault},
      ];
      const next = {...prev, addresses};
      save(next);
      return next;
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setProfile((prev) => {
      const next = {...prev, addresses: prev.addresses.filter((a) => a.id !== id)};
      save(next);
      return next;
    });
  }, []);

  return {profile, ready, update, toggleNewsletter, addAddress, removeAddress};
}
