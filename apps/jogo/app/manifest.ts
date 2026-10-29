import type { MetadataRoute } from "next";

/**
 * Manifesto PWA — o que permite instalar a plataforma na tela inicial do
 * celular e abri-la em tela cheia, sem a barra do navegador.
 *
 * O Next gera o `/manifest.webmanifest` a partir deste arquivo; não existe
 * JSON solto em `public/`, e não há biblioteca envolvida.
 *
 * Escopo desta versão: instalabilidade e aparência de app. NÃO há service
 * worker, então **a plataforma continua exigindo conexão** — o que já era
 * verdade, porque login, progresso e ranking vivem na API. Um modo offline de
 * verdade não é trabalho de manifesto: exigiria fila local de ações e
 * sincronização ao reconectar.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hackudinhos · Treinamento de segurança",
    // O Android trunca por volta de 12 caracteres sob o ícone. "Hackudinhos"
    // tem 11 e cabe inteiro; qualquer coisa maior apareceria cortada.
    short_name: "Hackudinhos",
    description:
      "Treinamento de segurança da informação em formato de jogo: módulos diários, minijogos e ranking.",
    lang: "pt-BR",
    dir: "ltr",

    start_url: "/",
    // `standalone` abre sem barra de endereço, que é o que faz parecer app.
    // Evitamos `fullscreen`: ele esconde a barra de status do sistema, e num
    // treinamento corporativo ver as horas e a bateria é útil.
    display: "standalone",
    orientation: "portrait-primary",
    scope: "/",

    // Chumbo nos dois: a barra do sistema e a tela de abertura acompanham o
    // fundo da interface, sem o flash branco na abertura.
    theme_color: "#1B1D21",
    background_color: "#1B1D21",

    categories: ["education", "productivity"],

    icons: [
      {
        src: "/icone-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icone-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        // O Android recorta o ícone em formas variadas e só garante os 80%
        // centrais. Sem uma versão `maskable`, o logo perde as bordas.
        src: "/icone-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
