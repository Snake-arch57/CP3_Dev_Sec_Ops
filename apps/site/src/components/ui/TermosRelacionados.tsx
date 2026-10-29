import Link from "next/link";
import { VERBETES } from "@/lib/glossario";

/**
 * Bloco de fim de seção apontando para os verbetes relacionados.
 *
 * Existe porque boa parte do conteúdo do site vive em arrays de string
 * (mensagens do quiz, itens do checklist, passos da linha do tempo), onde não
 * dá para inserir link inline sem transformar texto em JSX. Aqui a ponte é
 * feita no rodapé da seção, sem sujar a leitura.
 *
 * Só é usado em server components, então importar a lista inteira de verbetes
 * não custa nada no navegador.
 */
export function TermosRelacionados({ ids }: { ids: string[] }) {
  const encontrados = ids
    .map((id) => VERBETES.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  if (encontrados.length === 0) return null;

  return (
    <div className="mt-12 border-t border-chumbo-linha pt-8">
      <p className="etiqueta">Termos desta página, explicados</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {encontrados.map((v) => (
          <li key={v.id}>
            <Link
              href={`/glossario#${v.id}`}
              className="inline-flex min-h-touch items-center rounded-sm border border-chumbo-linha px-4 font-display text-sm text-papel-2 transition-colors duration-200 hover:border-menta hover:text-menta"
            >
              {v.termo}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-papel-3">
        Não precisa entender nada disso para se proteger — mas se você é do tipo
        que quer saber como a coisa funciona por baixo, o{" "}
        <Link
          href="/glossario"
          className="text-papel-2 underline decoration-chumbo-linhaForte underline-offset-4 hover:text-papel hover:decoration-menta"
        >
          glossário completo
        </Link>{" "}
        está aberto.
      </p>
    </div>
  );
}
