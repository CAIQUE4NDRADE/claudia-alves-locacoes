"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase, supabaseConfigurado } from "@/lib/supabase";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/vestidos", label: "Vestidos" },
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/financeiro", label: "Financeiro" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <div>
      {!supabaseConfigurado && (
        <div className="bg-gold/15 px-4 py-2 text-center text-xs font-medium text-gold-dark">
          Modo demonstração — Supabase não configurado. Nada aqui está sendo salvo de verdade.
        </div>
      )}
      <header className="border-b border-border/70 bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/admin/dashboard" className="font-display text-lg font-semibold text-foreground">
            Claudia Alves <span className="text-gold">Locações</span>
          </Link>
          <nav className="hidden gap-6 sm:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === l.href ? "text-gold" : "text-foreground/70 hover:text-gold"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={sair}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground/70 hover:border-bordo hover:text-bordo"
          >
            Sair
          </button>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-border/70 px-4 py-2 sm:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 text-sm font-medium ${
                pathname === l.href ? "text-gold" : "text-foreground/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
    </div>
  );
}
