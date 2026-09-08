"use client";

import { useEffect, useState } from "react";
import type { CardTypeA as CardTypeAData } from "@/types/deck";

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

  const handleTransitionEnd = () => setIsAnimating(false);

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
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFlip();
        }
      }}
      className="cursor-pointer"
      style={{ perspective: "1200px" }}
    >
      {/* Contenedor externo: Estáticamente plano en reposo frontal para garantizar nitidez absoluta */}
      <div
        className="relative w-full min-h-[320px]"
        style={{
          transformStyle: "flat",
        }}
      >
        {/* Contenedor interno de animación: Solo rota y activa 3D durante el giro o cuando está en el reverso */}
        <div
          className="relative w-full min-h-[320px] transition-transform duration-500 ease-out"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            willChange: isAnimating ? "transform" : "auto",
          }}
        >
          {/* Frente */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col justify-between"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              // Se oculta por completo en el reverso para evitar interferencias visuales
              visibility: isFlipped && !isAnimating ? "hidden" : "visible",
            }}
          >
            <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
              Tarjeta Tipo A — Principio
            </div>

            <div className="my-auto py-4">
              <p className="text-lg font-medium text-gray-900 leading-relaxed text-center">
                {card.front}
              </p>
            </div>

            <div className="text-center text-xs text-gray-400">
              {hasSeenBack
                ? "Toca para ver de nuevo la enseñanza"
                : "Toca la tarjeta para revelar la enseñanza"}
            </div>
          </div>

          {/* Reverso */}
          <div
            className="absolute inset-0 bg-indigo-50 rounded-2xl shadow-md border border-indigo-200 p-6 flex flex-col justify-between"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              // Se oculta por completo en el frente para evitar interferencias visuales
              visibility: !isFlipped && !isAnimating ? "hidden" : "visible",
            }}
          >
            <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
              Enseñanza
            </div>

            <div className="my-auto py-4 space-y-3">
              <p className="text-lg font-bold text-gray-900 leading-snug text-center">
                {card.back.concept}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed text-center">
                {card.back.application}
              </p>
            </div>

            <div className="text-center text-xs text-gray-400">
              Toca para volver a la pregunta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
