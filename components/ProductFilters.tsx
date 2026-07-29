const SELECT_CLASS =
  "rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-gold focus:outline-none";

export function ProductFilters() {
  return (
    <div className="mb-7 flex flex-wrap gap-2.5">
      <select className={SELECT_CLASS} defaultValue="">
        <option value="">Evento</option>
        <option>Casamento</option>
        <option>Formatura</option>
        <option>Aniversário</option>
      </select>
      <select className={SELECT_CLASS} defaultValue="">
        <option value="">Cor</option>
        <option>Terracota</option>
        <option>Vinho</option>
        <option>Verde Esmeralda</option>
        <option>Azul Royal</option>
      </select>
      <select className={SELECT_CLASS} defaultValue="">
        <option value="">Tamanho</option>
        <option>PP</option>
        <option>P</option>
        <option>M</option>
        <option>G</option>
        <option>GG</option>
      </select>
      <select className={SELECT_CLASS} defaultValue="">
        <option value="">Disponibilidade</option>
        <option>Disponível agora</option>
      </select>
    </div>
  );
}
