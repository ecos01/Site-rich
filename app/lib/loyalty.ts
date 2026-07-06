// Loyalty program rules (client-side demo — no backend/DB wired yet, so state
// lives in localStorage per browser and every new visitor starts at zero).

export const POINTS_EXPIRY_DAYS = 180; // 6 months since last earn/redeem

export const EARN_RULES = [
  {key: 'account', label: 'Crea il tuo account', points: 0, note: null},
  {key: 'newsletter', label: 'Iscrizione alla Newsletter', points: 50, note: null},
  {key: 'birthday', label: 'Buon Compleanno!', points: 200, note: null},
  {key: 'purchase', label: 'Fai un acquisto', points: 0, note: '1 point per ogni €1.00'},
] as const;

export const REDEEM_TIERS = [
  {reward: '10€', points: 20},
  {reward: '15€', points: 220},
  {reward: '20€', points: 420},
  {reward: '35€', points: 1320},
  {reward: '50€', points: 1820},
  {reward: '100€', points: 2320},
] as const;

export const VIP_TIERS = [
  {
    key: 'rookie',
    name: 'Rookie',
    threshold: 0,
    multiplier: null as number | null,
    tierBonus: 30,
    perks: ['Accesso anticipato ai Saldi'] as string[],
  },
  {
    key: 'crew',
    name: 'Crew',
    threshold: 600,
    multiplier: 1.5,
    tierBonus: 60,
    perks: ['Accesso anticipato ai Saldi', 'Accesso a Promozioni speciali'],
  },
  {
    key: 'og',
    name: 'OG',
    threshold: 1900,
    multiplier: 2,
    tierBonus: 90,
    perks: [
      'Accesso anticipato ai Saldi',
      'Accesso a Drop Esclusivi',
      'Accesso a Promozioni speciali',
    ],
  },
] as const;

export type LoyaltyHistoryEntry = {
  action: string;
  detail?: string;
  points: number;
  date: string; // ISO
};

export type LoyaltyState = {
  points: number;
  yearPoints: number;
  lastActivityAt: string | null;
  createdAt: string | null;
  history: LoyaltyHistoryEntry[];
  newsletterGranted: boolean;
  birthdayGrantedYear: number | null;
  vipBonusGranted: string[];
};

export const EMPTY_LOYALTY: LoyaltyState = {
  points: 0,
  yearPoints: 0,
  lastActivityAt: null,
  createdAt: null,
  history: [],
  newsletterGranted: false,
  birthdayGrantedYear: null,
  vipBonusGranted: [],
};

// Awards each VIP tier's one-time reward the moment yearPoints first crosses
// its threshold. Rookie's threshold is 0 (everyone "reaches" it immediately),
// so it's excluded — its 30pt figure is shown in the VIP table for reference
// only and is never auto-credited, otherwise every new account would start
// above zero. Safe to call after every point-changing action —
// already-granted tiers are skipped via vipBonusGranted.
export function grantTierBonuses(loyalty: LoyaltyState): LoyaltyState {
  let next = loyalty;
  for (const tier of VIP_TIERS) {
    if (tier.threshold === 0) continue;
    if (next.vipBonusGranted.includes(tier.key)) continue;
    if (next.yearPoints < tier.threshold) continue;
    const now = new Date().toISOString();
    next = {
      ...next,
      points: next.points + tier.tierBonus,
      yearPoints: next.yearPoints + tier.tierBonus,
      lastActivityAt: now,
      vipBonusGranted: [...next.vipBonusGranted, tier.key],
      history: [
        {action: `Livello raggiunto: ${tier.name}`, points: tier.tierBonus, date: now},
        ...next.history,
      ],
    };
  }
  return next;
}

export function expiryDate(lastActivityAt: string | null): Date | null {
  if (!lastActivityAt) return null;
  const d = new Date(lastActivityAt);
  d.setDate(d.getDate() + POINTS_EXPIRY_DAYS);
  return d;
}

export function currentVipTier(yearPoints: number) {
  let tier: (typeof VIP_TIERS)[number] = VIP_TIERS[0];
  for (const t of VIP_TIERS) if (yearPoints >= t.threshold) tier = t;
  return tier;
}

export function nextVipTier(yearPoints: number) {
  return VIP_TIERS.find((t) => t.threshold > yearPoints) ?? null;
}

export function formatDate(d: Date | string | null): string {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
