"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Produto, Reserva, Cliente } from "@/lib/supabase";
import { listReservas, listClientes, updateStatusVestido } from "@/lib/api";
import { toast } from "sonner";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatarData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

const STATUS_LABEL: Record<Produto["status"], string> = {
  disponivel: "Disponível",
  alugado: "Alugado",
  manutencao: "Manutenção",
  lavanderia: "Lavanderia",
};

const RESERVA_STATUS_LABEL: Record<Reserva["status"], string> = {
  solicitada: "Solicitada",
  confirmada: "Confirmada",
  retirada: "Retirada",
  devolvida: "Devolvida",
  cancelada: "Cancelada",
};

export default function FichaVestidoPage() {
  const params = useParams<{ id: string }>();
  const [vestido, setVestido] = useState<Produto | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  function carregar() {
    setCarregando(true);
    Promise.all([
      supabase.from("produtos").select("*").eq("id", params.id).single(),
      listReservas(),
      listClientes(),
    ])
      .then(([vestidoRes, todasReservas, todosClientes]) => {
        if (vestidoRes.error) {
          toast.error("Não encontrei esse vestido");
        } else {
          setVestido(vestidoRes.data as Produto);
        }
        setReservas(todasReservas.filter((r) => r.produto_id === params.id));
        setClientes(todosClientes);
      })
      .catch((e) => toast.error(e.message ?? "Erro ao carregar ficha"))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, [params.id]);

  const nomeCliente = (id: string) => clientes.find((c) => c.id === id)?.nome ?? "Cliente removida";

  async function liberarVestido() {
    if (!vestido) return;
    if (!confirm(`Marcar "${vestido.nome}" como disponível novamente?`)) return;
    setAtualizando(true);
    try {
      await updateStatusVestido(vestido.id, "disponivel");
      toast.success("Vestido liberado — status atualizado para Disponível");
      carregar();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao liberar vestido");
    } finally {
      setAtualizando(false);
    }
  }

  if (carregando) return <p className="text-sm text-muted">Carregando…</p>;
  if (!vestido) return <p className="text-sm text-muted">Vestido não encontrado.</p>;

  const reservasAtivas = reservas.filter((r) => r.status === "confirmada" || r.status === "retirada");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">{vestido.nome}</h1>
          <p className="text-sm text-muted">
            {vestido.codigo ? `Cód. ${vestido.codigo} · ` : ""}
            <span className="capitalize">{vestido.categoria}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/vestidos/${vestido.id}`}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground/80 hover:border-gold hover:text-gold-dark"
          >
            Editar ficha técnica
          </Link>
          <button
            onClick={liberarVestido}
            disabled={atualizando || vestido.status === "disponivel"}
            className="rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background disabled:opacity-40"
          >
            Liberar vestido
          </button>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-4 rounded-xl2 border border-border/70 bg-background p-4 text-sm">
        <div>
          <span className="text-xs uppercase tracking-wide text-muted">Status atual</span>
          <p className="font-semibold text-foreground">{STATUS_LABEL[vestido.status]}</p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-muted">Preço diária</span>
          <p className="font-semibold text-foreground">{formatarPreco(vestido.preco_diaria)}</p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-muted">Caução</span>
          <p className="font-semibold text-foreground">{formatarPreco(vestido.caucao)}</p>
        </div>
        {vestido.ultima_lavagem && (
          <div>
            <span className="text-xs uppercase tracking-wide text-muted">Última lavagem</span>
            <p className="font-semibold text-foreground">{formatarData(vestido.ultima_lavagem)}</p>
          </div>
        )}
        {vestido.ultimo_ajuste && (
          <div>
            <span className="text-xs uppercase tracking-wide text-muted">Último ajuste</span>
            <p className="font-semibold text-foreground">{formatarData(vestido.ultimo_ajuste)}</p>
          </div>
        )}
      </div>

      {reservasAtivas.length > 0 && (
        <p className="mb-4 rounded-xl2 bg-gold/10 px-4 py-3 text-sm text-gold-dark">
          Esta peça está em locação ativa no momento. Confirme que ela voltou fisicamente e foi
          conferida antes de clicar em "Liberar vestido".
        </p>
      )}

      <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
        Histórico de locações ({reservas.length})
      </h2>

      {reservas.length === 0 ? (
        <p className="rounded-xl2 border border-border/70 bg-background p-6 text-sm text-muted">
          Este vestido ainda não foi reservado nenhuma vez.
        </p>
      ) : (
        <div className="space-y-3">
          {reservas
            .slice()
            .sort((a, b) => b.data_evento.localeCompare(a.data_evento))
            .map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-border/70 bg-background p-4"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{nomeCliente(r.cliente_id)}</p>
                  <p className="text-xs text-muted">
                    Tam. {r.tamanho} · Evento {formatarData(r.data_evento)} · Retirada{" "}
                    {formatarData(r.data_retirada)} · Devolução {formatarData(r.data_devolucao)}
                  </p>
                </div>
                <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold text-foreground/70">
                  {RESERVA_STATUS_LABEL[r.status]}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
