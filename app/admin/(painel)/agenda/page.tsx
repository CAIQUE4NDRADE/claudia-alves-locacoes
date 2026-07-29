"use client";

import { useEffect, useMemo, useState } from "react";
import { listReservas, listVestidos, listClientes } from "@/lib/api";
import type { Cliente, Produto, Reserva } from "@/lib/supabase";
import { toast } from "sonner";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const STATUS_COR: Record<Reserva["status"], string> = {
  solicitada: "bg-gold/20 text-gold-dark border-gold/40",
  confirmada: "bg-[#3E6B4F]/15 text-[#2E4F3B] border-[#3E6B4F]/30",
  retirada: "bg-blue-500/15 text-blue-700 border-blue-500/30",
  devolvida: "bg-foreground/10 text-foreground/60 border-foreground/20",
  cancelada: "bg-bordo/10 text-bordo/60 border-bordo/20 line-through",
};

function paraChaveData(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Gera todas as datas (YYYY-MM-DD) entre retirada e devolução, inclusive. */
function diasDoPeriodo(retirada: string, devolucao: string): string[] {
  const dias: string[] = [];
  let atual = new Date(retirada + "T00:00:00");
  const fim = new Date(devolucao + "T00:00:00");
  while (atual <= fim) {
    dias.push(paraChaveData(atual));
    atual = new Date(atual.getFullYear(), atual.getMonth(), atual.getDate() + 1);
  }
  return dias;
}

function formatarData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

export default function AgendaPage() {
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [vestidos, setVestidos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  useEffect(() => {
    setCarregando(true);
    Promise.all([listReservas(), listVestidos(), listClientes()])
      .then(([r, v, c]) => {
        setReservas(r.filter((res) => res.status !== "cancelada"));
        setVestidos(v);
        setClientes(c);
      })
      .catch((e) => toast.error(e.message ?? "Erro ao carregar agenda"))
      .finally(() => setCarregando(false));
  }, []);

  const vestidoNome = (id: string) => vestidos.find((v) => v.id === id)?.nome ?? "Vestido removido";
  const clienteNome = (id: string) => clientes.find((c) => c.id === id)?.nome ?? "Cliente";

  // Mapa dia -> lista de reservas que passam por esse dia (do período de retirada até devolução)
  const reservasPorDia = useMemo(() => {
    const mapa = new Map<string, Reserva[]>();
    for (const r of reservas) {
      for (const dia of diasDoPeriodo(r.data_retirada, r.data_devolucao)) {
        if (!mapa.has(dia)) mapa.set(dia, []);
        mapa.get(dia)!.push(r);
      }
    }
    return mapa;
  }, [reservas]);

  const celulas = useMemo(() => {
    const primeiroDiaMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
    const inicioGrade = new Date(primeiroDiaMes);
    inicioGrade.setDate(inicioGrade.getDate() - primeiroDiaMes.getDay());

    const dias: { data: Date; noMes: boolean }[] = [];
    const cursor = new Date(inicioGrade);
    for (let i = 0; i < 42; i++) {
      dias.push({ data: new Date(cursor), noMes: cursor.getMonth() === mesAtual.getMonth() });
      cursor.setDate(cursor.getDate() + 1);
    }
    return dias;
  }, [mesAtual]);

  function mudarMes(delta: number) {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + delta, 1));
    setDiaSelecionado(null);
  }

  const chaveHoje = paraChaveData(hoje);
  const reservasDoDiaSelecionado = diaSelecionado ? reservasPorDia.get(diaSelecionado) ?? [] : [];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-foreground">Agenda</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => mudarMes(-1)}
            className="rounded-full border border-border px-3 py-1.5 text-sm text-foreground/70 hover:border-gold hover:text-gold-dark"
          >
            ← Anterior
          </button>
          <span className="min-w-[140px] text-center text-sm font-semibold text-foreground">
            {MESES[mesAtual.getMonth()]} {mesAtual.getFullYear()}
          </span>
          <button
            onClick={() => mudarMes(1)}
            className="rounded-full border border-border px-3 py-1.5 text-sm text-foreground/70 hover:border-gold hover:text-gold-dark"
          >
            Próximo →
          </button>
        </div>
      </div>

      {carregando ? (
        <p className="text-sm text-muted">Carregando…</p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gold" /> Solicitada</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#3E6B4F]" /> Confirmada</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Retirada (com a cliente)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-foreground/40" /> Devolvida</span>
          </div>

          <div className="overflow-hidden rounded-xl2 border border-border/70 bg-background">
            <div className="grid grid-cols-7 border-b border-border/70 bg-surface/40 text-center text-xs font-semibold uppercase tracking-wide text-muted">
              {DIAS_SEMANA.map((d) => (
                <div key={d} className="py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {celulas.map(({ data, noMes }) => {
                const chave = paraChaveData(data);
                const eventosDoDia = reservasPorDia.get(chave) ?? [];
                const ehHoje = chave === chaveHoje;
                const selecionado = chave === diaSelecionado;
                return (
                  <button
                    key={chave}
                    onClick={() => setDiaSelecionado(eventosDoDia.length ? chave : null)}
                    className={`min-h-[84px] border-b border-r border-border/50 p-1.5 text-left align-top transition-colors sm:min-h-[104px] sm:p-2 ${
                      noMes ? "bg-background" : "bg-surface/20"
                    } ${selecionado ? "ring-2 ring-inset ring-gold" : ""} ${eventosDoDia.length ? "cursor-pointer hover:bg-gold/5" : "cursor-default"}`}
                  >
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                        ehHoje ? "bg-foreground text-background font-bold" : noMes ? "text-muted/50" : "text-foreground/70"
                      }`}
                    >
                      {data.getDate()}
                    </span>
                    <div className="mt-1 space-y-1">
                      {eventosDoDia.slice(0, 2).map((r) => (
                        <div
                          key={r.id}
                          className={`truncate rounded border px-1.5 py-0.5 text-[10px] font-medium sm:text-[11px] ${STATUS_COR[r.status]}`}
                          title={vestidoNome(r.produto_id)}
                        >
                          {vestidoNome(r.produto_id)}
                        </div>
                      ))}
                      {eventosDoDia.length > 2 && (
                        <div className="text-[10px] font-medium text-muted">+{eventosDoDia.length - 2} mais</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {diaSelecionado && reservasDoDiaSelecionado.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
                {formatarData(diaSelecionado)}
              </h2>
              <div className="space-y-3">
                {reservasDoDiaSelecionado.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-border/70 bg-background p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {vestidoNome(r.produto_id)} · {clienteNome(r.cliente_id)}
                      </p>
                      <p className="text-xs text-muted">
                        Tam. {r.tamanho} · Retirada {formatarData(r.data_retirada)} · Devolução{" "}
                        {formatarData(r.data_devolucao)}
                      </p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COR[r.status]}`}>
                      {r.status === "solicitada" && "Solicitada"}
                      {r.status === "confirmada" && "Confirmada"}
                      {r.status === "retirada" && "Retirada"}
                      {r.status === "devolvida" && "Devolvida"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
