import type { CardTypeA as CardTypeAData } from "@/types/deck";

interface CardTypeAFrontProps {
  card: CardTypeAData;
  hasSeenBack: boolean;
}

export function CardTypeAFront({ card, hasSeenBack }: CardTypeAFrontProps) {
  return (
    <div
      className="
        absolute inset-0
        flex flex-col justify-between
        overflow-hidden
        rounded-[28px]
        border border-[#8f8f8f]
        bg-[#f9f9f9]
        p-6 sm:p-8
        shadow-[0_12px_40px_rgba(90,169,230,0.10)]
      "
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {/* Decoración superior */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-8 rounded-full bg-[#f98e47]" />
          <span className="h-1.5 w-2 rounded-full bg-[#f7aa77]" />
        </div>
      </div>

      {/* Pregunta */}
      <div className="my-auto flex flex-1 items-center justify-center py-8">
        <p
          className="
            max-w-[34rem]
            text-center
            text-2xl
            font-semibold
            leading-[1.15]
            tracking-[-0.025em]
            text-slate-900
            sm:text-3xl
          "
        >
          {card.front}
        </p>
      </div>

      {/* CTA inferior */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-px w-12 bg-sky-100" />

        <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <span>
            {hasSeenBack ? "Toca para ver de nuevo" : "Toca para descubrirlo"}
          </span>

          <span className="inline-flex transition-transform duration-300">
            →
          </span>
        </div>
      </div>
    </div>
  );
}
