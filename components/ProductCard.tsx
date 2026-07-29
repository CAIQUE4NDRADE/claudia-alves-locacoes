"use client";

import Link from "next/link";
import Image from "next/image";
import type { Produto } from "@/lib/supabase";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductCard({ produto }: { produto: Produto }) {
  const emPromocao = produto.preco_promocional && produto.preco_promocional < produto.preco_diaria;
  const segundaImagem = produto.imagens[1] ?? produto.imagens[0];

  return (
    <Link
      href={`/produto/${produto.slug}`}
      className="group block overflow-hidden rounded-xl2 border border-border/70 bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface">
        <Image
          src={produto.imagens[0]}
          alt={produto.nome}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
        />
        <Image
          src={segundaImagem}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {produto.status !== "disponivel" && (
            <span className="rounded-full bg-foreground/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-background">
              {produto.status === "alugado" ? "Reservado" : "Em manutenção"}
            </span>
          )}
          {produto.status === "disponivel" && (
            <span className="rounded-full bg-[#3E6B4F] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Disponível
            </span>
          )}
          {produto.destaque && (
            <span className="rounded-full bg-bordo px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Exclusivo
            </span>
          )}
          {emPromocao && (
            <span className="rounded-full bg-gold-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Oferta
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-base font-medium text-foreground">{produto.nome}</h3>
        <p className="mt-0.5 text-xs text-muted">
          {produto.cores.join(" · ")} · {produto.tamanhos.join(" ")}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {emPromocao ? (
              <>
                <span className="text-sm font-semibold text-bordo">
                  {formatarPreco(produto.preco_promocional!)}
                </span>
                <span className="text-xs text-muted line-through">{formatarPreco(produto.preco_diaria)}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-foreground">{formatarPreco(produto.preco_diaria)}</span>
            )}
            <span className="text-[11px] text-muted">/ locação</span>
          </div>
          <span className="rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-background transition-transform group-hover:scale-105">
            Reservar
          </span>
        </div>
      </div>
    </Link>
  );
}
