const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

// Mock de disponibilidade — em produção, isso viria de uma consulta a
// `reservas` (via a função `produto_disponivel` do banco) filtrando pelo
// produto selecionado.
const OCUPADOS = [6, 7, 14, 15, 16];
const OFFSET_PRIMEIRO_DIA = 5; // sábado = agosto/2026 começa numa sexta, ajuste ilustrativo
const DIAS_NO_MES = 31;

export function AvailabilityCalendar({ nomeVestido }: { nomeVestido: string }) {
  const celulas = [
    ...Array.from({ length: OFFSET_PRIMEIRO_DIA }, () => null),
    ...Array.from({ length: DIAS_NO_MES }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-xl2 border border-border/70 bg-background p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between font-display text-sm font-medium text-foreground">
        <span>‹</span>
        <span>Agosto 2026 — {nomeVestido}</span>
        <span>›</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {DIAS_SEMANA.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-muted">
            {d}
          </div>
        ))}
        {celulas.map((dia, i) => {
          if (dia === null) return <div key={i} className="aspect-square opacity-30" />;
          const ocupado = OCUPADOS.includes(dia);
          return (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-lg text-xs font-semibold ${
                ocupado
                  ? "bg-bordo/10 text-bordo line-through"
                  : "bg-[#3E6B4F]/10 text-[#2E4F3B]"
              }`}
            >
              {dia}
            </div>
          );
        })}
      </div>
    </div>
  );
}
