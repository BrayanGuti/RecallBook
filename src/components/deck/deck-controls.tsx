"use client";

import { useDeckStore } from "@/stores/deck-store";
import { Button } from "@/components/ui/button";

export function DeckControls() {
  const { currentIndex, deck, isCompleted, nextCard, prevCard } =
    useDeckStore();
  const isFirstCard = currentIndex === 0;

  if (isCompleted) return null;

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mt-6 px-4 gap-4">
      <Button
        variant="outline"
        onClick={prevCard}
        disabled={isFirstCard}
        className="w-1/2 py-6 text-base font-semibold min-h-[48px]"
      >
        ← Anterior
      </Button>

      <Button
        onClick={nextCard}
        className="w-1/2 py-6 text-base font-semibold min-h-[48px]"
      >
        {currentIndex === deck.cards.length - 1 ? "Finalizar" : "Siguiente →"}
      </Button>
    </div>
  );
}
