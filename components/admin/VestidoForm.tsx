"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Produto } from "@/lib/supabase";
import { createVestido, updateVestido } from "@/lib/api";

const CAMPO =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-gold focus:outline-none";
const LABEL = "mb-1 block text-xs font-semibold uppercase tracking-wide text-muted";

function slugificar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function VestidoForm({ vestido }: { vestido?: Produto }) {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState(vestido?.nome ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    const form = new FormData(e.currentTarget);

    const dados: Partial<Produto> = {
      nome,
      slug: (form.get("slug") as string) || slugificar(nome),
      codigo: form.get("codigo") as string,
      descricao: form.get("descricao") as string,
      categoria: form.get("categoria") as Produto["categoria"],
      preco_diaria: Number(form.get("preco_diaria")),
      preco_promocional: form.get("preco_promocional")
        ? Number(form.get("preco_promocional"))
        : null,
      caucao: Number(form.get("caucao")) || 0,
      status: form.get("status") as Produto["status"],
      tamanhos: (form.get("tamanhos") as string).split(",").map((s) => s.trim()).filter(Boolean),
      cores: (form.get("cores") as string).split(",").map((s) => s.trim()).filter(Boolean),
      imagens: (form.get("imagens") as string).split(",").map((s) => s.trim()).filter(Boolean),
      destaque: form.get("destaque") === "on",
      mais_alugado: form.get("mais_alugado") === "on",
      marca: (form.get("marca") as string) || undefined,
      colecao: (form.get("colecao") as string) || undefined,
      tecido: (form.get("tecido") as string) || undefined,
      fornecedor: (form.get("fornecedor") as string) || undefined,
      valor_compra: form.get("valor_compra") ? Number(form.get("valor_compra")) : null,
      observacoes: (form.get("observacoes") as string) || undefined,
    };

    try {
      if (vestido) {
        await updateVestido(vestido.id, dados);
        toast.success("Vestido atualizado");
      } else {
        await createVestido(dados);
        toast.success("Vestido cadastrado");
      }
      router.push("/admin/vestidos");
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset className="grid gap-4 rounded-xl2 border border-border/70 bg-background p-5 sm:grid-cols-2">
        <legend className="col-span-2 mb-1 font-display text-sm font-semibold text-gold">
          Informações do vestido
        </legend>
        <div>
          <label className={LABEL}>Nome</label>
          <input
            name="nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={CAMPO}
          />
        </div>
        <div>
          <label className={LABEL}>Código interno</label>
          <input name="codigo" defaultValue={vestido?.codigo} placeholder="MA-001" className={CAMPO} />
        </div>
        <div>
          <label className={LABEL}>Slug (URL)</label>
          <input
            name="slug"
            defaultValue={vestido?.slug}
            placeholder={slugificar(nome) || "vestido-terracota"}
            className={CAMPO}
          />
        </div>
        <div>
          <label className={LABEL}>Categoria</label>
          <select name="categoria" defaultValue={vestido?.categoria ?? "festa"} className={CAMPO}>
            <option value="festa">Festa</option>
            <option value="madrinha">Madrinha</option>
            <option value="formatura">Formatura</option>
            <option value="noiva">Noiva</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL}>Descrição</label>
          <textarea name="descricao" rows={2} defaultValue={vestido?.descricao} className={CAMPO} />
        </div>
      </fieldset>

      <fieldset className="grid gap-4 rounded-xl2 border border-border/70 bg-background p-5 sm:grid-cols-3">
        <legend className="col-span-3 mb-1 font-display text-sm font-semibold text-gold">
          Preço e disponibilidade
        </legend>
        <div>
          <label className={LABEL}>Preço da locação (R$)</label>
          <input
            name="preco_diaria"
            type="number"
            step="0.01"
            required
            defaultValue={vestido?.preco_diaria}
            className={CAMPO}
          />
        </div>
        <div>
          <label className={LABEL}>Preço promocional (opcional)</label>
          <input
            name="preco_promocional"
            type="number"
            step="0.01"
            defaultValue={vestido?.preco_promocional ?? ""}
            className={CAMPO}
          />
        </div>
        <div>
          <label className={LABEL}>Caução (R$)</label>
          <input
            name="caucao"
            type="number"
            step="0.01"
            defaultValue={vestido?.caucao ?? 0}
            className={CAMPO}
          />
        </div>
        <div>
          <label className={LABEL}>Status</label>
          <select name="status" defaultValue={vestido?.status ?? "disponivel"} className={CAMPO}>
            <option value="disponivel">Disponível</option>
            <option value="alugado">Alugado</option>
            <option value="manutencao">Manutenção</option>
            <option value="lavanderia">Lavanderia</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="destaque"
            name="destaque"
            type="checkbox"
            defaultChecked={vestido?.destaque}
            className="h-4 w-4"
          />
          <label htmlFor="destaque" className="text-sm text-foreground">Destaque na home</label>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="mais_alugado"
            name="mais_alugado"
            type="checkbox"
            defaultChecked={vestido?.mais_alugado}
            className="h-4 w-4"
          />
          <label htmlFor="mais_alugado" className="text-sm text-foreground">Mais alugado</label>
        </div>
      </fieldset>

      <fieldset className="grid gap-4 rounded-xl2 border border-border/70 bg-background p-5 sm:grid-cols-3">
        <legend className="col-span-3 mb-1 font-display text-sm font-semibold text-gold">
          Tamanhos, cores e fotos
        </legend>
        <div>
          <label className={LABEL}>Tamanhos (separados por vírgula)</label>
          <input
            name="tamanhos"
            defaultValue={vestido?.tamanhos.join(", ")}
            placeholder="P, M, G"
            className={CAMPO}
          />
        </div>
        <div>
          <label className={LABEL}>Cores (separadas por vírgula)</label>
          <input
            name="cores"
            defaultValue={vestido?.cores.join(", ")}
            placeholder="Terracota"
            className={CAMPO}
          />
        </div>
        <div>
          <label className={LABEL}>URLs das fotos (separadas por vírgula)</label>
          <input
            name="imagens"
            defaultValue={vestido?.imagens.join(", ")}
            placeholder="https://..."
            className={CAMPO}
          />
        </div>
      </fieldset>

      <fieldset className="grid gap-4 rounded-xl2 border border-border/70 bg-background p-5 sm:grid-cols-3">
        <legend className="col-span-3 mb-1 font-display text-sm font-semibold text-gold">
          Ficha técnica (uso interno, não aparece no site)
        </legend>
        <div>
          <label className={LABEL}>Marca</label>
          <input name="marca" defaultValue={vestido?.marca} className={CAMPO} />
        </div>
        <div>
          <label className={LABEL}>Coleção</label>
          <input name="colecao" defaultValue={vestido?.colecao} className={CAMPO} />
        </div>
        <div>
          <label className={LABEL}>Tecido</label>
          <input name="tecido" defaultValue={vestido?.tecido} className={CAMPO} />
        </div>
        <div>
          <label className={LABEL}>Fornecedor</label>
          <input name="fornecedor" defaultValue={vestido?.fornecedor} className={CAMPO} />
        </div>
        <div>
          <label className={LABEL}>Valor de compra (R$)</label>
          <input name="valor_compra" type="number" step="0.01" defaultValue={vestido?.valor_compra ?? ""} className={CAMPO} />
        </div>
        <div className="sm:col-span-3">
          <label className={LABEL}>Observações</label>
          <textarea name="observacoes" rows={2} defaultValue={vestido?.observacoes} className={CAMPO} />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={salvando}
        className="w-full rounded-full bg-gradient-gold py-3.5 text-sm font-bold text-background disabled:opacity-50"
      >
        {salvando ? "Salvando…" : vestido ? "Salvar alterações" : "Cadastrar vestido"}
      </button>
    </form>
  );
}
