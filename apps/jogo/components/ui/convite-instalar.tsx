"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

/**
 * Convite para instalar a plataforma como app.
 *
 * Por que existe, em vez de deixar o navegador cuidar: o prompt automático do
 * Chrome tem heurística de engajamento — só aparece depois de a pessoa ter
 * tocado na página E passado uns 30 segundos nela. Quem abre, olha e sai nunca
 * vê. E no iOS não existe prompt nenhum: instalar é sempre manual.
 *
 * Então capturamos o evento `beforeinstallprompt`, guardamos, e mostramos um
 * botão próprio. O navegador continua no controle da instalação em si — só o
 * convite é nosso.
 *
 * Quando o evento não vem (iOS, ou navegador que não implementa), caímos numa
 * instrução curta de como fazer pelo menu. É melhor do que não oferecer nada.
 */

type EventoDeInstalacao = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const CHAVE_DISPENSADO = "hackudinhos-convite-instalar-dispensado";

// Quanto esperar pelo `beforeinstallprompt` antes de assumir que ele não vem e
// oferecer a instrução manual.
const ESPERA_MS = 2500;

function jaEstaInstalado() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS não implementa display-mode e usa esta propriedade própria.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function ehIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function ConviteInstalar() {
  const [evento, setEvento] = useState<EventoDeInstalacao | null>(null);
  const [visivel, setVisivel] = useState(false);
  const [mostrandoComoFazer, setMostrandoComoFazer] = useState(false);

  useEffect(() => {
    if (jaEstaInstalado()) return;
    try {
      if (localStorage.getItem(CHAVE_DISPENSADO) === "1") return;
    } catch {
      // Navegação privada pode bloquear o localStorage; seguimos mostrando.
    }

    const capturar = (e: Event) => {
      // Impede o banner padrão do navegador, para não competir com o nosso.
      e.preventDefault();
      setEvento(e as EventoDeInstalacao);
      setVisivel(true);
    };

    window.addEventListener("beforeinstallprompt", capturar);

    // Se o evento não veio a tempo, ainda assim oferecemos o caminho manual.
    const relogio = setTimeout(() => setVisivel(true), ESPERA_MS);

    const aoInstalar = () => setVisivel(false);
    window.addEventListener("appinstalled", aoInstalar);

    return () => {
      window.removeEventListener("beforeinstallprompt", capturar);
      window.removeEventListener("appinstalled", aoInstalar);
      clearTimeout(relogio);
    };
  }, []);

  function dispensar() {
    setVisivel(false);
    try {
      localStorage.setItem(CHAVE_DISPENSADO, "1");
    } catch {
      // Sem localStorage o convite volta na próxima visita. Aceitável.
    }
  }

  async function instalar() {
    if (!evento) {
      // Sem o evento nativo, resta ensinar o caminho pelo menu.
      setMostrandoComoFazer(true);
      return;
    }
    await evento.prompt();
    const { outcome } = await evento.userChoice;
    if (outcome === "accepted") setVisivel(false);
    // Se recusou, o evento não pode ser reusado — some o botão para não insistir.
    setEvento(null);
    if (outcome === "dismissed") dispensar();
  }

  if (!visivel) return null;

  const instrucao = ehIOS()
    ? "Toque em Compartilhar e escolha “Adicionar à Tela de Início”."
    : "Abra o menu do navegador (⋮) e escolha “Instalar app” ou “Adicionar à tela inicial”.";

  return (
    <div
      role="dialog"
      aria-label="Instalar aplicativo"
      className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-md rounded-lg border border-border bg-surface p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:w-96"
    >
      <button
        onClick={dispensar}
        aria-label="Dispensar"
        className="absolute right-2 top-2 rounded p-1.5 text-text-muted hover:bg-surface-2 hover:text-text"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="mt-0.5 shrink-0 rounded bg-primary/15 p-2">
          {ehIOS() ? (
            <Share className="h-5 w-5 text-primary" aria-hidden="true" />
          ) : (
            <Download className="h-5 w-5 text-primary" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0">
          <p className="font-stencil text-base font-semibold text-text">
            Instalar no celular
          </p>
          <p className="mt-1 text-sm leading-snug text-text-muted">
            {mostrandoComoFazer || !evento
              ? instrucao
              : "Abre em tela cheia, com ícone próprio, sem barra de navegador."}
          </p>

          {!mostrandoComoFazer && evento && (
            <button
              onClick={instalar}
              className="mt-3 w-full rounded bg-primary px-4 py-2.5 font-stencil text-sm font-semibold text-bg transition-colors hover:bg-primary-hover"
            >
              Instalar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
