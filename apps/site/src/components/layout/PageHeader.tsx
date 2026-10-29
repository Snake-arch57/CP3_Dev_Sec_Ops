/**
 * Cabeçalho de seção em campo petróleo.
 *
 * O manual reserva o azul-petróleo para "campo institucional: cabeçalho do
 * produto, divisores de apresentação". É a única cor de campo do sistema, e
 * ela nunca é tinta — por isso aparece como fundo cheio, com o texto em papel.
 *
 * Contraste sobre petróleo #164752: papel 9.3 · menta 5.5. Ambos passam AA.
 *
 * O manual também proíbe petróleo como fundo de página inteira, então ele
 * termina aqui: o corpo da página segue em chumbo.
 */
export function PageHeader({
  numero,
  eyebrow,
  title,
  description,
}: {
  /** Número da seção, ex. "02". */
  numero?: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="campo-petroleo border-b border-chumbo-linha pt-14 pb-12 md:pt-20 md:pb-16">
      <div className="container-page">
        <p className="flex items-center gap-3 font-display text-xs font-medium uppercase tracking-etiqueta">
          {numero && <span className="tabular text-menta">{numero}</span>}
          <span className="text-menta-200">{eyebrow}</span>
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-title font-semibold text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-bodyLg text-menta-100/90 text-pretty">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
