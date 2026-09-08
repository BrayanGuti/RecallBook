"use client";

import { useEffect, useState } from "react";

import type { CardTypeA as CardTypeAData } from "@/types/deck";

import { CardTypeAFront } from "./card-type-a-front";
import { CardTypeABack } from "./card-type-a-back";

interface CardTypeAProps {
  card: CardTypeAData;
  onCanAdvanceChange: (canAdvance: boolean) => void;
}

export function CardTypeA({ card, onCanAdvanceChange }: CardTypeAProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasSeenBack, setHasSeenBack] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    onCanAdvanceChange(hasSeenBack);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSeenBack]);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    setHasSeenBack(true);
    setIsAnimating(true);
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);
  };

  return (
    <div
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={
        isFlipped
          ? "Toca para ver la pregunta"
          : "Toca para revelar la enseñanza"
      }
      className="cursor-pointer"
      style={{
        perspective: "1200px",
      }}
    >
      <div
        className="relative min-h-[320px] w-full"
        style={{
          transformStyle: "flat",
        }}
      >
        <div
          className="
            relative
            min-h-[320px]
            w-full
            transition-transform
            duration-500
            ease-out
          "
          onTransitionEnd={handleTransitionEnd}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            willChange: isAnimating ? "transform" : "auto",
          }}
        >
          <CardTypeAFront card={card} hasSeenBack={hasSeenBack} />
          <CardTypeABack card={card} />
        </div>
      </div>
    </div>
  );
}
