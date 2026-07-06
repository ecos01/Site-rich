import {useEffect, useState} from 'react';
import {SHOE_SIZE_CHART} from '@/lib/sizeChart';

export function SizeChartModal({
  open,
  onClose,
  vendor,
}: {
  open: boolean;
  onClose: () => void;
  vendor?: string | null;
}) {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  useEffect(() => {
    if (!open) return;
    const abortController = new AbortController();
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') onClose();
      },
      {signal: abortController.signal},
    );
    return () => abortController.abort();
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-modal
      role="dialog"
      aria-label="Guida alle taglie"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#171717]/40 p-4"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-8">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl leading-none text-[#171717]/60 transition-colors hover:text-[#171717]"
        >
          &times;
        </button>

        <h2 className="text-center text-[15px] font-bold uppercase tracking-[0.1em]">
          {vendor ? `${vendor} - Scala Taglie Unisex` : 'Scala Taglie Unisex'}
        </h2>

        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-full border border-[#171717]/15 p-0.5 text-[12px] font-medium">
            {(['cm', 'in'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`rounded-full px-4 py-1.5 uppercase transition-colors ${
                  unit === u ? 'bg-[#171717] text-white' : 'text-[#171717]/60'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <table className="mt-6 w-full border-collapse text-center text-[13px]">
          <thead>
            <tr className="border-b border-[#171717]/10 bg-[#fafafa]">
              <th className="py-2.5 font-bold uppercase tracking-[0.1em]">US</th>
              <th className="py-2.5 font-bold uppercase tracking-[0.1em]">EU</th>
              <th className="py-2.5 font-bold uppercase tracking-[0.1em]">UK</th>
              <th className="py-2.5 font-bold uppercase tracking-[0.1em] text-[#171717]/60">
                ({unit})
              </th>
            </tr>
          </thead>
          <tbody>
            {SHOE_SIZE_CHART.map((row) => (
              <tr key={row.us} className="border-b border-[#171717]/5">
                <td className="py-2">{row.us}</td>
                <td className="py-2">{row.eu}</td>
                <td className="py-2">{row.uk}</td>
                <td className="py-2">
                  {unit === 'cm' ? `${row.cm}cm` : `${(row.cm / 2.54).toFixed(1)}in`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 border-t border-[#171717]/10 pt-6 text-[13px] leading-relaxed text-[#171717]/75">
          <p className="font-bold uppercase tracking-[0.1em] text-[#171717]">
            Come misurare:
          </p>
          <p className="mt-2">
            Per misurare la lunghezza del piede, appoggia il piede nudo su un foglio di
            carta e traccia il profilo. Poi misura la lunghezza dalla punta del piede più
            lungo al tallone. Usa la misura per trovare la taglia corrispondente nella
            tabella.
          </p>
        </div>
      </div>
    </div>
  );
}
