import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5519999999999";
  const mensagem = encodeURIComponent(
    "Olá! Vi o site da Claudia Alves Locações e gostaria de saber mais sobre alugar um vestido."
  );

  return (
    <a
      href={`https://wa.me/${numero}?text=${mensagem}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-foreground py-2.5 pl-4 pr-2.5 text-background shadow-glow transition-transform hover:scale-105"
    >
      <span className="hidden text-left text-xs leading-tight sm:block">
        <span className="block font-semibold">Precisa de ajuda?</span>
        <span className="text-background/70">Fale com uma consultora</span>
      </span>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-gold">
        <MessageCircle className="h-5 w-5 text-background" />
      </span>
    </a>
  );
}
