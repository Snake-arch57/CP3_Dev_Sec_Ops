import type { Config } from "tailwindcss";

/**
 * Identidade Hackudinhos — "Segurança que deixa registro."
 * Manual de identidade v2 · paleta v1 · rev. 08/26.
 *
 * REGRA DURA DO MANUAL: uma cor, uma função.
 *   menta não abre alerta · âmbar não confirma nada ·
 *   petróleo nunca vira fundo de página inteira.
 *
 * | Token    | Função                                                   |
 * |----------|----------------------------------------------------------|
 * | chumbo   | fundo de tudo e superfície dos painéis                   |
 * | papel    | todo o texto sobre o chumbo                              |
 * | menta    | ação, índice, link, estado concluído — nunca pendente    |
 * | petroleo | campo institucional e estado "em andamento" — só fundo   |
 * | ambar    | risco, e SÓ em bloco cheio com texto em chumbo           |
 *
 * Princípio 03: "Risco é bloco cheio, nunca acento." Âmbar não pode virar
 * fio, brilho nem texto solto — use a classe utilitária `.bloco-risco`.
 *
 * Contraste sobre chumbo #1B1D21 (WCAG 2.1):
 *   papel 15.4 · papel-2 7.6 · papel-3 5.0 · menta 9.2 · âmbar 8.5
 * Petróleo fica em 2.5 e por isso NÃO é cor de tinta — é campo.
 * Sobre âmbar cheio, o texto em chumbo também dá 8.5.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chumbo: {
          DEFAULT: "#1B1D21",
          painel: "#2E3138",
          // Derivados para borda: o manual não os especifica, então saem do
          // próprio chumbo para não introduzir cor nova.
          linha: "#383C44",
          linhaForte: "#4A4F59",
        },
        papel: {
          DEFAULT: "#F2F4F3",
          2: "#A9AFAE",
          3: "#868C8B",
        },
        menta: {
          100: "#D9F7EC",
          200: "#B3EFD9",
          300: "#8AE6C5",
          400: "#61DDB4",
          500: "#3ED6A4",
          600: "#2FB88B",
          700: "#249272",
          800: "#1A6B55",
          900: "#124839",
          DEFAULT: "#3ED6A4",
        },
        petroleo: {
          DEFAULT: "#164752",
          claro: "#1F6478",
        },
        ambar: {
          DEFAULT: "#F2A93D",
        },
      },
      fontFamily: {
        // Barlow no corpo: termo de consentimento precisa ser lido sem esforço.
        sans: ["var(--font-barlow)", "system-ui", "sans-serif"],
        // Condensed em título, etiqueta e botão: ar de placa técnica.
        display: ["var(--font-barlow-condensed)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(2.5rem, 7vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.01em" }],
        title: ["clamp(1.875rem, 4.2vw, 3.5rem)", { lineHeight: "1.05" }],
        // Manual: sobre chumbo o corpo nunca desce de 400 nem de 15px.
        body: ["1rem", { lineHeight: "1.65" }],
        bodyLg: ["1.125rem", { lineHeight: "1.6" }],
      },
      spacing: {
        touch: "2.75rem",
      },
      letterSpacing: {
        // O respiro largo do nome é o tom institucional da marca.
        marca: "0.32em",
        etiqueta: "0.14em",
      },
      transitionTimingFunction: {
        marca: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        caret: {
          "0%, 45%": { opacity: "1" },
          "50%, 95%": { opacity: "0" },
        },
      },
      animation: {
        caret: "caret 1.1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
