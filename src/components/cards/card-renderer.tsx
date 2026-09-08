"use client";

import { Card } from "@/types/deck";
import { CardTypeB } from "./card-type-b";
import { CardTypeA } from "./card-type-a/card-type-a";

interface CardRendererProps {
  card: Card;
  onCanAdvanceChange: (canAdvance: boolean) => void;
}

export function CardRenderer({ card, onCanAdvanceChange }: CardRendererProps) {
  switch (card.type) {
    case "A":
      return <CardTypeA card={card} onCanAdvanceChange={onCanAdvanceChange} />;
    case "B":
      return <CardTypeB card={card} onCanAdvanceChange={onCanAdvanceChange} />;
    default:
      // No debería pasar con datos válidos; lo dejamos explícito para
      // detectar en desarrollo un tipo de tarjeta no soportado todavía.
      return null;
  }
}
