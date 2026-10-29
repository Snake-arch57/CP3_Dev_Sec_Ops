// Segunda rodada de corte de texto (site + jogo) publicada em 18/09/2026.
import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * Manual de tipografia dos Hackudinhos:
 * Barlow Condensed nomeia (título, etiqueta, botão), Barlow explica (corpo).
 * Sobre chumbo o corpo nunca desce de 400 — peso fino em fundo escuro fecha
 * o contorno da letra e cansa a leitura.
 */
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Você já está exposto — Hackudinhos",
    template: "%s · Hackudinhos",
  },
  description:
    "Golpes digitais no Brasil, explicados por dentro. Teste sua senha, aprenda a reconhecer uma fraude e veja o que fazer se já caiu em uma. Tudo roda no seu navegador.",
  keywords: [
    "golpe do PIX",
    "WhatsApp clonado",
    "phishing",
    "segurança digital",
    "senha forte",
    "caí em um golpe",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${barlow.variable} ${barlowCondensed.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-chumbo font-sans text-body text-papel">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Navbar />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
