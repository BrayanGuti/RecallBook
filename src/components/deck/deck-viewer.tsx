"use client";

import { useState, TouchEvent } from "react";
import { useDeckStore } from "@/stores/deck-store";

export function DeckViewer() {
  const { deck, currentIndex, isCompleted, nextCard, prevCard } =
    useDeckStore();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentCard = deck.cards[currentIndex];

  // Distancia mínima en px para considerar un swipe válido
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextCard(); // Swipe hacia la izquierda = Avanzar
    } else if (isRightSwipe) {
      prevCard(); // Swipe hacia la derecha = Retroceder
    }
  };

  if (isCompleted) {
    return (
      <div className="w-full max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-lg border border-gray-100 min-h-[320px] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Has terminado el mazo! 🎉
        </h2>
        <p className="text-gray-600">
          Pantalla de cierre (provisoria para CP-B1).
        </p>
      </div>
    );
  }

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-md mx-auto touch-pan-y select-none"
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 min-h-[320px] flex flex-col justify-between">
        <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
          {currentCard.type === "A"
            ? "Tarjeta Tipo A — Principio"
            : "Tarjeta Tipo B — Aplicación"}
        </div>

        <div className="my-auto py-4">
          {currentCard.type === "A" ? (
            <p className="text-lg font-medium text-gray-900 leading-relaxed text-center">
              {currentCard.front}
            </p>
          ) : (
            <p className="text-base font-medium text-gray-900 leading-relaxed text-center">
              {currentCard.question}
            </p>
          )}
        </div>

        <div className="text-center text-xs text-gray-400">
          Haz swipe horizontal para navegar
        </div>
      </div>
    </div>
  );
}
