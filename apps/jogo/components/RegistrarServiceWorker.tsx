"use client";

import { useEffect } from "react";

/**
 * Registra o service worker de `public/sw.js`.
 *
 * Não renderiza nada — existe só pelo efeito. Fica no layout raiz para valer
 * em qualquer rota, inclusive na de login, que costuma ser a primeira que a
 * pessoa abre e portanto o melhor momento para o navegador oferecer a
 * instalação.
 *
 * O registro é adiado até o `load` de propósito: durante a primeira pintura o
 * navegador está ocupado com o que o usuário vai ver, e o service worker não
 * tem pressa nenhuma.
 *
 * Em desenvolvimento ele não registra. Service worker com hot reload gera
 * confusão difícil de diagnosticar — a página deixa de refletir a edição e o
 * tempo vai embora procurando erro onde não há.
 */
export function RegistrarServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const registrar = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Falhar aqui não pode derrubar a aplicação: sem service worker a
        // plataforma funciona igual, só perde o convite para instalar.
      });
    };

    if (document.readyState === "complete") {
      registrar();
      return;
    }

    window.addEventListener("load", registrar);
    return () => window.removeEventListener("load", registrar);
  }, []);

  return null;
}
