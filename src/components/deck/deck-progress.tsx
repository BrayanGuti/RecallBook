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
    <div
      className="fixed top-0 left-0 right-0 z-50 w-full px-4 md:px-6"
      style={{ paddingTop: "var(--progress-pt)" }}
    >
      <div className="w-full max-w-2xl mx-auto">
        <div
          className="flex items-center"
          style={{ gap: "calc(var(--progress-bar-h) * 0.375)" }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Volver"
            className="shrink-0 text-[#a9a9a9] transition-colors hover:text-[#8f8f8f]"
            style={{
              width: "calc(var(--progress-bar-h) * 1.3125)",
              height: "calc(var(--progress-bar-h) * 1.3125)",
            }}
          >
            <ArrowLeft
              size="100%"
              strokeWidth={2.5}
              className="w-full h-full"
            />
          </button>

          {/* Progress bar */}
          <div
            className="relative flex-1 overflow-hidden rounded-full bg-[#e5e5e5]"
            style={{ height: "var(--progress-bar-h)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#f98e47] transition-all duration-300 ease-out"
              style={{
                width: `${progressPercentage}%`,
              }}
            >
              <div
                className="absolute rounded-full bg-[#ffb17d]"
                style={{
                  left: "calc(var(--progress-bar-h) * 0.25)",
                  right: "calc(var(--progress-bar-h) * 0.25)",
                  top: "calc(var(--progress-bar-h) * 0.19)",
                  height: "calc(var(--progress-bar-h) * 0.125)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
