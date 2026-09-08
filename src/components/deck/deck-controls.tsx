"use client";

import { useDeckStore } from "@/stores/deck-store";
import { Button } from "@/components/ui/button";

export function DeckControls() {
  const { currentIndex, deck, isCompleted, canAdvance, requestExit } =
    useDeckStore();

  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === deck.cards.length - 1;

  if (isCompleted) return null;

  const buttonFontSize = "calc(var(--controls-btn-h) * 0.2857)";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 w-full px-4"
      style={{ paddingBottom: "var(--controls-pb)" }}
    >
      <div
        className="mx-auto flex w-full max-w-md items-center"
        style={{ gap: "calc(var(--controls-btn-h) * 0.214)" }}
      >
        {/* Anterior */}
        <div className="w-1/2">
          {!isFirstCard && (
            <Button
              variant="outline"
              onClick={() => requestExit("right")}
              className="
                w-full
                rounded-2xl
                border-2
                border-slate-300
                bg-slate-100
                px-4
                font-bold
                text-slate-600
                shadow-[0_4px_0_0_rgb(148,163,184)]
                transition-all
                duration-100
                hover:bg-slate-200
                hover:text-slate-700
                active:translate-y-[3px]
                active:shadow-[0_1px_0_0_rgb(148,163,184)]
              "
              style={{
                height: "var(--controls-btn-h)",
                fontSize: buttonFontSize,
              }}
            >
              <span
                className="mr-1 leading-none"
                style={{ fontSize: "1.125em" }}
              >
                ←
              </span>
              Anterior
            </Button>
          )}
        </div>

        {/* Siguiente / Finalizar */}
        <div className="w-1/2">
          <Button
            onClick={() => requestExit("left")}
            disabled={!canAdvance}
            className={`
              w-full
              rounded-2xl
              border-2
              px-5
              font-bold
              transition-all
              duration-100
              ${
                canAdvance
                  ? `
                    border-emerald-700
                    bg-emerald-500
                    text-white
                    shadow-[0_4px_0_0_rgb(4,120,87)]
                    hover:bg-emerald-500
                    hover:brightness-105
                    active:translate-y-[3px]
                    active:shadow-[0_1px_0_0_rgb(4,120,87)]
                  `
                  : `
                    cursor-not-allowed
                    border-slate-300
                    bg-slate-200
                    text-slate-400
                    opacity-100
                    shadow-[0_4px_0_0_rgb(203,213,225)]
                  `
              }
            `}
            style={{
              height: "var(--controls-btn-h)",
              fontSize: buttonFontSize,
            }}
          >
            {isLastCard ? "Finalizar" : "Siguiente"}

            {!isLastCard && (
              <span
                className="ml-1 leading-none"
                style={{ fontSize: "1.125em" }}
              >
                →
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
