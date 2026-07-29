"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, supabaseConfigurado } from "@/lib/supabase";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [verificando, setVerificando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!supabaseConfigurado) {
      // Modo demonstração: sem Supabase configurado, não dá pra checar sessão
      // de verdade. Deixamos entrar direto para não travar a validação do
      // site com a Claudia antes do banco estar pronto.
      setAutenticado(true);
      setVerificando(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAutenticado(true);
      } else {
        router.replace("/admin/login");
      }
      setVerificando(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/admin/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  if (verificando) {
    return <div className="p-10 text-center text-sm text-muted">Carregando…</div>;
  }
  if (!autenticado) return null;

  return <>{children}</>;
}
