import { useCallback, useId, useRef, useState } from "react";

import { sanitizeSyntheticEvent } from "../../utils/sanitize_event/sanitize_event.js";

import type { GraftDialog, UseGraftDialogOptions } from "./type.js";

export const useGraftDialog = <T>({ isActiveOnLoad = false }: UseGraftDialogOptions = {}): GraftDialog<T> => {
  const id = useId();
  const [isActive, setIsActive] = useState(isActiveOnLoad);
  const storageRef = useRef<T | null>(null);

  const open = useCallback((payload: T | null = null) => {
    storageRef.current = sanitizeSyntheticEvent(payload);
    setIsActive(true);
  }, []);

  const close = useCallback(() => {
    setIsActive(false);
  }, []);

  return { id, isActive, storage: storageRef.current, open, close };
};
