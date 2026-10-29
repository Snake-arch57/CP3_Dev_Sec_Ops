/**
 * Bloco de abertura escaneável — o recado da página em poucos segundos.
 *
 * Existe por causa de um retorno da apresentação para a empresa: "muito
 * texto". A medição deu razão ao comentário — o site tem cerca de 25 mil
 * palavras, com páginas de seis a oito minutos de leitura cada.
 *
 * A resposta não foi cortar conteúdo, e sim admitir que existem dois leitores
 * diferentes na mesma página: quem quer saber o que fazer, e quem quer
 * entender por quê. Este bloco atende o primeiro em três ou quatro linhas; o
 * segundo continua servido pelo texto abaixo, que não perdeu nada.
 *
 * Regra de uso: se um item não couber em uma linha, ele não é essencial —
 * é detalhe, e o lugar dele é no corpo da página.
 */
export function Essencial({
  itens,
  titulo = "O essencial",
}: {
  itens: string[];
  titulo?: string;
}) {
  return (
    <aside
      aria-label={titulo}
      className="rounded border border-chumbo-linha bg-chumbo-painel/60 p-5 md:p-6"
    >
      <p className="etiqueta">{titulo}</p>

      <ul className="mt-4 space-y-2.5">
        {itens.map((item) => (
          <li key={item} className="flex gap-3 text-body text-papel">
            {/* O traço é decorativo: o marcador semântico é o próprio <li>. */}
            <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-menta" />
            <span className="text-pretty">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
