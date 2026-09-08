import { create } from "zustand";
import { Deck, Card } from "@/types/deck";
import { atomicHabitsDeck } from "@/data/atomic-habits";

export type SwipeDirection = "left" | "right";

function shuffleCards(cards: Card[]): Card[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createShuffledDeck(sourceDeck: Deck): Deck {
  return {
    ...sourceDeck,
    cards: shuffleCards(sourceDeck.cards),
  };
}

interface DeckState {
  deck: Deck;
  currentIndex: number;
  isCompleted: boolean;
  canAdvance: boolean;

  pendingExit: SwipeDirection | null;

  // Acciones
  nextCard: () => void;
  prevCard: () => void;
  resetDeck: () => void;
  setCanAdvance: (canAdvance: boolean) => void;
  requestExit: (direction: SwipeDirection) => void;
  clearPendingExit: () => void;
  shuffleDeck: () => void;
}

export const useDeckStore = create<DeckState>((set, get) => ({
  deck: atomicHabitsDeck,
  currentIndex: 0,
  isCompleted: false,
  canAdvance: false,
  pendingExit: null,

  nextCard: () => {
    const { currentIndex, deck, canAdvance } = get();

    if (!canAdvance) return;

    if (currentIndex < deck.cards.length - 1) {
      set({ currentIndex: currentIndex + 1, canAdvance: true });
    } else {
      set({ isCompleted: true });
    }
  },

  prevCard: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        isCompleted: false,
        canAdvance: true,
      });
    }
  },

  resetDeck: () =>
    set((state) => ({
      deck: createShuffledDeck(state.deck),
      currentIndex: 0,
      isCompleted: false,
      canAdvance: true,
      pendingExit: null,
    })),

  setCanAdvance: (canAdvance) => set({ canAdvance }),

  requestExit: (direction) => {
    const { currentIndex, canAdvance, isCompleted } = get();
    if (isCompleted) return;
    if (direction === "left" && !canAdvance) return;
    if (direction === "right" && currentIndex === 0) return;
    set({ pendingExit: direction });
  },

  clearPendingExit: () => set({ pendingExit: null }),

  shuffleDeck: () =>
    set((state) => ({
      deck: createShuffledDeck(state.deck),
    })),
}));
