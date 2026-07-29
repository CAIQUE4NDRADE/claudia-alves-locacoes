"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listVestidos, deleteVestido } from "@/lib/api";
import type { Produto } from "@/lib/supabase";
import { toast } from "sonner";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const STATUS_LABEL: Record<Produto["status"], string> = {
  disponivel: "Disponível",
  alugado: "Alugado",
  manutencao: "Manutenção",
  lavanderia: "Lavanderia",
};

export default function VestidosPage() {
  const [vestidos, setVestidos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  function carregar() {
    setCarregando(true);
    listVestidos()
      .then(setVestidos)
      .catch((e) => toast.error(e.message ?? "Erro ao carregar vestidos"))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, []);

  async function remover(id: string, nome: string) {
    if (!confirm(`Remover "${nome}" do acervo?`)) return;
    try {
      await deleteVestido(id);
      toast.success("Vestido removido");
      carregar();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao remover");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Vestidos</h1>
        <Link
          href="/admin/vestidos/novo"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background"
        >
          + Novo vestido
        </Link>
      </div>

      {carregando ? (
        <p className="text-sm text-muted">Carregando…</p>
      ) : vestidos.length === 0 ? (
        <p className="rounded-xl2 border border-border/70 bg-background p-6 text-sm text-muted">
          Nenhum vestido cadastrado ainda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-border/70 bg-background">
          <table className="w-full text-sm">
            <thead className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {vestidos.map((v) => (
                <tr key={v.id} className="border-b border-border/60 last:border-b-0">
                  <td className="px-4 py-3 text-muted">{v.codigo}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{v.nome}</td>
                  <td className="px-4 py-3 capitalize text-muted">{v.categoria}</td>
                  <td className="px-4 py-3 text-foreground">{formatarPreco(v.preco_diaria)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-dark">
                      {STATUS_LABEL[v.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/vestidos/${v.id}/ficha`} className="mr-3 text-gold hover:underline">
                      Ficha
                    </Link>
                    <Link href={`/admin/vestidos/${v.id}`} className="mr-3 text-gold hover:underline">
                      Editar
                    </Link>
                    <button onClick={() => remover(v.id, v.nome)} className="text-bordo hover:underline">
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
