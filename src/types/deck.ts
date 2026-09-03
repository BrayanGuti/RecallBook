export interface CardTypeA {
  id: number;
  type: "A";
  pattern:
    | "mito_derribado"
    | "reto_creencia"
    | "dato_contraintuitivo"
    | "espejo_directo";
  front: string;
  back: {
    concept: string;
    application: string;
  };
}

/**
 * Opción de respuesta para Tarjetas Tipo B
 */
export interface CardOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

/**
 * Tarjeta Tipo  Selección Múltiple
 */
export interface CardTypeB {
  id: number;
  type: "B";
  question: string;
  options:
    | [CardOption, CardOption, CardOption]
    | [CardOption, CardOption, CardOption, CardOption]; // 3 a 4 opciones
  explanation: string;
}

/**
 * Tipo Discriminado Unión para cualquier tarjeta dentro del mazo
 */
export type Card = CardTypeA | CardTypeB;

/**
 * Estructura general de un Mazo en RecallBook
 */
export interface Deck {
  id: string;
  title: string;
  bookTitle: string;
  author: string;
  cards: Card[];
}
