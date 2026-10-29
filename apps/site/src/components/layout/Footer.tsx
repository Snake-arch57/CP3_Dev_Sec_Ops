import Link from "next/link";

const COLUNAS = [
  {
    titulo: "Seções",
    links: [
      { href: "/senha", label: "01 · Teste de senha" },
      { href: "/golpe", label: "02 · Qual deles é golpe?" },
      { href: "/anatomia", label: "03 · Como o golpe funciona" },
      { href: "/ia", label: "04 · Inteligência artificial" },
      { href: "/agora", label: "05 · O que fazer agora" },
      { href: "/ja-cai", label: "06 · Já caí num golpe" },
    ],
  },
  {
    titulo: "Projeto",
    links: [
      { href: "/treinamento", label: "Treinamento" },
      { href: "/glossario", label: "Glossário" },
      { href: "/no-trabalho", label: "Golpes no trabalho" },
      { href: "/sobre", label: "Sobre o projeto" },
      { href: "/contato", label: "Contato" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-chumbo-linha bg-chumbo-painel/40">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_repeat(2,minmax(0,1fr))]">
          <div>
            <p className="font-display text-base font-semibold">Hackudinhos</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-papel-2">
              Golpes digitais explicados para qualquer pessoa.
            </p>

            <div className="mt-6 rounded-sm border border-chumbo-linha p-4">
              <p className="etiqueta text-menta">Privacidade</p>
              <p className="mt-2 text-sm leading-relaxed text-papel-2">
                Não rastreamos nem coletamos nada da sua visita. As senhas
                testadas e a ficha da
                página inicial não saem do seu aparelho.
              </p>
            </div>
          </div>

          {COLUNAS.map((col) => (
            <nav key={col.titulo} aria-label={col.titulo}>
              <h2 className="etiqueta">{col.titulo}</h2>
              <ul className="mt-4 space-y-1">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex min-h-touch items-center font-display text-sm text-papel-2 transition-colors duration-200 hover:text-papel"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-chumbo-linha pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs leading-relaxed text-papel-3">
            © {new Date().getFullYear()} Hackudinhos · Projeto acadêmico de
            Defesa Cibernética em parceria com a Leroy Merlin.
          </p>
          <p className="font-display text-xs text-papel-3">
            Conteúdo educativo. Não substitui um advogado nem o seu banco.
          </p>
        </div>
      </div>
    </footer>
  );
}
