"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { CardTypeB as CardTypeBData, CardOption } from "@/types/deck";

interface CardTypeBProps {
  card: CardTypeBData;
  onCanAdvanceChange: (canAdvance: boolean) => void;
}

type OptionVisualState =
  | "idle"
  | "correct-selected"
  | "incorrect-selected"
  | "correct-unselected"
  | "faded";

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
  idle: `
    border-[#d4d4d4]
    bg-white
    text-slate-900
    shadow-[0_3px_0_0_#d4d4d4]
    hover:border-[#b8b8b8]
    hover:bg-white
    active:translate-y-[2px]
    active:shadow-[0_1px_0_0_#d4d4d4]
  `,

  "correct-selected": `
    border-emerald-500
    bg-emerald-50
    text-emerald-900
    shadow-[0_3px_0_0_#10b981]
    animate-answer-pulse
  `,

  "incorrect-selected": `
    border-rose-500
    bg-rose-50
    text-rose-900
    shadow-[0_3px_0_0_#f43f5e]
  `,

  "correct-unselected": `
    border-emerald-500
    bg-emerald-50
    text-emerald-900
    shadow-[0_3px_0_0_#10b981]
  `,

  faded: `
    border-slate-200
    bg-slate-50
    text-slate-400
    opacity-50
    shadow-none
  `,
};

export function CardTypeB({ card, onCanAdvanceChange }: CardTypeBProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const hasAnswered = selectedOptionId !== null;

  const selectedOption = card.options.find(
    (option) => option.id === selectedOptionId,
  );

  const wasCorrect = selectedOption?.isCorrect ?? false;

  useEffect(() => {
    onCanAdvanceChange(hasAnswered);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAnswered]);

  const handleSelect = (option: CardOption) => {
    if (hasAnswered) return;

    setSelectedOptionId(option.id);
  };

  return (
    <div
      className="
        relative
        flex
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
        rounded-[28px]
        border
        border-[#8f8f8f]
        bg-[#f9f9f9]
        p-6
        shadow-[0_12px_40px_rgba(90,169,230,0.10)]
        sm:p-8
      "
    >
      {/* Decoración superior */}
      <div className="flex shrink-0 items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-8 rounded-full bg-[#f98e47]" />
          <span className="h-1.5 w-2 rounded-full bg-[#f7aa77]" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Pregunta */}
        <div className="shrink-0 pb-6 pt-7">
          <p
            className="
              max-w-[30rem]
              text-xl
              font-semibold
              leading-[1.2]
              tracking-[-0.02em]
              text-slate-900
              sm:text-2xl
            "
          >
            {card.question}
          </p>
        </div>

        {/* Opciones */}
        <div className="flex flex-col gap-3">
          {card.options.map((option, index) => {
            const state = getOptionState(option, selectedOptionId);

            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={hasAnswered}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                  flex
                  min-h-[58px]
                  w-full
                  shrink-0
                  items-center
                  rounded-2xl
                  border-2
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-medium
                  leading-snug
                  transition-all
                  duration-100
                  ${OPTION_STYLES[state]}
                  ${hasAnswered ? "cursor-default" : "cursor-pointer"}
                `}
              >
                <span className="flex-1">{option.text}</span>

                {/* Correcta */}
                {hasAnswered &&
                  (state === "correct-selected" ||
                    state === "correct-unselected") && (
                    <span
                      className="
                        ml-3
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-emerald-500
                        text-sm
                        font-bold
                        text-white
                      "
                    >
                      ✓
                    </span>
                  )}

                {/* Incorrecta */}
                {hasAnswered && state === "incorrect-selected" && (
                  <span
                    className="
                        ml-3
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-rose-500
                        text-sm
                        font-bold
                        text-white
                      "
                  >
                    ×
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Área reservada para feedback */}
        <div className="relative mt-auto min-h-[132px] pt-5">
          <AnimatePresence mode="wait">
            {!hasAnswered ? (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="
                  flex
                  h-full
                  flex-col
                  items-center
                  justify-end
                  gap-3
                "
              >
                <div className="h-px w-12 bg-sky-100" />

                <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                  <span>Selecciona una opción para continuar</span>
                  <span>→</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="feedback"
                initial={{
                  opacity: 0,
                  y: 70,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 30,
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                  absolute
                  inset-x-0
                  bottom-0
                  rounded-2xl
                  border-2
                  px-4
                  py-4
                  ${
                    wasCorrect
                      ? `
                        border-emerald-300
                        bg-emerald-100
                      `
                      : `
                        border-rose-300
                        bg-rose-100
                      `
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Icono */}
                  <div
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-base
                      font-bold
                      text-white
                      ${wasCorrect ? "bg-emerald-500" : "bg-rose-500"}
                    `}
                  >
                    {wasCorrect ? "✓" : "×"}
                  </div>

                  {/* Texto */}
                  <div className="min-w-0">
                    <p
                      className={`
                        mb-1
                        text-base
                        font-semibold
                        ${wasCorrect ? "text-emerald-800" : "text-rose-800"}
                      `}
                    >
                      {wasCorrect ? "¡Correcto!" : "No exactamente"}
                    </p>

                    <p className="text-sm font-medium leading-relaxed text-slate-600">
                      {card.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
