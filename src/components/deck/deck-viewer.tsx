"use client";

import { useEffect, useRef } from "react";
import { useDeckStore } from "@/stores/deck-store";
import { SwipeableCard } from "./swipeable-card";
import { DeckCompletedScreen } from "./deck-completed-screen";
import { CardRenderer } from "../cards/card-renderer";

export function DeckViewer() {
  const {
    deck,
    currentIndex,
    isCompleted,
    canAdvance,
    setCanAdvance,
    nextCard,
    prevCard,
    shuffleDeck,
  } = useDeckStore();

  const hasShuffledRef = useRef(false);

  useEffect(() => {
    if (hasShuffledRef.current) return;
    hasShuffledRef.current = true;
    shuffleDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isCompleted) {
    return <DeckCompletedScreen />;
  }

  const currentCard = deck.cards[currentIndex];
  const isFirstCard = currentIndex === 0;

  return (
    <SwipeableCard
      key={currentIndex}
      onSwipeLeft={nextCard}
      onSwipeRight={prevCard}
      canSwipeLeft={canAdvance}
      canSwipeRight={!isFirstCard}
    >
      <CardRenderer card={currentCard} onCanAdvanceChange={setCanAdvance} />
    </SwipeableCard>
  );
}
