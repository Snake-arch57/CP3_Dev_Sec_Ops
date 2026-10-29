import Link from "next/link";

/**
 * Link inline para um verbete do glossário.
 *
 * É um link comum de propósito: funciona sem JavaScript, é alcançável pelo
 * teclado e o leitor de tela anuncia como link. Tooltip com `title` foi
 * descartado porque não aparece no toque e não é lido de forma confiável.
 *
 * Não importa `glossario.ts` de propósito — este componente é usado dentro de
 * client components (o hero, por exemplo), e puxar a lista inteira de verbetes
 * colocaria uns 15 KB de texto no bundle do navegador sem necessidade.
 *
 * Use com parcimônia: só na primeira aparição do termo em cada página.
 * Parágrafo cheio de link sublinhado é mais difícil de ler, não mais fácil.
 */
export function Termo({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/glossario#${id}`}
      className="underline decoration-dotted decoration-papel-3 underline-offset-4 transition-colors hover:text-papel hover:decoration-menta"
    >
      {children}
      <span className="sr-only"> — ver no glossário</span>
    </Link>
  );
}
