"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Produto } from "@/lib/supabase";
import { VestidoForm } from "@/components/admin/VestidoForm";
import { toast } from "sonner";

export default function EditarVestidoPage() {
  const params = useParams<{ id: string }>();
  const [vestido, setVestido] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase
      .from("produtos")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          toast.error("Não encontrei esse vestido");
        } else {
          setVestido(data as Produto);
        }
        setCarregando(false);
      });
  }, [params.id]);

  if (carregando) return <p className="text-sm text-muted">Carregando…</p>;
  if (!vestido) return <p className="text-sm text-muted">Vestido não encontrado.</p>;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-foreground">Editar vestido</h1>
      <VestidoForm vestido={vestido} />
    </div>
  );
}
