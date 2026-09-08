"use client";

import { useState, useRef, TouchEvent, MouseEvent, ReactNode } from "react";

const SWIPE_THRESHOLD = 100;
const FLY_OUT_DURATION = 300;
const DRAG_CLICK_SUPPRESS_THRESHOLD = 10;

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

  const startXRef = useRef<number | null>(null);
  const containerWidthRef = useRef(320);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const wasDraggedRef = useRef(false);

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

    if (delta < 0 && !canSwipeLeft) delta = delta / 3;
    if (delta > 0 && !canSwipeRight) delta = delta / 3;

    setDragX(delta);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    const finalDelta = dragX;
    startXRef.current = null;

    wasDraggedRef.current =
      Math.abs(finalDelta) > DRAG_CLICK_SUPPRESS_THRESHOLD;

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
      }, FLY_OUT_DURATION);
    } else if (Math.abs(finalDelta) > 0) {
      setIsReturning(true);
      setDragX(0);
    } else {
      setDragX(0);
    }
  };

  const onClickCapture = (e: MouseEvent) => {
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
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClickCapture={onClickCapture}
      className="w-full max-w-md mx-auto select-none"
      style={{ touchAction: "none" }}
    >
      <div
        onTransitionEnd={handleTransitionEnd}
        style={
          isActive
            ? {
                transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
                willChange: "transform",
                transition: useTransition
                  ? "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)"
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
