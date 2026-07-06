import {useLocalProfile} from '@/lib/useLocalProfile';
import {
  EARN_RULES,
  REDEEM_TIERS,
  VIP_TIERS,
  currentVipTier,
  expiryDate,
  formatDate,
  nextVipTier,
} from '@/lib/loyalty';

export const meta = () => [{title: 'Programma Loyalty — LAB19'}];

export default function LoyaltyPage() {
  const {profile, ready} = useLocalProfile();
  const {loyalty} = profile;

  if (!ready) return null;

  const vip = currentVipTier(loyalty.yearPoints);
  const next = nextVipTier(loyalty.yearPoints);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-10 md:px-8">
      <h1 className="text-center text-[16px] font-bold uppercase tracking-[0.1em]">
        Informazioni sul Programma Loyalty
      </h1>
      <div className="mx-auto mt-6 max-w-[780px] space-y-3 text-center text-[14px] leading-relaxed text-[#171717]/80">
        <p>
          <b>Scadenza punti:</b> i punti scadono dopo 180 giorni (6 mesi) dall'ultima
          attività (guadagno o utilizzo).
        </p>
        <p>
          <b>Rinnovo scadenza:</b> ogni volta che usi o accumuli punti, la scadenza si
          aggiorna di 6 mesi.
        </p>
        <p>
          <b>Accredito punti:</b> i punti guadagnati verranno aggiunti al saldo entro 24
          ore dopo il completamento di un'azione.
        </p>
        <p>
          <b>Riscatto premi:</b> una volta accumulati abbastanza punti, puoi sbloccare un
          premio nella sezione "Come spendere punti" del tuo profilo. Il premio apparirà
          in "Premi disponibili" e verrà applicato automaticamente al checkout.
        </p>
        <p>
          <b>Data di scadenza:</b> puoi consultare la data aggiornata dei tuoi punti
          all'interno del tuo profilo.
        </p>
        <p>
          <b>Validità livelli VIP:</b> i livelli VIP raggiunti restano validi per 1 anno
          solare.
        </p>
        <p className="text-[12px] text-[#171717]/50">
          NB: i livelli VIP, avendo una validità basata sull'anno solare, includono i
          punti accumulati dal 7 febbraio, data di avvio del nostro servizio.
        </p>
      </div>

      {/* Earn points */}
      <div className="mt-14">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[18px] font-bold">Modi per guadagnare punti</h2>
          <p className="text-[13px] text-[#171717]/60">
            Scadenza: {formatDate(expiryDate(loyalty.lastActivityAt))}
          </p>
        </div>
        <p className="mt-1 text-[13px] text-[#171717]/60">Saldo: {loyalty.points} points</p>

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {EARN_RULES.map((rule) => {
            const completed =
              rule.key === 'account' ||
              (rule.key === 'newsletter' && loyalty.newsletterGranted);
            return (
              <div
                key={rule.key}
                className="flex flex-col items-center gap-2 rounded-2xl border border-[#171717]/10 p-5 text-center"
              >
                <p className="text-[14px] font-bold">{rule.label}</p>
                {completed ? (
                  <span className="text-[13px] text-[#171717]/50">✓ Completato</span>
                ) : rule.note ? (
                  <span className="text-[13px] text-[#171717]/60">{rule.note}</span>
                ) : (
                  <span className="text-[13px] text-[#171717]/60">{rule.points} points</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available rewards */}
      <div className="mt-14">
        <h2 className="text-[18px] font-bold">Premi disponibili</h2>
        {(() => {
          const unlocked = REDEEM_TIERS.filter((t) => loyalty.points >= t.points);
          if (!unlocked.length) {
            return (
              <p className="mt-4 text-[14px] text-[#171717]/60">
                Nessun premio ancora disponibile: torna presto o partecipa alle attività
                di guadagno per sbloccare offerte entusiasmanti!
              </p>
            );
          }
          return (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {unlocked.map((t) => (
                <div
                  key={t.reward}
                  className="rounded-2xl border border-[#171717]/10 p-5 text-center"
                >
                  <p className="text-[16px] font-bold">Ricevi {t.reward}</p>
                  <p className="mt-1 text-[12px] text-[#171717]/60">{t.points} points</p>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Redeem tiers */}
      <div className="mt-14">
        <h2 className="text-[18px] font-bold">Modalità di utilizzo dei punti</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
          {REDEEM_TIERS.map((t) => {
            const remaining = Math.max(0, t.points - loyalty.points);
            return (
              <div
                key={t.reward}
                className="rounded-2xl border border-[#171717]/10 p-5 text-center"
              >
                <p className="text-[16px] font-bold">Ricevi {t.reward}</p>
                <p className="mt-1 text-[12px] text-[#171717]/60">
                  {remaining > 0
                    ? `Guadagna ${remaining} points da sbloccare`
                    : 'Sbloccato'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIP tiers */}
      <div className="mt-14">
        <h2 className="text-[18px] font-bold">Livelli VIP</h2>
        <div className="mt-5 grid grid-cols-[auto_repeat(3,1fr)] gap-px overflow-hidden rounded-2xl border border-[#171717]/10 bg-[#171717]/10 text-[13px]">
          <div className="bg-white p-4" />
          {VIP_TIERS.map((t) => (
            <div
              key={t.key}
              className={`p-4 text-center font-bold ${
                t.key === vip.key ? 'bg-[#171717] text-white' : 'bg-white'
              }`}
            >
              {t.name}
            </div>
          ))}

          <div className="bg-white p-4 font-bold">Obiettivo</div>
          {VIP_TIERS.map((t) => (
            <div key={t.key} className="bg-white p-4 text-center">
              {loyalty.yearPoints >= t.threshold
                ? 'Raggiunto'
                : `Hai ottenuto ${loyalty.yearPoints} su ${t.threshold} points`}
            </div>
          ))}

          <div className="bg-white p-4 font-bold">Moltiplicatore di punti</div>
          {VIP_TIERS.map((t) => (
            <div key={t.key} className="bg-white p-4 text-center">
              {t.multiplier ? `${t.multiplier} x` : '—'}
            </div>
          ))}

          <div className="bg-white p-4 font-bold">Ricompensa</div>
          {VIP_TIERS.map((t) => (
            <div key={t.key} className="bg-white p-4 text-center">
              {t.tierBonus} points
            </div>
          ))}

          <div className="bg-white p-4 font-bold">Vantaggi</div>
          {VIP_TIERS.map((t) => (
            <div key={t.key} className="bg-white p-4 text-left text-[12px]">
              <ul className="space-y-1">
                {t.perks.map((perk) => (
                  <li key={perk}>• {perk}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {next && (
          <p className="mt-3 text-center text-[13px] text-[#171717]/60">
            {loyalty.yearPoints}/{next.threshold} points a {next.name}
          </p>
        )}
      </div>

      {/* History */}
      <div className="mt-14 mb-10">
        <h2 className="text-[18px] font-bold">Storia</h2>
        {loyalty.history.length ? (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-[#171717]/10">
            <table className="w-full min-w-[500px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#171717]/10 text-[#171717]/50">
                  <th className="p-4 font-medium">Azione</th>
                  <th className="p-4 font-medium">Ricompensa</th>
                  <th className="p-4 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {loyalty.history.map((h, i) => (
                  <tr key={i} className="border-b border-[#171717]/5 last:border-b-0">
                    <td className="p-4">{h.action}</td>
                    <td className="p-4">
                      {h.points > 0 ? `+${h.points} points` : '—'}
                    </td>
                    <td className="p-4">{formatDate(h.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-[14px] text-[#171717]/50">Nessuna attività ancora.</p>
        )}
      </div>
    </div>
  );
}
