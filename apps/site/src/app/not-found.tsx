import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center py-20">
      <div className="container-read">
        <p className="etiqueta-risco">404</p>
        <h1 className="mt-4 font-display text-title font-semibold text-balance">
          Essa página não existe
        </h1>
        <p className="mt-5 text-bodyLg text-papel-2 text-pretty">
          O endereço pode ter mudado ou nunca ter existido. Se você chegou aqui
          por um link recebido em mensagem, vale desconfiar dele.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-touch items-center rounded-sm bg-menta px-6 py-3 font-display text-sm font-medium text-chumbo transition-colors duration-200 hover:bg-menta-400"
          >
            Voltar ao início
          </Link>
          <Link
            href="/ja-cai"
            className="inline-flex min-h-touch items-center rounded-sm bg-ambar px-6 py-3 font-display text-sm font-medium text-chumbo transition-colors duration-200 hover:bg-[#F5BB63]"
          >
            Já caí num golpe
          </Link>
        </div>
      </div>
    </section>
  );
}
