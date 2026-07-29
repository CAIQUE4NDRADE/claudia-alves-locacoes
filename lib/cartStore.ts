import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Produto } from "./supabase";

export type ItemReserva = {
  produto: Produto;
  tamanho: string;
  cor: string;
  dataEvento: string;
  dataRetirada: string;
  dataDevolucao: string;
};

type ReservaState = {
  itens: ItemReserva[];
  adicionar: (item: ItemReserva) => void;
  remover: (produtoId: string) => void;
  limpar: () => void;
  subtotal: () => number;
  totalCaucao: () => number;
};

export const useReservaStore = create<ReservaState>()(
  persist(
    (set, get) => ({
      itens: [],
      adicionar: (item) =>
        set((state) => ({
          itens: [...state.itens.filter((i) => i.produto.id !== item.produto.id), item],
        })),
      remover: (produtoId) =>
        set((state) => ({ itens: state.itens.filter((i) => i.produto.id !== produtoId) })),
      limpar: () => set({ itens: [] }),
      subtotal: () =>
        get().itens.reduce(
          (acc, i) => acc + (i.produto.preco_promocional ?? i.produto.preco_diaria),
          0
        ),
      totalCaucao: () => get().itens.reduce((acc, i) => acc + i.produto.caucao, 0),
    }),
    { name: "claudia-alves-locacoes-reservas" }
  )
);
