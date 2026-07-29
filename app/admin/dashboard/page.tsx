export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="text-sm text-muted">
        Aqui entram o calendário de disponibilidade por vestido, as reservas
        pendentes de confirmação e os vestidos mais alugados — puxando das
        tabelas <code>reservas</code> e <code>produtos</code> do Supabase.
        Ver README para o roteiro de implementação do CRUD de produtos e da
        gestão de status de reservas (solicitada → confirmada → retirada →
        devolvida).
      </p>
    </div>
  );
}
