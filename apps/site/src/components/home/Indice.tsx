"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { maskReveal, stagger, staticVariants, VIEWPORT } from "@/lib/motion";

const SECOES = [
  {
    n: "01",
    href: "/senha",
    titulo: "Teste de senha",
    resumo:
      "Veja em quanto tempo sua senha seria descoberta.",
    acao: "interativo",
  },
  {
    n: "02",
    href: "/golpe",
    titulo: "Qual deles é golpe?",
    resumo:
      "Ache a mensagem falsa e veja as pistas.",
    acao: "interativo",
  },
  {
    n: "03",
    href: "/anatomia",
    titulo: "Como o golpe funciona por dentro",
    resumo:
      "Como clonam um WhatsApp e como impedir.",
    acao: "leitura",
  },
  {
    n: "04",
    href: "/ia",
    titulo: "Inteligência artificial",
    resumo:
      "Golpes com IA e os cuidados que continuam valendo.",
    acao: "interativo",
  },
  {
    n: "05",
    href: "/agora",
    titulo: "O que fazer agora",
    resumo:
      "Ajustes simples para fazer hoje.",
    acao: "lista",
  },
  {
    n: "06",
    href: "/ja-cai",
    titulo: "Já caí num golpe — e agora?",
    resumo:
      "Na ordem: banco, devolução do PIX, boletim de ocorrência, contatos. Só canais oficiais.",
    acao: "urgente",
  },
];

export function Indice() {
  const semMovimento = useReducedMotion();
  const item = semMovimento ? staticVariants : maskReveal;

  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={stagger(0.08)}
      className="border-t border-chumbo-linha"
    >
      {SECOES.map((s) => {
        const urgente = s.acao === "urgente";
        return (
          <motion.li key={s.n} variants={item} className="border-b border-chumbo-linha">
            {/* A última coluna precisa caber "interativo" mais a seta na mesma
                linha: em mono com tracking aberto isso passa de 7rem, e as
                6rem anteriores empurravam a seta para baixo. */}
            <Link
              href={s.href}
              className="group grid items-baseline gap-x-8 gap-y-2 py-7 transition-colors duration-200 hover:bg-chumbo-painel/60 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.4fr)_7.5rem] md:px-3"
            >
              {/* Índice sempre em menta — é a cor de índice no manual.
                  Quem sinaliza urgência é a etiqueta em bloco, à direita. */}
              <span className="font-display text-sm tabular text-menta">
                {s.n}
              </span>

              <h3 className="font-display text-xl font-semibold text-balance md:text-2xl">
                {s.titulo}
              </h3>

              <p className="text-body leading-relaxed text-papel-2 text-pretty">
                {s.resumo}
              </p>

              <span className="flex items-center gap-2 whitespace-nowrap md:justify-end">
                <span className={urgente ? "etiqueta-risco" : "etiqueta"}>
                  {s.acao}
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block text-papel-3 transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
