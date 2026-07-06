export const meta = () => [{title: 'Ordini — LAB19'}];

export default function OrdersPage() {
  return (
    <div>
      <h2 className="text-[17px] font-bold">Ordini</h2>
      <p className="mt-4 text-[14px] text-[#171717]/50">
        Nessun ordine ancora. I tuoi ordini appariranno qui dopo il primo acquisto.
      </p>
    </div>
  );
}
