import {useEffect} from 'react';

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
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
      aria-label={title}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#171717]/40 p-4"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div className="relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white p-7 shadow-[0_24px_60px_-20px_rgba(23,23,23,0.4)]">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-bold">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-[#171717]/50 transition-colors hover:text-[#171717]"
          >
            &times;
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
