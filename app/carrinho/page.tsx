"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useReservaStore } from "@/lib/cartStore";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

export default function ReservasPage() {
  const { itens, remover, subtotal, totalCaucao } = useReservaStore();

  if (itens.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-foreground">Nenhuma reserva ainda</h1>
        <p className="mt-2 text-sm text-muted">Explore a coleção e escolha o vestido para o seu evento.</p>
        <Link
          href="/produtos"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background"
        >
          Ver coleção
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-2xl font-semibold text-foreground">Minhas reservas</h1>
      <div className="space-y-4">
        {itens.map((item) => (
          <div
            key={item.produto.id}
            className="flex gap-4 rounded-xl2 border border-border/70 bg-background p-4"
          >
            <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
              <Image src={item.produto.imagens[0]} alt={item.produto.nome} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="font-display text-base font-medium text-foreground">{item.produto.nome}</p>
                <p className="text-xs text-muted">Tamanho {item.tamanho}</p>
                <p className="mt-1 text-xs text-foreground/80">
                  Evento: {formatarData(item.dataEvento)} · Retirada: {formatarData(item.dataRetirada)} · Devolução:{" "}
                  {formatarData(item.dataDevolucao)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">
                  Caução {formatarPreco(item.produto.caucao)}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formatarPreco(item.produto.preco_promocional ?? item.produto.preco_diaria)}
                </span>
              </div>
            </div>
            <button
              onClick={() => remover(item.produto.id)}
              aria-label="Remover"
              className="self-start text-muted hover:text-bordo"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-2 border-t border-border/70 pt-6">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Caução total (devolvida após o evento)</span>
          <span>{formatarPreco(totalCaucao())}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-foreground">Total da locação</span>
          <span className="font-display text-lg font-semibold text-gold">{formatarPreco(subtotal())}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-6 flex w-full items-center justify-center rounded-full bg-foreground py-3.5 text-sm font-bold text-background transition-transform hover:scale-[1.01]"
      >
        Confirmar reserva
      </Link>
    </div>
  );
}
