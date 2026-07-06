import {useState} from 'react';
import {Modal} from '@/components/Modal';
import {money} from '@/components/QuickShop';

export type ShippingSpeed = 'express' | 'standard';

export const EXPRESS_SURCHARGE = 6.99;

// Cart line attributes recording the shipping choice + the price the user picked,
// so the cart shows exactly what was selected.
// Key holding the chosen unit price (numeric). Cart lines read this to show the
// price the user picked instead of the raw variant price; the leading "_" marks
// it as internal so it's hidden from the visible attribute list.
export const UNIT_PRICE_ATTR = '_prezzoUnitario';

export function shippingAttributes(
  speed: ShippingSpeed,
  basePrice?: {amount: string; currencyCode: string},
) {
  const base = basePrice ? Number(basePrice.amount) : 0;
  const effective = speed === 'express' ? base + EXPRESS_SURCHARGE : base;
  return [
    {
      key: 'Spedizione',
      value:
        speed === 'express'
          ? 'Spedizione in 1-2 giorni lavorativi'
          : 'Spedizione in 5-10 giorni lavorativi',
    },
    {key: UNIT_PRICE_ATTR, value: String(effective)},
  ];
}

export function ShippingModal({
  open,
  onClose,
  onConfirm,
  basePrice,
}: {
  open: boolean;
  onClose: () => void;
  // Fires with the chosen speed; the parent submits the add-to-cart.
  onConfirm: (speed: ShippingSpeed) => void;
  basePrice?: {amount: string; currencyCode: string};
}) {
  const [choice, setChoice] = useState<ShippingSpeed>('standard');
  const base = basePrice ? Number(basePrice.amount) : 0;
  const currencyCode = basePrice?.currencyCode ?? 'EUR';

  return (
    <Modal open={open} onClose={onClose} title="Scegli la spedizione">
      <div className="space-y-3">
        <ShippingOption
          label="Spedizione in 1-2 giorni lavorativi"
          price={money({amount: String(base + EXPRESS_SURCHARGE), currencyCode})}
          checked={choice === 'express'}
          onSelect={() => setChoice('express')}
        />
        <ShippingOption
          label="Spedizione in 5-10 giorni lavorativi"
          price={money({amount: String(base), currencyCode})}
          checked={choice === 'standard'}
          onSelect={() => setChoice('standard')}
        />
      </div>

      <p className="mt-4 text-[12px] text-[#171717]/50">
        Il totale definitivo, comprese le spese di spedizione reali, viene confermato al
        checkout.
      </p>

      <div className="mt-6 flex items-center justify-end gap-5">
        <button
          type="button"
          onClick={onClose}
          className="text-[14px] font-medium text-[#171717]/60 hover:text-[#171717]"
        >
          Annulla
        </button>
        <button
          type="button"
          onClick={() => onConfirm(choice)}
          className="rounded-xl bg-[#171717] px-6 py-2.5 text-[14px] font-bold text-white"
        >
          Conferma
        </button>
      </div>
    </Modal>
  );
}

function ShippingOption({
  label,
  price,
  checked,
  onSelect,
}: {
  label: string;
  price: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors ${
        checked ? 'border-[#171717]' : 'border-[#171717]/20 hover:border-[#171717]/50'
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
            checked ? 'border-[#171717]' : 'border-[#171717]/30'
          }`}
        >
          {checked && <span className="size-2.5 rounded-full bg-[#171717]" />}
        </span>
        <span className="text-[14px]">{label}</span>
      </span>
      <span className="text-[14px] font-bold">{price}</span>
    </button>
  );
}
