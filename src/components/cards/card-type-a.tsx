"use client";

import { useEffect } from "react";
import type { CardTypeA } from "@/types/deck";

interface CardTypeAProps {
  card: CardTypeA;
  onCanAdvanceChange: (canAdvance: boolean) => void;
}

export function CardTypeA({ card, onCanAdvanceChange }: CardTypeAProps) {
  // CP-B1: sin restricciones todavía.
  // CP-B2 reemplaza este efecto por: useState(false) para "enseñanza vista",
  // se llama onCanAdvanceChange(true) recién en el primer flip, y el flip
  // en sí vive acá adentro (no en DeckViewer ni SwipeableCard).
  useEffect(() => {
    onCanAdvanceChange(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 min-h-[320px] flex flex-col justify-between">
      <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
        Tarjeta Tipo A — Principio
      </div>

      <div className="my-auto py-4">
        <p className="text-lg font-medium text-gray-900 leading-relaxed text-center">
          {card.front}
        </p>
      </div>

      <div className="text-center text-xs text-gray-400">
        Desliza horizontalmente para navegar
      </div>
    </div>
  );
}
