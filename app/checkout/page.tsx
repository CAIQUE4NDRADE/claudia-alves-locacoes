"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReservaStore } from "@/lib/cartStore";
import { toast } from "sonner";

const CAMPO =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-gold focus:outline-none";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

export default function CheckoutPage() {
  const { itens, subtotal, totalCaucao, limpar } = useReservaStore();
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    const form = new FormData(e.currentTarget);
    const nome = form.get("nome");
    const telefone = form.get("telefone");
    const pagamento = form.get("pagamento");

    // Em produção: gravar a reserva no Supabase (tabela `reservas`) com status
    // "solicitada" antes de abrir o WhatsApp, para bloquear a data no calendário
    // até a confirmação da Claudia.

    const linhas = itens
      .map(
        (i) =>
          `• ${i.produto.nome} (Tam. ${i.tamanho}) — evento em ${formatarData(i.dataEvento)}, retirada ${formatarData(
            i.dataRetirada
          )}, devolução ${formatarData(i.dataDevolucao)}`
      )
      .join("%0A");

    const mensagem =
      `Olá! Quero confirmar esta reserva:%0A%0A${linhas}%0A%0A` +
      `Total da locação: ${formatarPreco(subtotal())}%0ACaução: ${formatarPreco(totalCaucao())}%0A` +
      `Nome: ${nome}%0ATelefone: ${telefone}%0APagamento: ${pagamento}`;

    const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5519999999999";
    window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");

    toast.success("Reserva enviada! Continue no WhatsApp para confirmar a data.");
    limpar();
    router.push("/");
  }

  if (itens.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <p className="text-sm text-muted">Você ainda não selecionou nenhum vestido.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-2xl font-semibold text-foreground">Confirmar reserva</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset className="rounded-xl2 border border-border/70 bg-surface/60 p-5">
          <legend className="mb-1 px-1 font-display text-sm font-semibold text-gold">Seus dados</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="nome" required placeholder="Nome completo" className={CAMPO} />
            <input name="telefone" required placeholder="Telefone / WhatsApp" className={CAMPO} />
          </div>
        </fieldset>

        <fieldset className="rounded-xl2 border border-border/70 bg-surface/60 p-5">
          <legend className="mb-1 px-1 font-display text-sm font-semibold text-gold">Pagamento</legend>
          <select name="pagamento" required className={CAMPO}>
            <option value="Pix">Pix</option>
            <option value="Cartão de crédito">Cartão de crédito</option>
            <option value="Dinheiro na retirada">Dinheiro na retirada</option>
          </select>
          <p className="mt-2 text-xs text-muted">
            A caução é cobrada separadamente na retirada e devolvida após a conferência do vestido.
          </p>
        </fieldset>

        <div className="rounded-xl2 border border-border/70 bg-surface/60 p-5">
          <p className="mb-3 font-display text-sm font-semibold text-foreground">Resumo</p>
          <div className="flex justify-between text-sm text-muted">
            <span>Total da locação</span>
            <span>{formatarPreco(subtotal())}</span>
          </div>
          <div className="flex justify-between text-sm text-muted">
            <span>Caução (devolvida)</span>
            <span>{formatarPreco(totalCaucao())}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-sm font-bold text-background transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {enviando ? "Enviando..." : "Enviar reserva pelo WhatsApp"}
        </button>
      </form>
    </div>
  );
}
