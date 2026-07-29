import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { produtosDestaque as produtosMock, categorias } from "@/lib/mockData";
import { listVestidosPublicos } from "@/lib/api";
import { supabaseConfigurado } from "@/lib/supabase";
import type { Produto } from "@/lib/supabase";
import Link from "next/link";

export const metadata = {
  title: "Coleção completa",
  description: "Explore todos os vestidos disponíveis para locação: festa, madrinha, formatura e noiva.",
};

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const categoriaAtiva = searchParams.categoria;

  // Mesma lógica da home: vestidos reais do Supabase, com fallback pro
  // mockData só quando o banco não está configurado ou o acervo está vazio.
  let todosProdutos: Produto[] = produtosMock;
  if (supabaseConfigurado) {
    try {
      const reais = await listVestidosPublicos();
      if (reais.length > 0) todosProdutos = reais;
    } catch (e) {
      console.error("Erro ao buscar vestidos do Supabase:", e);
    }
  }

  const produtos = categoriaAtiva
    ? todosProdutos.filter((p) => p.categoria === categoriaAtiva)
    : todosProdutos;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">Coleção</h1>
        <p className="mt-1 text-sm text-muted">
          {produtos.length} {produtos.length === 1 ? "vestido encontrado" : "vestidos encontrados"}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/produtos"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            !categoriaAtiva
              ? "border-gold bg-gold/10 text-gold"
              : "border-border text-muted hover:border-gold/40"
          }`}
        >
          Todos
        </Link>
        {categorias.map((c) => (
          <Link
            key={c.slug}
            href={`/produtos?categoria=${c.slug}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              categoriaAtiva === c.slug
                ? "border-gold bg-gold/10 text-gold"
                : "border-border text-muted hover:border-gold/40"
            }`}
          >
            {c.nome}
          </Link>
        ))}
      </div>

      <ProductFilters />

      {produtos.length === 0 ? (
        <p className="rounded-xl2 border border-border/70 bg-background p-8 text-center text-sm text-muted">
          Nenhum vestido encontrado nessa categoria.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {produtos.map((p) => (
            <ProductCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
