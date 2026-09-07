"use client";

import { useState, useRef, TouchEvent, ReactNode } from "react";

const SWIPE_THRESHOLD = 100; // px para confirmar el swipe
const FLY_OUT_DURATION = 300; // ms — debe coincidir con la transición CSS

interface SwipeableCardProps {
  children: ReactNode;
  /** Se llama cuando el usuario confirma un swipe hacia la izquierda (avanzar) */
  onSwipeLeft: () => void;
  /** Se llama cuando el usuario confirma un swipe hacia la derecha (retroceder) */
  onSwipeRight: () => void;
  /** Si es false, el swipe hacia la izquierda queda bloqueado y la tarjeta rebota */
  canSwipeLeft?: boolean;
  /** Si es false, el swipe hacia la derecha queda bloqueado y la tarjeta rebota */
  canSwipeRight?: boolean;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  canSwipeLeft = true,
  canSwipeRight = true,
}: SwipeableCardProps) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  const startXRef = useRef<number | null>(null);
  const containerWidthRef = useRef(320);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    if (isSettling) return;
    startXRef.current = e.targetTouches[0].clientX;
    containerWidthRef.current = cardRef.current?.offsetWidth ?? 320;
    setIsDragging(true);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (startXRef.current === null) return;
    const currentX = e.targetTouches[0].clientX;
    let delta = currentX - startXRef.current;

    // Resistencia si el gesto va hacia un lado bloqueado, en vez de
    // simplemente ignorar el movimiento (se siente más físico/real).
    if (delta < 0 && !canSwipeLeft) delta = delta / 3;
    if (delta > 0 && !canSwipeRight) delta = delta / 3;

    setDragX(delta);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    const finalDelta = dragX;
    startXRef.current = null;

    const goLeft = finalDelta <= -SWIPE_THRESHOLD && canSwipeLeft;
    const goRight = finalDelta >= SWIPE_THRESHOLD && canSwipeRight;

    if (goLeft || goRight) {
      setIsSettling(true);
      const exitX = (goLeft ? -1 : 1) * (containerWidthRef.current * 1.5 + 100);
      setDragX(exitX);

      window.setTimeout(() => {
        if (goLeft) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
        // No hace falta resetear dragX acá: el padre cambia `key` al avanzar
        // de tarjeta, lo que remonta este componente desde cero.
      }, FLY_OUT_DURATION);
    } else {
      // Umbral no superado, o dirección bloqueada: vuelve a su posición original.
      setDragX(0);
    }
  };

  const rotation = dragX / 18;
  const useTransition = !isDragging;

  return (
    <div
      ref={cardRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-md mx-auto select-none"
      style={{ touchAction: "none" }}
    >
      <div
        className="will-change-transform"
        style={{
          transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
          transition: useTransition
            ? "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)"
            : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
