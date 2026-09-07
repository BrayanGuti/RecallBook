"use client";

import { useEffect } from "react";
import type { CardTypeB } from "@/types/deck";

interface CardTypeBProps {
  card: CardTypeB;
  onCanAdvanceChange: (canAdvance: boolean) => void;
}

export function CardTypeB({ card, onCanAdvanceChange }: CardTypeBProps) {
  // CP-B1: sin restricciones todavía.
  // CP-B3 reemplaza este efecto por: useState(false) hasta que el usuario
  // seleccione una opción y se muestre el feedback (posiblemente usando
  // algo de components/feedback/).
  useEffect(() => {
    onCanAdvanceChange(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 min-h-[320px] flex flex-col justify-between">
      <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
        Tarjeta Tipo B — Aplicación
      </div>

      <div className="my-auto py-4">
        <p className="text-base font-medium text-gray-900 leading-relaxed text-center">
          {card.question}
        </p>
      </div>

      <div className="text-center text-xs text-gray-400">
        Desliza horizontalmente para navegar
      </div>
    </div>
  );
}
