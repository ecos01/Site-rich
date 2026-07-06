import {useState} from 'react';
import {Link} from 'react-router';
import {useLocalProfile} from '@/lib/useLocalProfile';
import {currentVipTier, expiryDate, formatDate, nextVipTier} from '@/lib/loyalty';
import {ITALIAN_PROVINCES} from '@/lib/italianProvinces';
import {Modal} from '@/components/Modal';
import trophyIcon from '@/assets/trophy-icon.svg';

export const meta = () => [{title: 'Profilo — LAB19'}];

const inputClass =
  'w-full rounded-xl border border-[#171717]/20 px-3.5 py-2.5 text-[14px] placeholder:text-[#171717]/40 focus:outline-none focus:border-[#171717]';

export default function ProfiloPage() {
  const {profile, ready, update, toggleNewsletter, addAddress, removeAddress} =
    useLocalProfile();
  const [editingProfile, setEditingProfile] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);

  const {loyalty} = profile;
  const vip = currentVipTier(loyalty.yearPoints);
  const next = nextVipTier(loyalty.yearPoints);
  const progressPct = next
    ? Math.min(100, (loyalty.yearPoints / next.threshold) * 100)
    : 100;
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  if (!ready) return null;

  return (
    <div className="space-y-10">
      {/* Loyalty summary */}
      <div>
        <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-[#171717]/60">
          Informazioni sulla Loyalty
        </h2>
        <div className="rounded-2xl border border-[#171717]/10 p-6">
          <p className="text-[13px] text-[#171717]/60">I tuoi points</p>
          <p className="mt-1 text-[26px] font-bold">{loyalty.points}</p>
          {loyalty.lastActivityAt && (
            <p className="mt-1 text-[12px] text-[#c17a3a]">
              Data di scadenza: {formatDate(expiryDate(loyalty.lastActivityAt))}
            </p>
          )}

          <p className="mt-6 text-[13px] font-bold">La tua ricompensa</p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#FFE1BA] px-3 py-1 text-[12px] font-medium text-[#171717]">
            {next
              ? `Guadagna ${next.threshold - loyalty.yearPoints} points in più`
              : 'Livello massimo raggiunto'}
          </span>
          <p className="mt-1 text-[12px] text-[#171717]/50">Per riscattare un premio</p>

          <p className="mt-6 text-[13px] font-bold">Livelli VIP</p>
          <p className="mt-1 flex items-center gap-1.5 text-[15px] font-bold">
            <img src={trophyIcon} alt="" className="size-4" /> {vip.name}
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[#171717]/10">
            <div
              className="h-full rounded-full bg-[#171717]"
              style={{width: `${progressPct}%`}}
            />
          </div>
          {next && (
            <p className="mt-1 text-right text-[12px] text-[#171717]/60">
              Guadagna {next.threshold - loyalty.yearPoints} points per raggiungere il
              livello successivo <b>{next.name}</b>
            </p>
          )}

          <Link
            to="/user/loyalty"
            className="mt-6 inline-block rounded-xl bg-[#171717] px-6 py-3 text-[13px] font-bold uppercase tracking-[0.08em] text-white"
          >
            Visualizza i premi
          </Link>
        </div>
      </div>

      {/* Personal info */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold">{fullName || 'Il tuo profilo'}</h2>
          <button
            type="button"
            onClick={() => setEditingProfile(true)}
            className="rounded-full border border-[#171717]/20 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-[#171717] hover:text-white"
          >
            Modifica
          </button>
        </div>

        <div className="mt-4 divide-y divide-[#171717]/10 rounded-2xl border border-[#171717]/10">
          <Row label="Email" value={profile.email || '—'} />
          <Row label="Numero di telefono" value={profile.phone || '—'} />
        </div>
      </div>

      <EditProfileModal
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        profile={profile}
        onSave={(patch) => {
          update(patch);
          setEditingProfile(false);
        }}
      />

      {/* Addresses */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold">Indirizzi</h2>
          <button
            type="button"
            onClick={() => setAddingAddress(true)}
            className="rounded-full border border-[#171717]/20 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-[#171717] hover:text-white"
          >
            Aggiungi
          </button>
        </div>

        {profile.addresses.length ? (
          <ul className="mt-4 divide-y divide-[#171717]/10 rounded-2xl border border-[#171717]/10">
            {profile.addresses.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-[14px] font-medium">
                    {a.firstName} {a.lastName}
                    {a.isDefault && (
                      <span className="ml-2 rounded-full bg-[#171717]/10 px-2 py-0.5 text-[11px] font-bold uppercase">
                        Predefinito
                      </span>
                    )}
                  </p>
                  <p className="text-[13px] text-[#171717]/60">
                    {a.address1}
                    {a.address2 ? `, ${a.address2}` : ''}, {a.zip} {a.city} {a.province},{' '}
                    {a.country}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAddress(a.id)}
                  aria-label="Rimuovi indirizzo"
                  className="text-[12px] font-bold uppercase text-[#171717]/40 hover:text-[#171717]"
                >
                  Rimuovi
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[14px] text-[#171717]/50">Nessun indirizzo salvato.</p>
        )}
      </div>

      <AddressModal
        open={addingAddress}
        onClose={() => setAddingAddress(false)}
        onSave={(addr) => {
          addAddress(addr);
          setAddingAddress(false);
        }}
      />

      {/* Marketing preferences */}
      <div>
        <h2 className="text-[17px] font-bold">Preferenze di marketing</h2>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#171717]/10 p-4">
          <span className="text-[14px]">Email</span>
          <button
            type="button"
            role="switch"
            aria-checked={profile.marketingEmail}
            onClick={() => toggleNewsletter(!profile.marketingEmail)}
            className={`h-6 w-11 shrink-0 rounded-full transition-colors ${
              profile.marketingEmail ? 'bg-[#171717]' : 'bg-[#171717]/20'
            }`}
          >
            <span
              className={`block size-5 rounded-full bg-white transition-transform ${
                profile.marketingEmail ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center justify-between p-4 text-[14px]">
      <span className="text-[#171717]/50">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function EditProfileModal({
  open,
  onClose,
  profile,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  profile: {firstName: string; lastName: string; email: string; phone: string};
  onSave: (patch: {firstName: string; lastName: string; email: string}) => void;
}) {
  const [emailError, setEmailError] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title="Modifica profilo">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const email = String(f.get('email') || '').trim();
          if (!email) {
            setEmailError(true);
            return;
          }
          onSave({
            firstName: String(f.get('firstName') || ''),
            lastName: String(f.get('lastName') || ''),
            email,
          });
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            defaultValue={profile.firstName}
            placeholder="Nome"
            className={inputClass}
          />
          <input
            name="lastName"
            defaultValue={profile.lastName}
            placeholder="Cognome"
            className={inputClass}
          />
        </div>

        <div>
          <input
            name="email"
            type="email"
            defaultValue={profile.email}
            placeholder="Email"
            onChange={() => setEmailError(false)}
            className={`${inputClass} ${emailError ? 'border-red-500' : ''}`}
          />
          {emailError && (
            <p className="mt-1.5 text-[13px] text-red-600">
              Il campo Email non può essere vuoto
            </p>
          )}
          <p className="mt-1.5 text-[12px] text-[#171717]/50">
            Questo indirizzo email viene utilizzato per l'accesso e gli aggiornamenti
            degli ordini.
          </p>
        </div>

        <div>
          <input
            disabled
            value={profile.phone || '+39'}
            placeholder="Numero di telefono"
            className={`${inputClass} cursor-not-allowed bg-[#171717]/5 text-[#171717]/40`}
          />
          <p className="mt-1.5 text-[12px] text-[#171717]/50">
            Impossibile modificare il numero di telefono.
          </p>
        </div>

        <div className="flex items-center justify-end gap-5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-[14px] font-medium text-[#171717]/60 hover:text-[#171717]"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#171717] px-6 py-2.5 text-[14px] font-bold text-white"
          >
            Salva
          </button>
        </div>
      </form>
    </Modal>
  );
}

function AddressModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (addr: {
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
  }) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Aggiungi indirizzo">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          onSave({
            country: 'Italia',
            firstName: String(f.get('firstName') || ''),
            lastName: String(f.get('lastName') || ''),
            company: String(f.get('company') || '') || undefined,
            address1: String(f.get('address1') || ''),
            address2: String(f.get('address2') || '') || undefined,
            zip: String(f.get('zip') || ''),
            city: String(f.get('city') || ''),
            province: String(f.get('province') || ITALIAN_PROVINCES[0]),
            phone: String(f.get('phone') || '') || undefined,
            isDefault: f.get('isDefault') === 'on',
          });
        }}
        className="space-y-3"
      >
        <label className="block">
          <span className="mb-1 block text-[12px] text-[#171717]/60">
            Paese/area geografica
          </span>
          <select disabled defaultValue="Italia" className={`${inputClass} bg-white`}>
            <option>Italia</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <input name="firstName" placeholder="Nome" required className={inputClass} />
          <input name="lastName" placeholder="Cognome" className={inputClass} />
        </div>

        <input name="company" placeholder="Azienda" className={inputClass} />

        <input
          name="address1"
          placeholder="Indirizzo e numero civico"
          required
          className={inputClass}
        />

        <input
          name="address2"
          placeholder="Appartamento, scala, ecc. (opzionale)"
          className={inputClass}
        />

        <div className="grid grid-cols-3 gap-3">
          <input name="zip" placeholder="CAP" required className={inputClass} />
          <input name="city" placeholder="Comune" required className={inputClass} />
          <label className="block">
            <span className="mb-1 block text-[12px] text-[#171717]/60">Provincia</span>
            <select name="province" defaultValue={ITALIAN_PROVINCES[0]} className={`${inputClass} bg-white`}>
              {ITALIAN_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-[12px] text-[#171717]/60">Telefono</span>
          <div className="flex items-center gap-2 rounded-xl border border-[#171717]/20 px-3.5 py-2.5">
            <span className="text-[14px] text-[#171717]/60">🇮🇹 +39</span>
            <input
              name="phone"
              type="tel"
              className="w-full text-[14px] focus:outline-none"
            />
          </div>
        </label>

        <label className="flex items-center gap-2 pt-1 text-[14px]">
          <input name="isDefault" type="checkbox" className="size-4" />
          Questo è il mio indirizzo predefinito
        </label>

        <div className="flex items-center justify-end gap-5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-[14px] font-medium text-[#171717]/60 hover:text-[#171717]"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#171717] px-6 py-2.5 text-[14px] font-bold text-white"
          >
            Salva
          </button>
        </div>
      </form>
    </Modal>
  );
}
