"use client";

import { useDeckStore } from "@/stores/deck-store";
import { Button } from "@/components/ui/button";

export function DeckControls() {
  const { currentIndex, deck, isCompleted, canAdvance, requestExit } =
    useDeckStore();

  const isFirstCard = currentIndex === 0;

  if (isCompleted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full px-4 pb-6">
      <div className="flex w-full max-w-md mx-auto items-center gap-4">
        <Button
          variant="outline"
          onClick={() => requestExit("right")}
          disabled={isFirstCard}
          className="w-1/2 min-h-[48px] py-6 text-base font-semibold"
        >
          ← Anterior
        </Button>

        <Button
          onClick={() => requestExit("left")}
          disabled={!canAdvance}
          className="w-1/2 min-h-[48px] py-6 text-base font-semibold"
        >
          {currentIndex === deck.cards.length - 1 ? "Finalizar" : "Siguiente →"}
        </Button>
      </div>
    </div>
  );
}
