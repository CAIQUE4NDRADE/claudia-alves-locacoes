"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listVestidos, listReservas } from "@/lib/api";
import type { Produto, Reserva } from "@/lib/supabase";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatarData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

const STATUS_LABEL: Record<Reserva["status"], string> = {
  solicitada: "Solicitada",
  confirmada: "Confirmada",
  retirada: "Retirada",
  devolvida: "Devolvida",
  cancelada: "Cancelada",
};

export default function DashboardPage() {
  const [vestidos, setVestidos] = useState<Produto[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listVestidos(), listReservas()])
      .then(([v, r]) => {
        setVestidos(v);
        setReservas(r);
      })
      .catch((e) => setErro(e.message ?? "Erro ao carregar dados"))
      .finally(() => setCarregando(false));
  }, []);

  const pendentes = reservas.filter((r) => r.status === "solicitada");
  const confirmadas = reservas.filter((r) => ["confirmada", "retirada"].includes(r.status));
  const faturamentoConfirmado = confirmadas.reduce((acc, r) => acc + Number(r.valor_locacao), 0);
  const maisAlugados = vestidos.filter((v) => v.mais_alugado).slice(0, 5);
  const vestidoNome = (id: string) => vestidos.find((v) => v.id === id)?.nome ?? "Vestido removido";

  if (carregando) return <p className="text-sm text-muted">Carregando dashboard…</p>;
  if (erro) {
    return (
      <div className="rounded-xl2 border border-bordo/30 bg-bordo/5 p-5 text-sm text-bordo">
        Não consegui carregar os dados do Supabase ({erro}). Confira se as
        tabelas foram criadas (<code>supabase/schema.sql</code>) e se as
        variáveis de ambiente estão corretas.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["Vestidos no acervo", vestidos.length],
          ["Reservas pendentes", pendentes.length],
          ["Reservas confirmadas", confirmadas.length],
          ["Faturamento confirmado", formatarPreco(faturamentoConfirmado)],
        ].map(([label, valor], i) => (
          <div key={i} className="rounded-xl2 border border-border/70 bg-background p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-1 font-display text-xl font-semibold text-foreground">{valor}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Reservas pendentes de confirmação
          </h2>
          <Link href="/admin/reservas" className="text-sm font-medium text-gold hover:underline">
            Ver todas →
          </Link>
        </div>
        {pendentes.length === 0 ? (
          <p className="rounded-xl2 border border-border/70 bg-background p-5 text-sm text-muted">
            Nenhuma reserva pendente no momento.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl2 border border-border/70 bg-background">
            {pendentes.slice(0, 6).map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-4 py-3 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{vestidoNome(r.produto_id)}</p>
                  <p className="text-xs text-muted">
                    Evento {formatarData(r.data_evento)} · Retirada {formatarData(r.data_retirada)}
                  </p>
                </div>
                <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-dark">
                  {STATUS_LABEL[r.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Vestidos mais alugados</h2>
        {maisAlugados.length === 0 ? (
          <p className="rounded-xl2 border border-border/70 bg-background p-5 text-sm text-muted">
            Marque vestidos como "mais alugado" na tela de Vestidos para aparecerem aqui.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {maisAlugados.map((v) => (
              <div key={v.id} className="rounded-xl2 border border-border/70 bg-background p-4">
                <p className="text-sm font-medium text-foreground">{v.nome}</p>
                <p className="text-xs text-muted">{v.codigo} · {v.cores.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
