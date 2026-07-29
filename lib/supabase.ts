import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local (ou nas Environment Variables da Vercel)."
  );
}

// Usamos uma URL placeholder válida quando as variáveis não estão setadas,
// pra createClient não travar a aplicação inteira (tela branca). As chamadas
// falham normalmente e o app cai em "modo demonstração" (dados de exemplo em
// lib/mockData.ts, nada salvo de verdade) — o mesmo padrão usado no MVP da
// Milê Atelier, útil para validar o site com a cliente antes do banco real.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key"
);

export const supabaseConfigurado = Boolean(url && anonKey);

export type StatusVestido = "disponivel" | "alugado" | "manutencao" | "lavanderia";

export type Produto = {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  codigo: string; // código interno do atelier (etiqueta física do vestido)
  preco_diaria: number; // valor da locação (período padrão, ex: 3 dias)
  preco_promocional: number | null;
  caucao: number; // devolvida integralmente após a conferência do vestido
  categoria: "festa" | "madrinha" | "noiva" | "formatura";
  tamanhos: string[];
  cores: string[];
  imagens: string[];
  destaque: boolean;
  mais_alugado: boolean;
  status: StatusVestido;
  // Ficha técnica / gestão de acervo (útil para o admin, não aparece no site público)
  marca?: string;
  colecao?: string;
  tecido?: string;
  fornecedor?: string;
  valor_compra?: number | null;
  valor_venda?: number | null; // caso a peça saia do acervo de locação e vá para venda
  data_compra?: string | null;
  ultima_lavagem?: string | null;
  ultimo_ajuste?: string | null;
  observacoes?: string;
  criado_em: string;
};

export type Cliente = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  whatsapp: string;
  email: string;
  instagram?: string;
  endereco?: string;
  observacoes?: string;
  criado_em: string;
};

export type Reserva = {
  id: string;
  produto_id: string;
  cliente_id: string;
  tamanho: string;
  cor: string;
  evento: string; // ex: "Casamento", "Formatura", "Aniversário"
  data_evento: string;
  data_retirada: string;
  data_devolucao: string;
  valor_locacao: number;
  sinal: number; // valor pago para confirmar a reserva, abatido do total
  valor_caucao: number;
  status: "solicitada" | "confirmada" | "retirada" | "devolvida" | "cancelada";
  criado_em: string;
};

export type Despesa = {
  id: string;
  descricao: string;
  categoria: string; // ex: "Lavanderia", "Ajuste/costura", "Compra de peça", "Marketing"
  valor: number;
  data: string;
};
