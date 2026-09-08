"use client";

import { useEffect, useState } from "react";
import type { CardTypeB as CardTypeBData, CardOption } from "@/types/deck";

interface CardTypeBProps {
  card: CardTypeBData;
  onCanAdvanceChange: (canAdvance: boolean) => void;
}

type OptionVisualState =
  | "idle" // aún no se respondió
  | "correct-selected" // la elegiste y era correcta
  | "incorrect-selected" // la elegiste y era incorrecta
  | "correct-unselected" // no la elegiste, pero era la correcta (se resalta igual)
  | "faded"; // no la elegiste y no era la correcta

function getOptionState(
  option: CardOption,
  selectedOptionId: string | null,
): OptionVisualState {
  if (selectedOptionId === null) return "idle";

  const isSelected = option.id === selectedOptionId;

  if (isSelected && option.isCorrect) return "correct-selected";
  if (isSelected && !option.isCorrect) return "incorrect-selected";
  if (!isSelected && option.isCorrect) return "correct-unselected";
  return "faded";
}

const OPTION_STYLES: Record<OptionVisualState, string> = {
  idle: "bg-white border-gray-200 text-gray-900 hover:border-indigo-300 active:bg-gray-50",
  "correct-selected":
    "bg-emerald-50 border-emerald-300 text-emerald-900 animate-answer-pulse",
  "incorrect-selected": "bg-rose-50 border-rose-300 text-rose-900",
  "correct-unselected": "bg-emerald-50 border-emerald-300 text-emerald-900",
  faded: "bg-white border-gray-100 text-gray-400",
};

export function CardTypeB({ card, onCanAdvanceChange }: CardTypeBProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const hasAnswered = selectedOptionId !== null;
  const selectedOption = card.options.find((o) => o.id === selectedOptionId);
  const wasCorrect = selectedOption?.isCorrect ?? false;

  useEffect(() => {
    onCanAdvanceChange(hasAnswered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAnswered]);

  const handleSelect = (option: CardOption) => {
    // Una vez respondida, la tarjeta queda bloqueada: ningún click posterior
    // sobre otra opción debe cambiar la respuesta.
    if (hasAnswered) return;
    setSelectedOptionId(option.id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 min-h-[320px] flex flex-col gap-4">
      <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
        Tarjeta Tipo B — Aplicación
      </div>

      <p className="text-base font-medium text-gray-900 leading-relaxed">
        {card.question}
      </p>

      <div className="flex flex-col gap-2">
        {card.options.map((option) => {
          const state = getOptionState(option, selectedOptionId);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={hasAnswered}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors duration-200 ${OPTION_STYLES[state]} ${
                hasAnswered ? "cursor-default" : "cursor-pointer"
              }`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div
          className={`mt-1 rounded-xl border p-4 text-sm leading-relaxed ${
            wasCorrect
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          <p className="font-semibold mb-1">
            {wasCorrect ? "¡Correcto!" : "No exactamente"}
          </p>
          <p className="text-gray-700">{card.explanation}</p>
        </div>
      )}

      {!hasAnswered && (
        <div className="text-center text-xs text-gray-400 mt-auto">
          Selecciona una opción para continuar
        </div>
      )}
    </div>
  );
}
