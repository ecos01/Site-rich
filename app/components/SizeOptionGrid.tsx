import {money} from '@/components/QuickShop';
import {toEuSize} from '@/lib/sizeChart';

type PriceMoney = {amount: string; currencyCode: string};

// Size + price box grid (each size has its own variant price on Shopify, so the
// price shown per box can differ — e.g. clearance sizes).
export function SizeOptionGrid({
  values,
  selected,
  onSelect,
  priceFor,
  euConvert,
  isAvailable,
  showPrice = true,
}: {
  values: string[];
  selected?: string;
  onSelect: (value: string) => void;
  priceFor: (value: string) => PriceMoney | undefined;
  euConvert?: boolean;
  isAvailable?: (value: string) => boolean;
  showPrice?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {values.map((value) => {
        const isSel = selected === value;
        const avail = isAvailable ? isAvailable(value) : true;
        const price = priceFor(value);
        return (
          <button
            key={value}
            type="button"
            disabled={!avail}
            onClick={() => onSelect(value)}
            className={`flex flex-col items-center gap-0.5 rounded-2xl border px-3 py-2.5 text-center transition-colors ${
              isSel ? 'border-2 border-[#171717]' : 'border-[#171717]/20 hover:border-[#171717]/50'
            } ${!avail ? 'cursor-not-allowed opacity-40' : ''}`}
          >
            <span className="text-[14px] font-bold">
              {euConvert ? toEuSize(value) : value}
            </span>
            {showPrice && price && (
              <span className="text-[12px] text-[#171717]/60">{money(price)}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
