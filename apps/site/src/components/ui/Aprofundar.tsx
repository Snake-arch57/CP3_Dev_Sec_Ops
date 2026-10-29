/**
 * Recolhe o aprofundamento atrás de um clique.
 *
 * Construído sobre `<details>` e `<summary>` nativos, e não sobre um acordeão
 * próprio, por quatro motivos práticos:
 *
 *  1. já vem acessível — o navegador cuida de foco, teclado e do estado que os
 *     leitores de tela anunciam, sem precisar de ARIA escrita à mão;
 *  2. funciona sem JavaScript, o que combina com um site cujo conceito é rodar
 *     inteiro no navegador de quem lê;
 *  3. o Ctrl+F do navegador encontra texto recolhido e abre o bloco sozinho
 *     (comportamento do Chrome e derivados), então esconder não é sumir;
 *  4. impressão e leitura por acessibilidade continuam alcançando o conteúdo.
 *
 * O conteúdo permanece no HTML — isto muda o que a pessoa vê de primeira, não
 * o que existe na página. Um resumo que engana ("clique para ver o que já está
 * escrito acima") seria pior do que texto longo.
 */
export function Aprofundar({
  rotulo,
  children,
  aberto = false,
}: {
  rotulo: string;
  children: React.ReactNode;
  /** Deixe aberto quando o conteúdo for parte do fio principal do argumento. */
  aberto?: boolean;
}) {
  return (
    <details open={aberto} className="group border-t border-chumbo-linha py-4">
      <summary
        className="flex cursor-pointer list-none items-center justify-between gap-4 text-body font-medium text-papel marker:hidden hover:text-menta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-menta"
      >
        <span className="text-pretty">{rotulo}</span>

        {/*
          Sinal de aberto/fechado. `transition` sem `transform` animado no
          próprio ícone para não brigar com prefers-reduced-motion, que o
          globals.css já desliga globalmente.
        */}
        <span
          aria-hidden="true"
          className="shrink-0 font-display text-sm text-papel-3 group-open:text-menta"
        >
          <span className="group-open:hidden">ler mais +</span>
          <span className="hidden group-open:inline">fechar −</span>
        </span>
      </summary>

      <div className="mt-4">{children}</div>
    </details>
  );
}
