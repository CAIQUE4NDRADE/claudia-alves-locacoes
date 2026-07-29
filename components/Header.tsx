"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { useReservaStore } from "@/lib/cartStore";

const NAV = [
  { href: "/produtos?categoria=festa", label: "Festa" },
  { href: "/produtos?categoria=madrinha", label: "Madrinha" },
  { href: "/produtos?categoria=formatura", label: "Formatura" },
  { href: "/produtos", label: "Ver tudo" },
  { href: "/#sobre", label: "Sobre" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const itens = useReservaStore((s) => s.itens);
  const totalItens = itens.length;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Claudia Alves <span className="text-gold">Locações</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Buscar"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-gold hover:text-gold sm:flex"
          >
            <Search className="h-4 w-4" />
          </button>
          <Link
            href="/carrinho"
            aria-label="Minhas reservas"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-gold hover:text-gold"
          >
            <ShoppingBag className="h-4 w-4" />
            {totalItens > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-bordo text-[10px] font-bold text-background">
                {totalItens}
              </span>
            )}
          </Link>
          <button
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 lg:hidden"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border/70 bg-background px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-surface hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
