import { create } from "zustand";
import { Deck } from "@/types/deck";
import { atomicHabitsDeck } from "@/data/atomic-habits";

interface DeckState {
  deck: Deck;
  currentIndex: number;
  isCompleted: boolean;

  // Acciones
  nextCard: () => void;
  prevCard: () => void;
  resetDeck: () => void;
}

export const useDeckStore = create<DeckState>((set, get) => ({
  deck: atomicHabitsDeck,
  currentIndex: 0,
  isCompleted: false,

  nextCard: () => {
    const { currentIndex, deck } = get();
    if (currentIndex < deck.cards.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      set({ isCompleted: true });
    }
  },

  prevCard: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, isCompleted: false });
    }
  },

  resetDeck: () => set({ currentIndex: 0, isCompleted: false }),
}));
