-- Garante que a tabela despesas existe (não faz nada se já existir)
create table if not exists despesas (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  categoria text not null default 'Outros',
  valor numeric not null default 0,
  data date not null default current_date
);

-- Ativa RLS (Row Level Security)
alter table despesas enable row level security;

-- Remove políticas antigas com o mesmo nome, se existirem, pra evitar erro de duplicidade
drop policy if exists "Admins podem tudo em despesas" on despesas;

-- Só admins autenticados podem ler/escrever despesas (dado financeiro sensível,
-- nunca deve ser público)
create policy "Admins podem tudo em despesas"
  on despesas
  for all
  using (auth.uid() in (select id from usuarios_admin))
  with check (auth.uid() in (select id from usuarios_admin));
