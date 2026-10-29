/**
 * Símbolo dos Hackudinhos — manual de identidade, seção 03.
 *
 * "Um hexágono de linha fina cortado ao meio por um eixo vertical — o antes e
 * o depois do treinamento. No centro do eixo, um hexágono sólido em menta: o
 * registro. É a única forma sólida e o único preenchimento em menta da marca
 * inteira."
 *
 * Restrições que o manual chama de NÃO FAÇA e que este componente respeita:
 *  - vértices vivos, nunca arredondados (o ângulo é metade da marca);
 *  - o índice central é sempre menta, nunca outra cor;
 *  - abaixo de 20px, some o eixo e fica só o hexágono com o índice.
 */
export function Simbolo({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const miudo = size < 20;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
      shapeRendering="geometricPrecision"
    >
      {/* Hexágono externo, linha fina, vértices vivos */}
      <path
        d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />

      {/* Eixo vertical: o antes e o depois. Some nas reduções miúdas. */}
      {!miudo && (
        <>
          <line x1="16" y1="2" x2="16" y2="11.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="16" y1="20.5" x2="16" y2="30" stroke="currentColor" strokeWidth="1.5" />
        </>
      )}

      {/* O índice: única forma sólida, sempre em menta */}
      <path d="M16 11 L20 13.5 L20 18.5 L16 21 L12 18.5 L12 13.5 Z" fill="#3ED6A4" />
    </svg>
  );
}

/**
 * Lockup horizontal: símbolo mais o nome.
 *
 * O entreletramento largo do nome é o tom institucional da marca — o manual
 * proíbe expressamente apertá-lo.
 */
export function Marca({
  size = 26,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Simbolo size={size} className="text-papel" />
      <span className="font-display text-lg font-semibold uppercase tracking-marca text-papel">
        Hackudinhos
      </span>
    </span>
  );
}
