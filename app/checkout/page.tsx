"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReservaStore } from "@/lib/cartStore";
import { supabase, supabaseConfigurado } from "@/lib/supabase";
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
    const nome = form.get("nome") as string;
    const telefone = form.get("telefone") as string;
    const pagamento = form.get("pagamento") as string;

    // Grava a reserva no Supabase (status "solicitada") antes de abrir o
    // WhatsApp, para o pedido já aparecer no painel da Claudia. Se o
    // Supabase não estiver configurado (modo demonstração), pulamos essa
    // parte e seguimos direto para o WhatsApp — nada trava para o visitante.
    if (supabaseConfigurado) {
      try {
        let clienteId: string | null = null;
        const { data: existente } = await supabase
          .from("clientes")
          .select("id")
          .eq("telefone", telefone)
          .maybeSingle();

        if (existente) {
          clienteId = existente.id;
        } else {
          const { data: novoCliente, error: erroCliente } = await supabase
            .from("clientes")
            .insert({ nome, telefone, whatsapp: telefone })
            .select("id")
            .single();
          if (erroCliente) throw erroCliente;
          clienteId = novoCliente.id;
        }

        const linhasReserva = itens.map((i) => ({
          produto_id: i.produto.id,
          cliente_id: clienteId,
          tamanho: i.tamanho,
          cor: i.cor,
          data_evento: i.dataEvento,
          data_retirada: i.dataRetirada,
          data_devolucao: i.dataDevolucao,
          valor_locacao: i.produto.preco_promocional ?? i.produto.preco_diaria,
          sinal: 0,
          valor_caucao: i.produto.caucao,
          status: "solicitada" as const,
        }));

        const { error: erroReserva } = await supabase.from("reservas").insert(linhasReserva);
        if (erroReserva) throw erroReserva;
      } catch (err) {
        // Não bloqueia o fluxo do WhatsApp por causa disso — só avisa,
        // já que o pedido ainda pode ser fechado manualmente pela loja.
        console.error("Erro ao salvar reserva no Supabase:", err);
        toast.error("Não consegui salvar no banco agora, mas o pedido segue pelo WhatsApp.");
      }
    }

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
