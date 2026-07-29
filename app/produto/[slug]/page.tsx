"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, CalendarDays } from "lucide-react";
import { produtosDestaque } from "@/lib/mockData";
import { useReservaStore } from "@/lib/cartStore";
import { toast } from "sonner";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProdutoPage() {
  const params = useParams<{ slug: string }>();
  const produto = produtosDestaque.find((p) => p.slug === params.slug) ?? produtosDestaque[0];
  const [tamanho, setTamanho] = useState(produto.tamanhos[0]);
  const [dataEvento, setDataEvento] = useState("");
  const [dataRetirada, setDataRetirada] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const adicionar = useReservaStore((s) => s.adicionar);

  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5519999999999";
  const linkWhatsApp = `https://wa.me/${numero}?text=${encodeURIComponent(
    `Olá! Tenho interesse em alugar o vestido "${produto.nome}" (tamanho ${tamanho}) para o evento em ${dataEvento || "[data do evento]"}.`
  )}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl2 bg-surface">
          <Image src={produto.imagens[0]} alt={produto.nome} fill className="object-cover" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
            {produto.categoria} · {produto.cores.join(" · ")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">{produto.nome}</h1>
          <div className="mt-3 flex items-baseline gap-2">
            {produto.preco_promocional ? (
              <>
                <span className="text-xl font-semibold text-bordo">
                  {formatarPreco(produto.preco_promocional)}
                </span>
                <span className="text-sm text-muted line-through">{formatarPreco(produto.preco_diaria)}</span>
              </>
            ) : (
              <span className="text-xl font-semibold text-foreground">{formatarPreco(produto.preco_diaria)}</span>
            )}
            <span className="text-sm text-muted">/ locação (3 dias)</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            + caução de {formatarPreco(produto.caucao)}, devolvida após a conferência do vestido.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">{produto.descricao}</p>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Tamanho</p>
            <div className="flex flex-wrap gap-2">
              {produto.tamanhos.map((t) => (
                <button
                  key={t}
                  onClick={() => setTamanho(t)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    tamanho === t
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border text-foreground/70 hover:border-gold/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl2 border border-border/70 bg-surface/60 p-5">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
              <CalendarDays className="h-4 w-4" /> Datas da locação
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-xs text-muted">
                Data do evento
                <input
                  type="date"
                  value={dataEvento}
                  onChange={(e) => setDataEvento(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                />
              </label>
              <label className="text-xs text-muted">
                Retirada
                <input
                  type="date"
                  value={dataRetirada}
                  onChange={(e) => setDataRetirada(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                />
              </label>
              <label className="text-xs text-muted">
                Devolução
                <input
                  type="date"
                  value={dataDevolucao}
                  onChange={(e) => setDataDevolucao(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                if (!dataEvento || !dataRetirada || !dataDevolucao) {
                  toast.error("Preencha as três datas para reservar");
                  return;
                }
                adicionar({
                  produto,
                  tamanho,
                  cor: produto.cores[0],
                  dataEvento,
                  dataRetirada,
                  dataDevolucao,
                });
                toast.success("Vestido adicionado às suas reservas");
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-bold text-background transition-transform hover:scale-[1.02]"
            >
              Reservar este vestido
            </button>
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-gold/50 bg-gold/5 px-6 py-3.5 text-sm font-bold text-foreground transition-transform hover:scale-[1.02] hover:bg-gold/10"
            >
              <MessageCircle className="h-4 w-4 text-gold" />
              Confirmar disponibilidade
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
