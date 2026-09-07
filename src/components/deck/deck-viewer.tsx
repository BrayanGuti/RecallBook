"use client";

import { useEffect, useRef, useState, TouchEvent } from "react";
import { useDeckStore } from "@/stores/deck-store";

const SWIPE_THRESHOLD = 100; // px para confirmar el swipe
const FLY_OUT_DURATION = 300; // ms — debe coincidir con la duración del transition-transform

export function DeckViewer() {
  const { deck, currentIndex, isCompleted, nextCard, prevCard } =
    useDeckStore();

  const currentCard = deck.cards[currentIndex];
  const isFirstCard = currentIndex === 0;

  // Desplazamiento horizontal actual de la tarjeta (ya sea por drag o por animación)
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // true mientras la tarjeta vuela fuera de pantalla tras confirmarse el swipe
  const [isSettling, setIsSettling] = useState(false);
  // true por un frame al reposicionar la siguiente tarjeta, para que no "viaje" desde afuera
  const [suppressTransition, setSuppressTransition] = useState(false);

  const startXRef = useRef<number | null>(null);
  const containerWidthRef = useRef(320);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!suppressTransition) return;
    const id = requestAnimationFrame(() => setSuppressTransition(false));
    return () => cancelAnimationFrame(id);
  }, [suppressTransition]);

  const onTouchStart = (e: TouchEvent) => {
    if (isSettling) return; // no iniciar un nuevo drag mientras la anterior tarjeta sigue animando
    startXRef.current = e.targetTouches[0].clientX;
    containerWidthRef.current = cardRef.current?.offsetWidth ?? 320;
    setIsDragging(true);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (startXRef.current === null) return;
    const currentX = e.targetTouches[0].clientX;
    let delta = currentX - startXRef.current;

    // En la primera tarjeta no hay "Anterior": agregamos resistencia al arrastre
    // hacia la derecha en vez de bloquearlo por completo (se siente más natural).
    if (isFirstCard && delta > 0) {
      delta = delta / 3;
    }

    setDragX(delta);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    const finalDelta = dragX;
    startXRef.current = null;

    const goNext = finalDelta <= -SWIPE_THRESHOLD;
    const goPrev = finalDelta >= SWIPE_THRESHOLD && !isFirstCard;

    if (goNext || goPrev) {
      // Umbral superado: la tarjeta continúa suavemente fuera de la pantalla
      setIsSettling(true);
      const exitX = (goNext ? -1 : 1) * (containerWidthRef.current * 1.5 + 100);
      setDragX(exitX);

      window.setTimeout(() => {
        if (goNext) {
          nextCard();
        } else {
          prevCard();
        }
        // Reposicionamos sin transición antes de mostrar la siguiente tarjeta
        setSuppressTransition(true);
        setDragX(0);
        setIsSettling(false);
      }, FLY_OUT_DURATION);
    } else {
      // No se superó el umbral: vuelve suavemente a su posición original
      setDragX(0);
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

  const rotation = dragX / 18; // grados — leve, como una tarjeta física
  const useTransition = !isDragging && !suppressTransition;

  return (
    <div
      ref={cardRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-md mx-auto select-none"
      // touch-action: none evita que el navegador intente hacer scroll/pan nativo
      // con este gesto, sin necesidad de preventDefault() en eventos táctiles pasivos de React.
      style={{ touchAction: "none" }}
    >
      <div
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 min-h-[320px] flex flex-col justify-between will-change-transform"
        style={{
          transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
          transition: useTransition
            ? "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)"
            : "none",
        }}
      >
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
          Desliza horizontalmente para navegar
        </div>
      </div>
    </div>
  );
}
