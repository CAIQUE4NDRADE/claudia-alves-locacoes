"use client";

import { useEffect, useState } from "react";
import { listClientes, createCliente, deleteCliente } from "@/lib/api";
import type { Cliente } from "@/lib/supabase";
import { toast } from "sonner";

const CAMPO =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-gold focus:outline-none";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    setCarregando(true);
    listClientes()
      .then(setClientes)
      .catch((e) => toast.error(e.message ?? "Erro ao carregar clientes"))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    const form = new FormData(e.currentTarget);
    try {
      await createCliente({
        nome: form.get("nome") as string,
        telefone: form.get("telefone") as string,
        whatsapp: form.get("telefone") as string,
        email: (form.get("email") as string) || "",
        cpf: (form.get("cpf") as string) || "",
      });
      toast.success("Cliente cadastrada");
      (e.target as HTMLFormElement).reset();
      carregar();
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  }

  async function remover(id: string, nome: string) {
    if (!confirm(`Remover "${nome}"?`)) return;
    try {
      await deleteCliente(id);
      toast.success("Cliente removida");
      carregar();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao remover");
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-foreground">Clientes</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-3 rounded-xl2 border border-border/70 bg-background p-5 sm:grid-cols-4"
      >
        <input name="nome" required placeholder="Nome" className={CAMPO} />
        <input name="telefone" required placeholder="WhatsApp" className={CAMPO} />
        <input name="email" type="email" placeholder="E-mail (opcional)" className={CAMPO} />
        <input name="cpf" placeholder="CPF (opcional)" className={CAMPO} />
        <button
          type="submit"
          disabled={salvando}
          className="sm:col-span-4 rounded-full bg-foreground py-2.5 text-sm font-bold text-background disabled:opacity-50"
        >
          {salvando ? "Salvando…" : "+ Cadastrar cliente"}
        </button>
      </form>

      {carregando ? (
        <p className="text-sm text-muted">Carregando…</p>
      ) : clientes.length === 0 ? (
        <p className="rounded-xl2 border border-border/70 bg-background p-6 text-sm text-muted">
          Nenhuma cliente cadastrada ainda.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-border/70 bg-background">
          <table className="w-full text-sm">
            <thead className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-b-0">
                  <td className="px-4 py-3 font-medium text-foreground">{c.nome}</td>
                  <td className="px-4 py-3 text-muted">{c.telefone}</td>
                  <td className="px-4 py-3 text-muted">{c.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remover(c.id, c.nome)} className="text-bordo hover:underline">
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
