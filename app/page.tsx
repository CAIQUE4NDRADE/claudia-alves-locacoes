import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Sparkles,
  Ruler,
  CalendarCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { produtosDestaque as produtosMock, categorias, depoimentos, faq } from "@/lib/mockData";
import { listVestidosPublicos } from "@/lib/api";
import { supabaseConfigurado } from "@/lib/supabase";
import type { Produto } from "@/lib/supabase";

export default async function HomePage() {
  // Busca os vestidos reais cadastrados no painel admin. Se o Supabase não
  // estiver configurado (ou o acervo ainda estiver vazio), cai para os
  // vestidos de exemplo em lib/mockData.ts — só pra demonstração, nunca usados
  // numa reserva de verdade.
  let produtos: Produto[] = produtosMock;
  if (supabaseConfigurado) {
    try {
      const reais = await listVestidosPublicos();
      if (reais.length > 0) produtos = reais;
    } catch (e) {
      console.error("Erro ao buscar vestidos do Supabase:", e);
    }
  }
  const maisAlugados = produtos.filter((p) => p.mais_alugado);
  const destaques = (maisAlugados.length > 0 ? maisAlugados : produtos).slice(0, 8);

  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5519999999999";
  const linkWhatsApp = `https://wa.me/${numero}?text=${encodeURIComponent(
    "Olá! Gostaria de conhecer os vestidos disponíveis para locação da Claudia Alves Locações."
  )}`;

  return (
    <div>
      {/* HERO CINEMATOGRÁFICO */}
      <section className="relative h-[85vh] min-h-[560px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1600&q=80"
          alt="Modelo com vestido de festa disponível para locação"
          fill
          priority
          className="scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/85" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6">
          <span className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold-light">
            <Sparkles className="h-3.5 w-3.5" />
            Novas peças toda semana
          </span>
          <h1
            className="animate-fade-up mt-5 max-w-xl font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "0.05s" }}
          >
            Sua história merece
            <br />
            <span className="text-gold-light">o vestido perfeito.</span>
          </h1>
          <p
            className="animate-fade-up mt-4 max-w-md text-base text-white/85 sm:text-lg"
            style={{ animationDelay: "0.1s" }}
          >
            Coleções exclusivas para festas, casamentos, formaturas e eventos
            especiais — prova com acompanhamento e caução 100% devolvida.
          </p>
          <div
            className="animate-fade-up mt-7 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.15s" }}
          >
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-sm font-bold text-background shadow-glow transition-transform hover:scale-105"
            >
              Agendar prova
            </a>
            <Link
              href="/produtos"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-8 py-4 text-sm font-bold text-white transition-transform hover:scale-105"
            >
              Ver coleção
            </Link>
          </div>
        </div>
      </section>

      {/* BARRA DE ESTATÍSTICAS
          Números de exemplo — troque pelos valores reais da Claudia Alves
          Locações (tamanho do acervo, nota média de avaliações, clientes
          atendidas) antes de divulgar o site publicamente. */}
      <div className="relative z-10 mx-auto -mt-11 max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 divide-y divide-border rounded-xl2 border border-border bg-background shadow-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["80+", "vestidos no acervo"],
            ["4.9 ★", "avaliação média"],
            ["300+", "clientes atendidas"],
          ].map(([n, l], i) => (
            <div key={i} className="px-5 py-5 text-center">
              <p className="font-display text-2xl font-semibold text-gold-dark">{n}</p>
              <p className="text-xs text-muted">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SELOS DE CONFIANÇA */}
      <section className="mt-14 border-b border-t border-border/70 bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            [Ruler, "Prova com acompanhamento", "Ajuda para escolher o tamanho ideal"],
            [CalendarCheck, "Reserva por data", "Retirada e devolução combinadas"],
            [ShieldCheck, "Caução 100% devolvida", "Após a conferência do vestido"],
            [Truck, "Atende toda a região", "Entrega combinada quando necessário"],
          ].map(([Icon, titulo, sub], i) => {
            const IconComp = Icon as React.ElementType;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <IconComp className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{titulo as string}</p>
                  <p className="text-xs text-muted">{sub as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CATEGORIAS — BENTO GRID */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Encontre o vestido para <span className="text-gold">o seu momento</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/produtos?categoria=${cat.slug}`}
              className={`group relative overflow-hidden rounded-xl2 shadow-card ${
                cat.destaque ? "col-span-2 row-span-2 aspect-square lg:col-span-2" : "aspect-square"
              }`}
            >
              <Image
                src={cat.imagem}
                alt={cat.nome}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="font-display text-lg font-semibold text-white sm:text-xl">{cat.nome}</p>
                <p className="text-xs text-white/80">{cat.quantidade} modelos disponíveis</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES + FILTROS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
            Mais alugados
          </h2>
          <Link href="/produtos" className="text-sm font-medium text-gold hover:underline">
            Ver todos →
          </Link>
        </div>
        <ProductFilters />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {destaques.map((p) => (
            <ProductCard key={p.id} produto={p} />
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA — linha do tempo */}
      <section className="border-y border-border/70 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="mb-12 text-center font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Como funciona a locação
          </h2>
          <div className="relative grid gap-8 sm:grid-cols-4">
            <div className="pointer-events-none absolute left-[12%] right-[12%] top-[26px] hidden border-t-2 border-dashed border-gold/50 sm:block" />
            {[
              ["1", "Escolha o vestido", "Navegue pela coleção e reserve a data no site ou pelo WhatsApp."],
              ["2", "Agende a prova", "Vem experimentar no atelier ou por vídeo-chamada."],
              ["3", "Retire o vestido", "Combinamos a retirada 1 a 2 dias antes do evento."],
              ["4", "Devolva e receba a caução", "Depois do evento, é só devolver e receber sua caução de volta."],
            ].map(([n, titulo, texto], i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <span className="z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold font-display text-lg font-semibold text-background shadow-glow">
                  {n}
                </span>
                <h3 className="mb-1.5 font-display text-base font-medium text-foreground">{titulo}</h3>
                <p className="max-w-[180px] text-xs text-muted">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALENDÁRIO DE DISPONIBILIDADE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              Veja a disponibilidade <span className="text-gold">antes de chamar no WhatsApp</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted">
              Cada vestido tem seu próprio calendário. Escolha a data do seu
              evento e veja na hora se a peça está livre — sem ficar
              esperando resposta.
            </p>
            <div className="mt-5 flex gap-5 text-xs text-foreground/80">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#3E6B4F]" /> Disponível
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-bordo" /> Já reservado
              </span>
            </div>
          </div>
          <AvailabilityCalendar nomeVestido="Vestido Terracota" />
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="sobre" className="border-t border-border/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-10 text-center font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Quem já alugou, conta
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {depoimentos.map((d, i) => (
              <div key={i} className="rounded-xl2 border border-border/70 bg-background p-6 shadow-card">
                <p className="text-sm text-foreground/80">&ldquo;{d.texto}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image src={d.foto} alt={d.nome} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{d.nome}</p>
                    <p className="text-xs text-muted">{d.ocasiao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border/70 bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-center font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Perguntas frequentes
          </h2>
          <div className="space-y-3">
            {faq.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl2 border border-border/70 bg-background p-5 open:shadow-card"
              >
                <summary className="cursor-pointer list-none font-display text-base font-medium text-foreground">
                  {f.pergunta}
                </summary>
                <p className="mt-2 text-sm text-muted">{f.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* VIP / NEWSLETTER */}
      <section className="border-t border-border/70 bg-surface py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl2 border border-border/70 bg-background p-8 shadow-card sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Quer saber em primeira mão das novidades?
              </h3>
              <p className="mt-1 text-sm text-muted">
                Lançamentos, promoções e vestidos exclusivos direto no seu
                WhatsApp ou e-mail.
              </p>
            </div>
            <form className="flex w-full gap-2.5 sm:w-auto">
              <input
                type="email"
                required
                placeholder="seu@email.com"
                className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:border-gold focus:outline-none sm:min-w-[220px]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background"
              >
                Quero receber
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-bordo">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-background sm:text-3xl">
            Pronta para reservar o seu vestido?
          </h2>
          <p className="max-w-md text-sm text-background/80">
            Fale com a gente agora pelo WhatsApp e garanta a data do seu evento.
          </p>
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-background shadow-glow transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            Iniciar conversa
          </a>
        </div>
      </section>
    </div>
  );
}
