import { create } from "zustand";
import { Deck } from "@/types/deck";
import { atomicHabitsDeck } from "@/data/atomic-habits";

interface DeckState {
  deck: Deck;
  currentIndex: number;
  isCompleted: boolean;
  canAdvance: boolean;

  // Acciones
  nextCard: () => void;
  prevCard: () => void;
  resetDeck: () => void;
  setCanAdvance: (canAdvance: boolean) => void;
}

export const useDeckStore = create<DeckState>((set, get) => ({
  deck: atomicHabitsDeck,
  currentIndex: 0,
  isCompleted: false,
  canAdvance: true,

  nextCard: () => {
    const { currentIndex, deck, canAdvance } = get();

    // Único punto de verdad para el gate: tanto el botón "Siguiente"
    // como el swipe hacia la izquierda pasan por acá.
    if (!canAdvance) return;

    if (currentIndex < deck.cards.length - 1) {
      // La tarjeta siguiente todavía no montó su componente para decirnos
      // si permite avanzar, así que reseteamos a `true` (comportamiento
      // por defecto sin restricciones) hasta que ese componente diga lo contrario.
      set({ currentIndex: currentIndex + 1, canAdvance: true });
    } else {
      set({ isCompleted: true });
    }
  },

  prevCard: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      // Retroceder siempre está permitido, sin importar canAdvance.
      set({
        currentIndex: currentIndex - 1,
        isCompleted: false,
        canAdvance: true,
      });
    }
  },

  resetDeck: () =>
    set({ currentIndex: 0, isCompleted: false, canAdvance: true }),

  setCanAdvance: (canAdvance) => set({ canAdvance }),
}));
