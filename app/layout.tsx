import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Toaster } from "sonner";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Claudia Alves Locações | Aluguel de vestidos de festa, madrinha e formatura",
    template: "%s | Claudia Alves Locações",
  },
  description:
    "Alugue vestidos de festa, madrinha, formatura e noiva. Peças em ótimo estado, provas com acompanhamento e atendimento pelo WhatsApp.",
  keywords: [
    "aluguel de vestidos",
    "locação de vestido de festa",
    "vestido de madrinha para alugar",
    "vestido de formatura aluguel",
    "Claudia Alves Locações",
  ],
  openGraph: {
    title: "Claudia Alves Locações",
    description: "Alugue o vestido perfeito para o seu evento. Reserva simples, direto pelo WhatsApp.",
    type: "website",
    locale: "pt_BR",
    siteName: "Claudia Alves Locações",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FBF7F1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster theme="light" position="top-center" richColors />
      </body>
    </html>
  );
}
