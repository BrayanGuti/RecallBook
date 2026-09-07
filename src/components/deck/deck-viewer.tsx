"use client";

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
  } = useDeckStore();

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
