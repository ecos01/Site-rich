import {useState} from 'react';
import {MapPin, Mail, ChevronRight} from 'lucide-react';
import {Reveal} from '@/components/reveal';

export const meta = () => [{title: 'Profilo — RICK'}];

// Placeholder account UI — real data comes from the Shopify Customer Account API
// once accounts are wired.
const ADDRESSES = [
  {name: 'Nome Cognome', line: 'Via Esempio 1, 00100 Città, Italia', primary: true},
  {name: 'Nome Cognome', line: 'Via Esempio 2, 20100 Milano, Italia', primary: false},
];

const INITIAL = {
  name: 'Nome Cognome',
  email: 'nome@email.com',
  phone: '+39 000 000 0000',
};

export default function ProfilePage() {
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [draft, setDraft] = useState(INITIAL);

  const startEdit = () => {
    setDraft(form);
    setEditing(true);
  };
  const save = () => {
    setForm(draft);
    setEditing(false);
  };
  const field = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft((d) => ({...d, [k]: e.target.value}));

  return (
    <section className="mx-auto w-full max-w-[720px] px-6 py-16 md:px-8">
      <Reveal>
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#008F95]">
              Account
            </span>
            {editing ? (
              <input
                value={draft.name}
                onChange={field('name')}
                aria-label="Nome"
                className="font-display mt-2 w-full border-b border-[#171717]/30 bg-transparent uppercase text-[clamp(2rem,5vw,3.5rem)] leading-none outline-none focus:border-[#008F95]"
              />
            ) : (
              <h1 className="font-display mt-2 uppercase text-[clamp(2rem,5vw,3.5rem)]">
                {form.name}
              </h1>
            )}
          </div>
          {editing ? (
            <div className="flex shrink-0 items-center gap-3">
              <button onClick={save} className="btn-brutal !px-6 !py-3">
                <span>Salva</span>
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-[13px] uppercase tracking-[0.12em] text-[#171717]/60 hover:text-[#008F95]"
              >
                Annulla
              </button>
            </div>
          ) : (
            <button onClick={startEdit} className="btn-brutal shrink-0 !px-6 !py-3">
              <span>Modifica</span>
            </button>
          )}
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <div className="border border-[#171717]/15 bg-white">
          <div className="flex items-baseline justify-between gap-4 border-b border-[#171717]/10 px-5 py-4">
            <span className="text-[13px] uppercase tracking-[0.12em] text-[#171717]/50">
              Email
            </span>
            {editing ? (
              <input
                type="email"
                value={draft.email}
                onChange={field('email')}
                aria-label="Email"
                className="w-1/2 border-b border-[#171717]/30 bg-transparent text-right text-[14px] outline-none focus:border-[#008F95]"
              />
            ) : (
              <span className="text-[14px]">{form.email}</span>
            )}
          </div>
          <div className="flex items-baseline justify-between gap-4 px-5 py-4">
            <span className="text-[13px] uppercase tracking-[0.12em] text-[#171717]/50">
              Telefono
            </span>
            {editing ? (
              <input
                type="tel"
                value={draft.phone}
                onChange={field('phone')}
                aria-label="Telefono"
                className="w-1/2 border-b border-[#171717]/30 bg-transparent text-right text-[14px] outline-none focus:border-[#008F95]"
              />
            ) : (
              <span className="text-[14px]">{form.phone}</span>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display uppercase text-[clamp(1.5rem,3vw,2rem)]">
            Indirizzi
          </h2>
          <button className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#008F95] transition-opacity hover:opacity-70">
            Aggiungi
          </button>
        </div>
        <ul className="divide-y divide-[#171717]/10 border border-[#171717]/15 bg-white">
          {ADDRESSES.map((a, i) => (
            <li key={i}>
              <button className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#FFE1BA]/30">
                <span className="flex size-10 shrink-0 items-center justify-center border border-[#171717]/20">
                  <MapPin className="size-4" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-[14px] font-bold">
                    {a.name}
                    {a.primary && (
                      <span className="bg-[#008F95] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                        Predefinito
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-[#171717]/60">
                    {a.line}
                  </span>
                </span>
                <ChevronRight className="size-4 text-[#171717]/40 transition-transform group-hover:translate-x-1" />
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="font-display mb-5 uppercase text-[clamp(1.5rem,3vw,2rem)]">
          Preferenze di marketing
        </h2>
        <div className="flex items-center justify-between border border-[#171717]/15 bg-white px-5 py-4">
          <span className="flex items-center gap-3 text-[14px]">
            <Mail className="size-4 text-[#171717]/60" />
            Email
          </span>
          <button
            role="switch"
            aria-checked={emailOptIn}
            onClick={() => setEmailOptIn((v) => !v)}
            className={`relative h-6 w-11 cursor-pointer transition-colors ${
              emailOptIn ? 'bg-[#008F95]' : 'bg-[#171717]/25'
            }`}
          >
            <span
              className={`absolute top-0.5 size-5 bg-white transition-transform ${
                emailOptIn ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </Reveal>

      <Reveal className="mt-14 flex items-center gap-6">
        <button className="btn-brutal !px-6 !py-3">
          <span>Esci</span>
        </button>
        <button className="text-[13px] uppercase tracking-[0.12em] text-[#171717]/60 transition-colors hover:text-[#008F95]">
          Esci da tutti i dispositivi
        </button>
      </Reveal>
    </section>
  );
}
