import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { GraftStep, UseGraftStepOptions } from "./type.js";

export const useGraftStep = ({
  defaultValue = 0,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
}: UseGraftStepOptions = {}): GraftStep => {
  const id = useId();
  const [step, setStepState] = useState(defaultValue);
  const historyRef = useRef<number[]>([defaultValue]);

  const clamp = useCallback((next: number) => Math.min(Math.max(next, min), max), [min, max]);

  const setStep = useCallback((next: number) => setStepState(clamp(next)), [clamp]);
  const onBack = useCallback(() => setStepState((prev) => clamp(prev - 1)), [clamp]);
  const onNext = useCallback(() => setStepState((prev) => clamp(prev + 1)), [clamp]);

  useEffect(() => {
    if (historyRef.current[historyRef.current.length - 1] === step) return;
    historyRef.current.push(step);
  }, [step]);

  return { id, step, min, max, history: historyRef.current, setStep, onBack, onNext };
};
