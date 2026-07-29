-- Claudia Alves Locações — schema do banco (Supabase / Postgres)
-- Cobre o site público (catálogo) e o painel administrativo completo
-- (vestidos, clientes, reservas e financeiro).

create extension if not exists "uuid-ossp";

create table if not exists usuarios_admin (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  papel text not null default 'admin',
  criado_em timestamptz not null default now()
);

-- ---------- Vestidos (acervo) ----------
create table if not exists produtos (
  id uuid primary key default uuid_generate_v4(),
  codigo text unique, -- etiqueta física da peça no atelier, ex: "MA-001"
  nome text not null,
  slug text not null unique,
  descricao text not null default '',
  preco_diaria numeric(10,2) not null,
  preco_promocional numeric(10,2),
  caucao numeric(10,2) not null default 0,
  categoria text not null check (categoria in ('festa','madrinha','formatura','noiva')),
  tamanhos text[] not null default '{}',
  cores text[] not null default '{}',
  imagens text[] not null default '{}',
  destaque boolean not null default false,
  mais_alugado boolean not null default false,
  status text not null default 'disponivel'
    check (status in ('disponivel','alugado','manutencao','lavanderia')),
  ativo boolean not null default true,
  -- Ficha técnica / gestão de acervo (uso interno do admin, não aparece no site)
  marca text,
  colecao text,
  tecido text,
  fornecedor text,
  valor_compra numeric(10,2),
  valor_venda numeric(10,2), -- caso a peça saia do acervo de locação e vá para venda
  data_compra date,
  ultima_lavagem date,
  ultimo_ajuste date,
  observacoes text,
  criado_em timestamptz not null default now()
);

-- ---------- Clientes (CRM básico) ----------
create table if not exists clientes (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  cpf text,
  telefone text,
  whatsapp text,
  email text,
  instagram text,
  endereco text,
  observacoes text,
  criado_em timestamptz not null default now()
);

-- ---------- Reservas ----------
-- Cada linha bloqueia uma peça para um período. É isso que substitui o
-- "estoque por quantidade" de uma loja comum: aqui o limite é por data.
create table if not exists reservas (
  id uuid primary key default uuid_generate_v4(),
  produto_id uuid not null references produtos(id) on delete cascade,
  cliente_id uuid references clientes(id) on delete set null,
  tamanho text not null,
  cor text,
  evento text, -- ex: "Casamento", "Formatura", "Aniversário"
  data_evento date not null,
  data_retirada date not null,
  data_devolucao date not null,
  valor_locacao numeric(10,2) not null,
  sinal numeric(10,2) not null default 0, -- valor pago para confirmar, abatido do total
  valor_caucao numeric(10,2) not null default 0,
  status text not null default 'solicitada'
    check (status in ('solicitada','confirmada','retirada','devolvida','cancelada')),
  criado_em timestamptz not null default now(),
  constraint periodo_valido check (data_devolucao >= data_retirada)
);

create index if not exists idx_reservas_produto_datas
  on reservas (produto_id, data_retirada, data_devolucao)
  where status in ('solicitada','confirmada','retirada');

-- ---------- Despesas (financeiro) ----------
create table if not exists despesas (
  id uuid primary key default uuid_generate_v4(),
  descricao text not null,
  categoria text, -- ex: "Lavanderia", "Ajuste/costura", "Compra de peça", "Marketing"
  valor numeric(10,2) not null,
  data date not null default current_date
);

-- Checa disponibilidade de um produto num período (usado pelo admin e,
-- futuramente, por uma tela pública de disponibilidade)
create or replace function produto_disponivel(
  p_produto_id uuid, p_retirada date, p_devolucao date
) returns boolean as $$
begin
  return not exists (
    select 1 from reservas
    where produto_id = p_produto_id
      and status in ('solicitada','confirmada','retirada')
      and daterange(data_retirada, data_devolucao, '[]') && daterange(p_retirada, p_devolucao, '[]')
  );
end;
$$ language plpgsql stable;
