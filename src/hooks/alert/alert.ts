import { useCallback, useEffect, useId, useRef, useState } from "react";

import { sanitizeSyntheticEvent } from "../../utils/sanitize_event/sanitize_event.js";

import type { GraftAlert } from "./type.js";

export const useGraftAlert = <T,>(): GraftAlert<T> => {
  const id = useId();
  const [isActive, setIsActive] = useState(false);
  const storageRef = useRef<T | null>(null);
  const resolverRef = useRef<((result: boolean) => void) | null>(null);

  const close = useCallback((result = false) => {
    storageRef.current = null;
    setIsActive(false);

    const resolve = resolverRef.current;
    resolverRef.current = null;
    resolve?.(result);
  }, []);

  const open = useCallback((payload: T | null = null) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current?.(false);
      resolverRef.current = resolve;
      storageRef.current = sanitizeSyntheticEvent(payload);
      setIsActive(true);
    });
  }, []);

  const onConfirm = useCallback(() => close(true), [close]);
  const onDismiss = useCallback(() => close(false), [close]);

  useEffect(() => {
    return () => {
      resolverRef.current?.(false);
      resolverRef.current = null;
    };
  }, []);

  return { id, isActive, storage: storageRef.current, open, close, onConfirm, onDismiss };
};
