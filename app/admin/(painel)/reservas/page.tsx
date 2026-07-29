"use client";

import { useEffect, useState } from "react";
import { listReservas, listVestidos, updateStatusReserva } from "@/lib/api";
import type { Produto, Reserva } from "@/lib/supabase";
import { toast } from "sonner";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatarData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

const PROXIMO_STATUS: Partial<Record<Reserva["status"], { status: Reserva["status"]; label: string }>> = {
  solicitada: { status: "confirmada", label: "Confirmar" },
  confirmada: { status: "retirada", label: "Marcar retirada" },
  retirada: { status: "devolvida", label: "Marcar devolvida" },
};

const STATUS_LABEL: Record<Reserva["status"], string> = {
  solicitada: "Solicitada",
  confirmada: "Confirmada",
  retirada: "Retirada",
  devolvida: "Devolvida",
  cancelada: "Cancelada",
};

const STATUS_COR: Record<Reserva["status"], string> = {
  solicitada: "bg-gold/10 text-gold-dark",
  confirmada: "bg-[#3E6B4F]/10 text-[#2E4F3B]",
  retirada: "bg-blue-500/10 text-blue-700",
  devolvida: "bg-foreground/10 text-foreground/70",
  cancelada: "bg-bordo/10 text-bordo",
};

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [vestidos, setVestidos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  function carregar() {
    setCarregando(true);
    Promise.all([listReservas(), listVestidos()])
      .then(([r, v]) => {
        setReservas(r);
        setVestidos(v);
      })
      .catch((e) => toast.error(e.message ?? "Erro ao carregar reservas"))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, []);

  const vestidoNome = (id: string) => vestidos.find((v) => v.id === id)?.nome ?? "Vestido removido";

  async function avancarStatus(reserva: Reserva) {
    const proximo = PROXIMO_STATUS[reserva.status];
    if (!proximo) return;
    try {
      await updateStatusReserva(reserva.id, proximo.status);
      toast.success(`Reserva marcada como ${STATUS_LABEL[proximo.status].toLowerCase()}`);
      carregar();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao atualizar status");
    }
  }

  async function cancelar(reserva: Reserva) {
    if (!confirm("Cancelar esta reserva?")) return;
    try {
      await updateStatusReserva(reserva.id, "cancelada");
      toast.success("Reserva cancelada");
      carregar();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao cancelar");
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-foreground">Reservas</h1>

      {carregando ? (
        <p className="text-sm text-muted">Carregando…</p>
      ) : reservas.length === 0 ? (
        <p className="rounded-xl2 border border-border/70 bg-background p-6 text-sm text-muted">
          Nenhuma reserva ainda. Elas aparecem aqui assim que uma cliente
          finalizar o checkout no site.
        </p>
      ) : (
        <div className="space-y-3">
          {reservas.map((r) => {
            const proximo = PROXIMO_STATUS[r.status];
            return (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-border/70 bg-background p-4"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{vestidoNome(r.produto_id)}</p>
                  <p className="text-xs text-muted">
                    Tam. {r.tamanho} · Evento {formatarData(r.data_evento)} · Retirada{" "}
                    {formatarData(r.data_retirada)} · Devolução {formatarData(r.data_devolucao)}
                  </p>
                  <p className="text-xs text-muted">
                    Locação {formatarPreco(r.valor_locacao)} · Sinal {formatarPreco(r.sinal)} · Caução{" "}
                    {formatarPreco(r.valor_caucao)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COR[r.status]}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                  {proximo && (
                    <button
                      onClick={() => avancarStatus(r)}
                      className="rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-background"
                    >
                      {proximo.label}
                    </button>
                  )}
                  {r.status !== "cancelada" && r.status !== "devolvida" && (
                    <button
                      onClick={() => cancelar(r)}
                      className="rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-bordo"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
