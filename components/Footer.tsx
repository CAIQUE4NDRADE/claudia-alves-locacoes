import Link from "next/link";
import { Instagram, Music2, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold text-foreground">
            Claudia Alves <span className="text-gold">Locações</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Locação de vestidos de festa, madrinha, formatura e noiva.
            Peças em ótimo estado, provas com acompanhamento e atendimento pessoal.
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-gold hover:text-gold"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-gold hover:text-gold"
            >
              <Music2 className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Coleção</p>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><Link href="/produtos?categoria=festa" className="hover:text-gold">Vestidos de festa</Link></li>
            <li><Link href="/produtos?categoria=madrinha" className="hover:text-gold">Madrinha</Link></li>
            <li><Link href="/produtos?categoria=formatura" className="hover:text-gold">Formatura</Link></li>
            <li><Link href="/produtos?categoria=noiva" className="hover:text-gold">Noiva</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Atendimento</p>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><Link href="/#faq" className="hover:text-gold">Perguntas frequentes</Link></li>
            <li><Link href="/#faq" className="hover:text-gold">Como funciona a caução</Link></li>
            <li><Link href="/#faq" className="hover:text-gold">Políticas de troca</Link></li>
            <li><Link href="/#faq" className="hover:text-gold">Guia de medidas</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Visite o atelier</p>
          <div className="flex items-start gap-2 text-sm text-foreground/80">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>Campinas, SP<br />Ter a sáb · 10h–18h</span>
          </div>
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Pagamento</p>
          <div className="flex gap-1.5">
            {["Pix", "Cartão", "Dinheiro"].map((m) => (
              <span key={m} className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border/70 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Claudia Alves Locações. Todos os direitos reservados.
      </div>
    </footer>
  );
}
