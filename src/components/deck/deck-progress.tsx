"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeckStore } from "@/stores/deck-store";

export function DeckProgress() {
  const router = useRouter();
  const { currentIndex, deck, isCompleted } = useDeckStore();

  const totalCards = deck.cards.length;

  const currentStep = isCompleted ? totalCards : currentIndex + 1;

  const progressPercentage =
    totalCards > 0 ? Math.round((currentStep / totalCards) * 100) : 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 md:px-6 md:pt-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Volver"
            className="shrink-0 text-[#a9a9a9] transition-colors hover:text-[#8f8f8f]"
          >
            <ArrowLeft size={42} strokeWidth={2.5} />
          </button>

          {/* Progress bar */}
          <div className="relative flex-1 h-8 overflow-hidden rounded-full bg-[#e5e5e5]">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#f98e47] transition-all duration-300 ease-out"
              style={{
                width: `${progressPercentage}%`,
              }}
            >
              {/* Highlight */}
              <div className="absolute left-2 right-2 top-[6px] h-[4px] rounded-full bg-[#ffb17d]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
