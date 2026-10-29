let pageFlipAudio: HTMLAudioElement | null = null;

/** Efeito sonoro de virar página (arquivo real, tocado baixo — nada exagerado). */
export function playPageTurnSound() {
  if (typeof window === "undefined") return;

  if (!pageFlipAudio) {
    pageFlipAudio = new Audio("/sounds/page-flip.mp3");
    pageFlipAudio.volume = 0.35;
  }

  // Permite tocar de novo mesmo se o clipe anterior ainda não terminou
  // (cliques rápidos de próxima/anterior).
  const instance = pageFlipAudio.cloneNode(true) as HTMLAudioElement;
  instance.volume = pageFlipAudio.volume;
  void instance.play().catch(() => {});
}
