import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { GraftTab, UseGraftTabOptions } from "./type.js";

export const useGraftTab = ({
  defaultValue = 0,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
}: UseGraftTabOptions = {}): GraftTab => {
  const id = useId();
  const [tab, setTabState] = useState(defaultValue);
  const historyRef = useRef<number[]>([defaultValue]);

  const clamp = useCallback((next: number) => Math.min(Math.max(next, min), max), [min, max]);

  const setTab = useCallback((next: number) => setTabState(clamp(next)), [clamp]);
  const onBack = useCallback(() => setTabState((prev) => clamp(prev - 1)), [clamp]);
  const onNext = useCallback(() => setTabState((prev) => clamp(prev + 1)), [clamp]);

  useEffect(() => {
    if (historyRef.current[historyRef.current.length - 1] === tab) return;
    historyRef.current.push(tab);
  }, [tab]);

  return { id, tab, history: historyRef.current, setTab, onBack, onNext };
};
