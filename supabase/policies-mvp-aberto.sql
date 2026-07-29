-- Claudia Alves Locações — RLS aberto (SOMENTE para teste rápido com a cliente)
--
-- ATENÇÃO: isto deixa todas as tabelas com leitura/escrita pública (RLS true),
-- para o site inteiro (incluindo o painel admin) funcionar sem exigir login
-- enquanto você valida o catálogo e o fluxo de reserva com a Claudia.
--
-- Antes de divulgar o link publicamente, rode `policies.sql` no lugar deste
-- arquivo (ele restringe clientes, reservas confirmadas e despesas a
-- usuários autenticados como admin — ver README, seção "Travar o painel
-- com login").

alter table produtos enable row level security;
alter table clientes enable row level security;
alter table reservas enable row level security;
alter table despesas enable row level security;

create policy "produtos_aberto" on produtos for all using (true) with check (true);
create policy "clientes_aberto" on clientes for all using (true) with check (true);
create policy "reservas_aberto" on reservas for all using (true) with check (true);
create policy "despesas_aberto" on despesas for all using (true) with check (true);
