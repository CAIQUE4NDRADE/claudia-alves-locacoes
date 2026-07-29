import { supabase } from "./supabase";
import type { Produto, Cliente, Reserva, Despesa } from "./supabase";

// ---------- Vestidos (produtos) ----------

export async function listVestidos(): Promise<Produto[]> {
  const { data, error } = await supabase.from("produtos").select("*").order("criado_em", { ascending: false });
  if (error) throw error;
  return data as Produto[];
}

export async function createVestido(v: Partial<Produto>): Promise<Produto> {
  const { data, error } = await supabase.from("produtos").insert(v).select().single();
  if (error) throw error;
  return data as Produto;
}

export async function updateVestido(id: string, v: Partial<Produto>): Promise<Produto> {
  const { data, error } = await supabase.from("produtos").update(v).eq("id", id).select().single();
  if (error) throw error;
  return data as Produto;
}

export async function updateStatusVestido(id: string, status: Produto["status"]) {
  const { error } = await supabase.from("produtos").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteVestido(id: string) {
  const { error } = await supabase.from("produtos").delete().eq("id", id);
  if (error) throw error;
}

/** Catálogo público (site) — só peças ativas, respeitando a política de leitura pública do RLS. */
export async function listVestidosPublicos(): Promise<Produto[]> {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .eq("ativo", true)
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return data as Produto[];
}

/** Busca um vestido pelo slug (página pública de detalhe do produto). */
export async function getVestidoPorSlug(slug: string): Promise<Produto | null> {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .eq("slug", slug)
    .eq("ativo", true)
    .maybeSingle();
  if (error) throw error;
  return data as Produto | null;
}

// ---------- Clientes ----------

export async function listClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase.from("clientes").select("*").order("nome");
  if (error) throw error;
  return data as Cliente[];
}

export async function createCliente(c: Partial<Cliente>): Promise<Cliente> {
  const { data, error } = await supabase.from("clientes").insert(c).select().single();
  if (error) throw error;
  return data as Cliente;
}

export async function updateCliente(id: string, c: Partial<Cliente>): Promise<Cliente> {
  const { data, error } = await supabase.from("clientes").update(c).eq("id", id).select().single();
  if (error) throw error;
  return data as Cliente;
}

export async function deleteCliente(id: string) {
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Reservas ----------

export async function listReservas(): Promise<Reserva[]> {
  const { data, error } = await supabase.from("reservas").select("*").order("data_evento");
  if (error) throw error;
  return data as Reserva[];
}

/** Checa se o vestido está livre no período antes de criar a reserva. */
export async function checarDisponibilidade(produtoId: string, retirada: string, devolucao: string) {
  const { data, error } = await supabase.rpc("produto_disponivel", {
    p_produto_id: produtoId,
    p_retirada: retirada,
    p_devolucao: devolucao,
  });
  if (error) throw error;
  return data as boolean;
}

export async function createReserva(r: Partial<Reserva>): Promise<Reserva> {
  const { data, error } = await supabase
    .from("reservas")
    .insert({ ...r, status: "solicitada" })
    .select()
    .single();
  if (error) throw error;
  return data as Reserva;
}

export async function updateStatusReserva(id: string, status: Reserva["status"]) {
  const { error } = await supabase.from("reservas").update({ status }).eq("id", id);
  if (error) throw error;
}

// ---------- Despesas ----------

export async function listDespesas(): Promise<Despesa[]> {
  const { data, error } = await supabase.from("despesas").select("*").order("data", { ascending: false });
  if (error) throw error;
  return data as Despesa[];
}

export async function createDespesa(d: Partial<Despesa>): Promise<Despesa> {
  const { data, error } = await supabase.from("despesas").insert(d).select().single();
  if (error) throw error;
  return data as Despesa;
}

export async function deleteDespesa(id: string) {
  const { error } = await supabase.from("despesas").delete().eq("id", id);
  if (error) throw error;
}
