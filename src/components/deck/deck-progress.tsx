"use client";

import { useDeckStore } from "@/stores/deck-store";

export function DeckProgress() {
  const { currentIndex, deck, isCompleted } = useDeckStore();
  const totalCards = deck.cards.length;

  // Calcular porcentaje de progreso
  const currentStep = isCompleted ? totalCards : currentIndex + 1;
  const progressPercentage = Math.round((currentStep / totalCards) * 100);

  return (
    <div className="w-full max-w-md mx-auto mb-6 px-4">
      <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-2">
        <span>
          {isCompleted
            ? "Mazo completado"
            : `Tarjeta ${currentIndex + 1} de ${totalCards}`}
        </span>
        <span>{progressPercentage}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
