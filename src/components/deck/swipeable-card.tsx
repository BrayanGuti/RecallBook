"use client";

import { useEffect, useRef, useState, PointerEvent, ReactNode } from "react";
import { useDeckStore, SwipeDirection } from "@/stores/deck-store";

const SWIPE_THRESHOLD = 100;
const DRAG_CLICK_SUPPRESS_THRESHOLD = 10;

// Salida disparada por el gesto de swipe con el dedo: rápida, con
// "overshoot" hacia afuera de la pantalla (simula inercia del drag).
const DRAG_FLY_OUT_DURATION = 300;
const DRAG_FLY_OUT_DISTANCE_MULTIPLIER = 1.5;
const DRAG_FLY_OUT_DISTANCE_EXTRA = 100;
const DRAG_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

// Salida disparada por un trigger externo (botones Siguiente/Anterior):
// no hay gesto físico detrás, así que se siente mejor más lenta, suave,
// y sin necesidad de viajar tan lejos —solo lo justo para salir del marco.
const EXTERNAL_FLY_OUT_DURATION = 450;
const EXTERNAL_FLY_OUT_DISTANCE_MULTIPLIER = 1.05;
const EXTERNAL_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  canSwipeLeft?: boolean;
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
  const [isReturning, setIsReturning] = useState(false);

  const [transitionMs, setTransitionMs] = useState(DRAG_FLY_OUT_DURATION);
  const [transitionEasing, setTransitionEasing] = useState(DRAG_EASING);

  const startXRef = useRef<number | null>(null);
  const containerWidthRef = useRef(320);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const wasDraggedRef = useRef(false);

  const canSwipeLeftRef = useRef(canSwipeLeft);
  const canSwipeRightRef = useRef(canSwipeRight);
  const isSettlingRef = useRef(isSettling);
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);

  useEffect(() => {
    canSwipeLeftRef.current = canSwipeLeft;
    canSwipeRightRef.current = canSwipeRight;
    isSettlingRef.current = isSettling;
    onSwipeLeftRef.current = onSwipeLeft;
    onSwipeRightRef.current = onSwipeRight;
  });

  useEffect(() => {
    containerWidthRef.current = cardRef.current?.offsetWidth ?? 320;
  }, []);

  const triggerExit = (
    direction: SwipeDirection,
    source: "drag" | "external" = "drag",
  ) => {
    if (isSettlingRef.current) return;
    if (direction === "left" && !canSwipeLeftRef.current) return;
    if (direction === "right" && !canSwipeRightRef.current) return;

    const isExternal = source === "external";
    const duration = isExternal
      ? EXTERNAL_FLY_OUT_DURATION
      : DRAG_FLY_OUT_DURATION;
    const easing = isExternal ? EXTERNAL_EASING : DRAG_EASING;
    const distanceMultiplier = isExternal
      ? EXTERNAL_FLY_OUT_DISTANCE_MULTIPLIER
      : DRAG_FLY_OUT_DISTANCE_MULTIPLIER;
    const distanceExtra = isExternal ? 0 : DRAG_FLY_OUT_DISTANCE_EXTRA;

    setTransitionMs(duration);
    setTransitionEasing(easing);

    setIsDragging(false);
    startXRef.current = null;
    setIsSettling(true);

    const exitX =
      (direction === "left" ? -1 : 1) *
      (containerWidthRef.current * distanceMultiplier + distanceExtra);
    setDragX(exitX);

    window.setTimeout(() => {
      if (direction === "left") {
        onSwipeLeftRef.current();
      } else {
        onSwipeRightRef.current();
      }
    }, duration);
  };

  useEffect(() => {
    const unsubscribe = useDeckStore.subscribe((state, prevState) => {
      if (state.pendingExit && state.pendingExit !== prevState.pendingExit) {
        useDeckStore.getState().clearPendingExit();
        triggerExit(state.pendingExit, "external");
      }
    });
    return unsubscribe;
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (isSettling) return;
    startXRef.current = e.clientX;
    containerWidthRef.current = cardRef.current?.offsetWidth ?? 320;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || startXRef.current === null) return;
    const currentX = e.clientX;
    let delta = currentX - startXRef.current;

    if (delta < 0 && !canSwipeLeft) delta = delta / 3;
    if (delta > 0 && !canSwipeRight) delta = delta / 3;

    setDragX(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const finalDelta = dragX;
    startXRef.current = null;

    wasDraggedRef.current =
      Math.abs(finalDelta) > DRAG_CLICK_SUPPRESS_THRESHOLD;

    const goLeft = finalDelta <= -SWIPE_THRESHOLD && canSwipeLeft;
    const goRight = finalDelta >= SWIPE_THRESHOLD && canSwipeRight;

    if (goLeft || goRight) {
      triggerExit(goLeft ? "left" : "right", "drag");
    } else if (Math.abs(finalDelta) > 0) {
      setTransitionMs(DRAG_FLY_OUT_DURATION);
      setTransitionEasing(DRAG_EASING);
      setIsReturning(true);
      setDragX(0);
    } else {
      setDragX(0);
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (wasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      wasDraggedRef.current = false;
    }
  };

  const handleTransitionEnd = () => {
    if (isReturning) setIsReturning(false);
  };

  const rotation = dragX / 18;
  const hasMoved = dragX !== 0 || rotation !== 0;
  const isActive = (isDragging || isSettling || isReturning) && hasMoved;
  const useTransition = !isDragging;

  return (
    <div
      ref={cardRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
      onClickCapture={onClickCapture}
      className="w-full max-w-md mx-auto h-full min-h-0 select-none"
      style={{ touchAction: "none" }}
    >
      <div
        onTransitionEnd={handleTransitionEnd}
        className="h-full min-h-0"
        style={
          isActive
            ? {
                transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
                willChange: "transform",
                transition: useTransition
                  ? `transform ${transitionMs}ms ${transitionEasing}`
                  : "none",
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
