import { Fragment } from "react";

/**
 * Formatador inline mínimo para os textos que vivem em arquivos de dados.
 *
 * Suporta exatamente duas marcações:
 *   `código`     → trecho em mono, para domínio, endereço e nome de arquivo
 *   **destaque** → negrito, reservado para a frase que desmonta um mito
 *
 * Existe porque o conteúdo do site mora em arrays de string (glossário, quiz,
 * checklist) e o React renderiza string crua — sem isto, crase e asterisco
 * aparecem literalmente na tela, com cara de markdown quebrado.
 *
 * Constrói elementos React, nunca HTML: não há caminho para injeção, mesmo se
 * um texto vier de fora um dia.
 */

const PADRAO = /(`[^`]+`|\*\*[^*]+\*\*)/g;

export function TextoRico({ children }: { children: string }) {
  const partes = children.split(PADRAO);

  return (
    <>
      {partes.map((parte, i) => {
        if (parte.startsWith("`") && parte.endsWith("`") && parte.length > 2) {
          return (
            <code
              key={i}
              className="rounded-[2px] bg-chumbo-painel px-1.5 py-0.5 font-display text-[0.9em] text-papel"
            >
              {parte.slice(1, -1)}
            </code>
          );
        }

        if (parte.startsWith("**") && parte.endsWith("**") && parte.length > 4) {
          return (
            <strong key={i} className="font-semibold text-papel">
              {parte.slice(2, -2)}
            </strong>
          );
        }

        return <Fragment key={i}>{parte}</Fragment>;
      })}
    </>
  );
}
