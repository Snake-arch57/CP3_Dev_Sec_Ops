import { cn } from "@/lib/utils";

interface BookProps {
  children?: React.ReactNode;
  color?: string;
  depth?: number;
  width?: number;
  className?: string;
  hoverTilt?: boolean;
}

// Livro 3D em CSS puro: capa + "miolo de páginas" na lateral (profundidade) + contracapa,
// todos posicionados com transform-style:preserve-3d. Sem textura/madeira, só cor sólida.
export function Book({ children, color = "var(--color-primary)", depth = 8, width = 64, className, hoverTilt = true }: BookProps) {
  return (
    <div
      className={cn("inline-block [perspective:700px]", className)}
      style={{ "--book-color": color, "--book-depth": `${depth}px`, "--book-width": `${width}px` } as React.CSSProperties}
    >
      <div
        className={cn(
          "relative aspect-[49/60] [transform-style:preserve-3d] transition-transform duration-300 ease-out",
          hoverTilt && "group-hover:[transform:rotateY(-18deg)_scale(1.06)]",
        )}
        style={{ width: "var(--book-width)" }}
      >
        {/* capa da frente */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-l-[3px] rounded-r-md border border-black/20 shadow-lg shadow-black/30"
          style={{ background: "var(--book-color)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-[14%]"
            style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.35), transparent)" }}
          />
          <div className="relative z-10 flex h-full w-full items-center justify-center p-2">{children}</div>
        </div>

        {/* miolo de páginas (face lateral, dá a profundidade) */}
        <div
          aria-hidden
          className="absolute top-[2px] h-[calc(100%-4px)] rounded-sm"
          style={{
            width: "var(--book-depth)",
            background: "var(--color-surface)",
            transform:
              "translateX(calc(var(--book-width) - var(--book-depth) / 2 - 2px)) rotateY(90deg) translateX(calc(var(--book-depth) / 2))",
          }}
        />

        {/* contracapa */}
        <div
          aria-hidden
          className="absolute left-0 top-0 h-full w-full rounded-l-[3px] rounded-r-md"
          style={{ background: "var(--book-color)", transform: "translateZ(calc(-1 * var(--book-depth)))" }}
        />
      </div>
    </div>
  );
}
