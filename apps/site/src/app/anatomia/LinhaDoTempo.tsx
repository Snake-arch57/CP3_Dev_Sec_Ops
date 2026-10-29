"use client";

import { motion, useReducedMotion } from "framer-motion";
import { maskReveal, riseIn, staticVariants, VIEWPORT } from "@/lib/motion";

type Passo = {
  n: string;
  quando: string;
  titulo: string;
  /** O que acontece, narrado do lado de quem aplica o golpe. */
  movimento: string;
  /** Onde a corrente arrebenta — o que impede este passo específico. */
  ruptura?: string;
  /** Passo em que a defesa é mais eficaz. */
  decisivo?: boolean;
};

const PASSOS: Passo[] = [
  {
    n: "01",
    quando: "semanas antes",
    titulo: "Seu número já está por aí",
    movimento:
      "Seu número está em anúncios, grupos e listas vazadas. O golpista junta centenas de números.",
    ruptura:
      "Evite pôr seu número em anúncios e grupos abertos. Mas quase todo número já vazou.",
  },
  {
    n: "02",
    quando: "minutos antes",
    titulo: "Uma espiada em quem você é",
    movimento:
      "Pela foto do WhatsApp e pelas redes abertas, ele descobre quem é sua família.",
    ruptura:
      "Feche seus perfis. Foto do WhatsApp só para contatos: Configurações → Privacidade → Foto do perfil → Meus contatos.",
  },
  {
    n: "03",
    quando: "14h02",
    titulo: "O WhatsApp manda um código",
    movimento:
      "O golpista instala o WhatsApp com o seu número. O app manda um código por SMS para você.",
    ruptura:
      "Chegou código que você não pediu? Alguém tenta entrar agora. Não passe para ninguém.",
  },
  {
    n: "04",
    quando: "14h03",
    titulo: "Uma ligação, um minuto depois",
    movimento:
      "Alguém liga fingindo ser da operadora, de uma loja ou de uma vaga. E pede o código.",
    ruptura:
      "Nenhuma empresa precisa desse código. Nunca. Quem passa o código entrega a conta.",
    decisivo: true,
  },
  {
    n: "05",
    quando: "14h04",
    titulo: "A conta muda de celular",
    movimento:
      "Com o código, sua conta vai para o celular do golpista. O seu desconecta.",
    ruptura:
      "Com a verificação em duas etapas ligada, o app pede também um PIN, uma senha que só você sabe. Sem o PIN, o código do SMS não serve.",
    decisivo: true,
  },
  {
    n: "06",
    quando: "14h10",
    titulo: "Ele observa antes de pedir",
    movimento:
      "Ele vê quem é sua família, quem te empresta dinheiro e como você escreve.",
  },
  {
    n: "07",
    quando: "14h25",
    titulo: "Pedidos para vários contatos",
    movimento:
      "Vários contatos recebem pedido de dinheiro. Desculpas: emergência, app do banco fora do ar, PIX para outra pessoa, “não me liga”.",
    ruptura:
      "Quem recebe deve ligar para a pessoa. O golpista não atende no número verdadeiro.",
  },
  {
    n: "08",
    quando: "às vezes só no dia seguinte",
    titulo: "Você é o último a saber",
    movimento:
      "Parece falha no WhatsApp. Quase sempre, alguém liga perguntando se o PIX era seu.",
    ruptura:
      "WhatsApp desconectou sozinho? É urgente. Reinstale e recupere a conta pelo SMS na hora. Quem estiver dentro é expulso.",
  },
];

export function LinhaDoTempo() {
  const semMovimento = useReducedMotion();
  const v = semMovimento ? staticVariants : maskReveal;
  const vTexto = semMovimento ? staticVariants : riseIn;

  return (
    <ol className="relative">
      {/* Trilho vertical da linha do tempo. */}
      <div
        aria-hidden="true"
        className="absolute left-[0.6875rem] top-2 bottom-2 w-px bg-chumbo-linha md:left-[4.6875rem]"
      />

      {PASSOS.map((p) => (
        <li key={p.n} className="relative pb-12 pl-9 md:pl-28">
          {/* Marcador */}
          <span
            aria-hidden="true"
            className={`absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 md:left-[4.1875rem] ${
              p.decisivo
                ? "border-menta bg-menta"
                : "border-chumbo-linhaForte bg-chumbo"
            }`}
          />
          <span className="etiqueta absolute left-0 top-0 hidden w-14 text-right md:block">
            {p.n}
          </span>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={vTexto}
          >
            <p className="etiqueta">{p.quando}</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-balance md:text-2xl">
              {p.titulo}
            </h3>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={v}
            className="mt-3 max-w-2xl text-body leading-relaxed text-papel-2 text-pretty"
          >
            {p.movimento}
          </motion.p>

          {p.ruptura && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={vTexto}
              className={`mt-4 max-w-2xl border-l-2 py-2.5 pl-4 ${
                p.decisivo ? "border-menta" : "border-chumbo-linhaForte"
              }`}
            >
              <p
                className={`etiqueta ${p.decisivo ? "text-menta" : ""}`}
              >
                {p.decisivo ? "Aqui o golpe quebra" : "Como se proteger"}
              </p>
              <p className="mt-1.5 text-body leading-relaxed text-papel-2 text-pretty">
                {p.ruptura}
              </p>
            </motion.div>
          )}
        </li>
      ))}
    </ol>
  );
}
