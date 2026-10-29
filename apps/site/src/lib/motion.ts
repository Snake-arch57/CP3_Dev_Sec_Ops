import type { Variants } from "framer-motion";

/**
 * Vocabulário de movimento do site.
 *
 * A revelação padrão é por máscara (clip-path), não por fade: o bloco é
 * descoberto da esquerda para a direita, como quem passa o dedo numa linha
 * de laudo. Fade puro é usado só onde a máscara atrapalharia a leitura.
 *
 * Quem tiver `prefers-reduced-motion: reduce` recebe `staticVariants`, que
 * entrega o estado final sem transição nenhuma. Os componentes trocam com
 * `useReducedMotion()` do Framer Motion.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const maskReveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0.35 },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const stagger = (childDelay = 0.07, initialDelay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: childDelay, delayChildren: initialDelay },
  },
});

/** Estado final imediato, para prefers-reduced-motion. */
export const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" },
  visible: { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" },
};

/** Viewport padrão: anima uma vez só, um pouco antes de entrar de fato. */
export const VIEWPORT = { once: true, margin: "-60px 0px" } as const;
