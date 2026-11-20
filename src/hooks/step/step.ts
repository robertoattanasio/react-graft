import { useCallback, useId, useState } from "react";

import type { GraftStep, UseGraftStepOptions } from "./type.js";

export const useGraftStep = ({
  defaultValue = 0,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
}: UseGraftStepOptions = {}): GraftStep => {
  const id = useId();
  const [state, setState] = useState(() => ({ step: defaultValue, history: [defaultValue] as readonly number[] }));

  const move = useCallback(
    (next: (step: number) => number) =>
      setState((previous) => {
        const step = Math.min(Math.max(next(previous.step), min), max);
        if (step === previous.step) return previous;

        return { step, history: [...previous.history, step] };
      }),
    [min, max],
  );

  const setStep = useCallback((step: number) => move(() => step), [move]);
  const onBack = useCallback(() => move((step) => step - 1), [move]);
  const onNext = useCallback(() => move((step) => step + 1), [move]);

  return { id, step: state.step, min, max, history: state.history, setStep, onBack, onNext };
};
