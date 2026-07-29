"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  listReservas,
  listVestidos,
  listClientes,
  listDespesas,
  createDespesa,
  deleteDespesa,
} from "@/lib/api";
import type { Reserva, Produto, Cliente, Despesa } from "@/lib/supabase";

const CAMPO =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-gold focus:outline-none";

const CATEGORIAS_DESPESA = [
  "Lavanderia",
  "Ajustes/Costura",
  "Compra de peça",
  "Aluguel/Contas",
  "Marketing",
  "Outros",
];

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

const STATUS_COR: Record<Reserva["status"], string> = {
  solicitada: "bg-gold/10 text-gold-dark",
  confirmada: "bg-[#3E6B4F]/10 text-[#2E4F3B]",
  retirada: "bg-blue-500/10 text-blue-700",
  devolvida: "bg-foreground/10 text-foreground/70",
  cancelada: "bg-bordo/10 text-bordo",
};

export default function FinanceiroPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [vestidos, setVestidos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    setCarregando(true);
    Promise.all([listReservas(), listVestidos(), listClientes(), listDespesas()])
      .then(([r, v, c, d]) => {
        setReservas(r);
        setVestidos(v);
        setClientes(c);
        setDespesas(d);
      })
      .catch((e) => toast.error(e.message ?? "Erro ao carregar dados financeiros"))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, []);

  const vestidoNome = (id: string) => vestidos.find((v) => v.id === id)?.nome ?? "Vestido removido";
  const clienteNome = (id: string) => clientes.find((c) => c.id === id)?.nome ?? "Cliente removida";

  // Entradas: valor cheio das reservas já retiradas/devolvidas + sinal das que ainda
  // estão em aberto (solicitada/confirmada) — dinheiro que já entrou de fato no caixa.
  const entradas = reservas.reduce((soma, r) => {
    if (r.status === "retirada" || r.status === "devolvida") return soma + Number(r.valor_locacao || 0);
    if (r.status === "solicitada" || r.status === "confirmada") return soma + Number(r.sinal || 0);
    return soma;
  }, 0);

  // A receber: o que falta cobrar (valor da locação menos o sinal já pago) nas
  // reservas que ainda não foram concluídas nem canceladas.
  const aReceber = reservas
    .filter((r) => ["solicitada", "confirmada", "retirada"].includes(r.status))
    .reduce((soma, r) => soma + (Number(r.valor_locacao || 0) - Number(r.sinal || 0)), 0);

  const totalDespesas = despesas.reduce((soma, d) => soma + Number(d.valor || 0), 0);
  const lucro = entradas - totalDespesas;

  async function handleNovaDespesa(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    const form = new FormData(e.currentTarget);
    try {
      await createDespesa({
        descricao: form.get("descricao") as string,
        categoria: form.get("categoria") as string,
        valor: Number(form.get("valor")),
        data: form.get("data") as string,
      });
      toast.success("Despesa lançada");
      (e.target as HTMLFormElement).reset();
      carregar();
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao salvar despesa");
    } finally {
      setSalvando(false);
    }
  }

  async function removerDespesa(id: string, descricao: string) {
    if (!confirm(`Remover a despesa "${descricao}"?`)) return;
    try {
      await deleteDespesa(id);
      toast.success("Despesa removida");
      carregar();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao remover despesa");
    }
  }

  if (carregando) return <p className="text-sm text-muted">Carregando financeiro…</p>;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-foreground">Financeiro</h1>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["Entradas", formatarPreco(entradas), "text-[#2E4F3B]"],
          ["Despesas", formatarPreco(totalDespesas), "text-bordo"],
          ["Lucro", formatarPreco(lucro), lucro >= 0 ? "text-[#2E4F3B]" : "text-bordo"],
          ["A receber (saldos)", formatarPreco(aReceber), "text-gold-dark"],
        ].map(([label, valor, cor], i) => (
          <div key={i} className="rounded-xl2 border border-border/70 bg-background p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className={`mt-1 font-display text-xl font-semibold ${cor}`}>{valor}</p>
          </div>
        ))}
      </div>

      {/* NOVA DESPESA */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Lançar despesa</h2>
        <form
          onSubmit={handleNovaDespesa}
          className="grid gap-3 rounded-xl2 border border-border/70 bg-background p-5 sm:grid-cols-4"
        >
          <input
            name="descricao"
            required
            placeholder="Descrição (ex: Lavagem vestido MA-002)"
            className={`${CAMPO} sm:col-span-2`}
          />
          <select name="categoria" defaultValue={CATEGORIAS_DESPESA[0]} className={CAMPO}>
            {CATEGORIAS_DESPESA.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            name="data"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className={CAMPO}
          />
          <input
            name="valor"
            type="number"
            step="0.01"
            required
            placeholder="Valor (R$)"
            className={CAMPO}
          />
          <button
            type="submit"
            disabled={salvando}
            className="sm:col-span-3 rounded-full bg-foreground py-2.5 text-sm font-bold text-background disabled:opacity-50"
          >
            {salvando ? "Salvando…" : "+ Lançar despesa"}
          </button>
        </form>
      </section>

      {/* TABELA DE DESPESAS */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Despesas lançadas</h2>
        {despesas.length === 0 ? (
          <p className="rounded-xl2 border border-border/70 bg-background p-6 text-sm text-muted">
            Nenhuma despesa registrada. Use o formulário acima para lançar
            lavanderia, ajustes, compras e outros custos.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl2 border border-border/70 bg-background">
            <table className="w-full text-sm">
              <thead className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {despesas.map((d) => (
                  <tr key={d.id} className="border-b border-border/60 last:border-b-0">
                    <td className="px-4 py-3 text-muted">{formatarData(d.data)}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{d.descricao}</td>
                    <td className="px-4 py-3 text-muted">{d.categoria}</td>
                    <td className="px-4 py-3 text-bordo">{formatarPreco(d.valor)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removerDespesa(d.id, d.descricao)}
                        className="text-bordo hover:underline"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* TABELA DE LOCAÇÕES (saldo por reserva) */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Locações e saldos</h2>
        {reservas.length === 0 ? (
          <p className="rounded-xl2 border border-border/70 bg-background p-6 text-sm text-muted">
            Nenhuma reserva ainda.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl2 border border-border/70 bg-background">
            <table className="w-full text-sm">
              <thead className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Vestido</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Sinal</th>
                  <th className="px-4 py-3">Saldo</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 last:border-b-0">
                    <td className="px-4 py-3 font-medium text-foreground">{clienteNome(r.cliente_id)}</td>
                    <td className="px-4 py-3 text-muted">{vestidoNome(r.produto_id)}</td>
                    <td className="px-4 py-3">{formatarPreco(r.valor_locacao)}</td>
                    <td className="px-4 py-3">{formatarPreco(r.sinal)}</td>
                    <td className="px-4 py-3">
                      {formatarPreco(Number(r.valor_locacao) - Number(r.sinal))}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COR[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
