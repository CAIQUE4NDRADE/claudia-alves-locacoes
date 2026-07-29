-- Claudia Alves Locações — políticas de acesso (RLS)
-- Este é o modelo recomendado para quando o site for divulgado publicamente.
-- Se você só quer testar rápido com a Claudia antes de configurar login,
-- veja `policies-mvp-aberto.sql` — mas troque para este arquivo antes de
-- divulgar o link publicamente.

alter table produtos enable row level security;
alter table clientes enable row level security;
alter table reservas enable row level security;
alter table despesas enable row level security;
alter table usuarios_admin enable row level security;

-- Catálogo é público, mas só peças ativas/publicadas
create policy "produtos_leitura_publica"
  on produtos for select
  using (ativo = true);

create policy "produtos_admin_escreve"
  on produtos for all
  using (exists (select 1 from usuarios_admin where id = auth.uid()))
  with check (exists (select 1 from usuarios_admin where id = auth.uid()));

-- Dados de cliente são sensíveis (CPF, endereço, contato), mas o checkout
-- público do site precisa poder CRIAR um cliente novo ao fechar uma reserva.
-- Leitura, edição e remoção continuam restritas à loja.
create policy "clientes_criacao_publica"
  on clientes for insert
  with check (true);

create policy "clientes_admin_le_edita"
  on clientes for select
  using (exists (select 1 from usuarios_admin where id = auth.uid()));

create policy "clientes_admin_atualiza"
  on clientes for update
  using (exists (select 1 from usuarios_admin where id = auth.uid()));

create policy "clientes_admin_remove"
  on clientes for delete
  using (exists (select 1 from usuarios_admin where id = auth.uid()));

-- Qualquer visitante pode solicitar uma reserva (checkout público do site),
-- mas só como "solicitada" — a confirmação e qualquer mudança de status
-- exigem login da loja
create policy "reservas_criacao_publica"
  on reservas for insert
  with check (status = 'solicitada');

create policy "reservas_admin_le"
  on reservas for select
  using (exists (select 1 from usuarios_admin where id = auth.uid()));

create policy "reservas_admin_atualiza"
  on reservas for update
  using (exists (select 1 from usuarios_admin where id = auth.uid()));

-- Financeiro é sempre restrito à loja
create policy "despesas_somente_admin"
  on despesas for all
  using (exists (select 1 from usuarios_admin where id = auth.uid()))
  with check (exists (select 1 from usuarios_admin where id = auth.uid()));

create policy "usuarios_admin_le_proprio"
  on usuarios_admin for select
  using (id = auth.uid());
