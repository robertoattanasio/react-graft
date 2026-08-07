import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { GraftCounter, UseGraftCounterOptions } from "./type.js";

const remainingFrom = (deadline: number): number => Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

export const useGraftCounter = ({
  duration = 30,
  defaultValue = null,
  startOnLoad = false,
}: UseGraftCounterOptions = {}): GraftCounter => {
  const id = useId();
  const initial = Math.max(0, defaultValue ?? duration);
  const isCountingOnLoad = startOnLoad && initial > 0;

  const [counter, setCounter] = useState(isCountingOnLoad ? initial : 0);
  const [isCounting, setIsCounting] = useState(isCountingOnLoad);
  const deadlineRef = useRef<number | null>(isCountingOnLoad ? Date.now() + initial * 1000 : null);

  useEffect(() => {
    if (!isCounting) return;

    const interval = setInterval(() => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;

      const remaining = remainingFrom(deadline);
      setCounter(remaining);

      if (remaining > 0) return;

      deadlineRef.current = null;
      setIsCounting(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCounting]);

  const start = useCallback(() => {
    deadlineRef.current = Date.now() + duration * 1000;
    setCounter(duration);
    setIsCounting(true);
  }, [duration]);

  const reset = useCallback(() => {
    deadlineRef.current = null;
    setCounter(0);
    setIsCounting(false);
  }, []);

  return { id, counter, duration, isCounting, start, reset };
};
