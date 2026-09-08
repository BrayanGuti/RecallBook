import type { CardTypeA as CardTypeAData } from "@/types/deck";

interface CardTypeABackProps {
  card: CardTypeAData;
}

export function CardTypeABack({ card }: CardTypeABackProps) {
  return (
    <div
      className="
        absolute inset-0
        flex flex-col justify-between
        overflow-hidden
        rounded-[28px]
        border border-[#8f8f8f]
        p-6 sm:p-8
        shadow-[0_12px_40px_rgba(90,169,230,0.15)]
      "
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
      }}
    >
      {/* Círculo decorativo de fondo con brillo suave */}

      {/* Contenido */}
      <div className="relative z-10 my-auto flex flex-1 flex-col items-center justify-center">
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
          {card.back.concept}
        </p>

        <div className="my-4 h-px w-12 bg-indigo-200" />

        <p
          className="
            max-w-[32rem]
            text-center
            text-base
            leading-relaxed
            text-slate-600
            sm:text-lg
          "
        >
          {card.back.application}
        </p>
      </div>

      {/* CTA inferior */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="h-px w-12 bg-indigo-100" />

        <div className="flex items-center gap-2 text-sm font-medium text-[#f98e47]">
          <span>Toca para volver a la pregunta</span>
          <span className="inline-flex transition-transform hover:-translate-x-0.5">
            ↶
          </span>
        </div>
      </div>
    </div>
  );
}
