import { useCallback, useId, useState } from "react";

import { sanitizeSyntheticEvent } from "../../utils/sanitize-event/sanitize-event.js";

import type { GraftDialog, UseGraftDialogOptions } from "./type.js";

export const useGraftDialog = <T>({ isActiveOnLoad = false }: UseGraftDialogOptions = {}): GraftDialog<T> => {
  const id = useId();
  const [isActive, setIsActive] = useState(isActiveOnLoad);
  const [storage, setStorage] = useState<T | null>(null);

  const open = useCallback((payload: T | null = null) => {
    setStorage(() => sanitizeSyntheticEvent(payload));
    setIsActive(true);
  }, []);

  const close = useCallback(() => {
    setIsActive(false);
  }, []);

  return { id, isActive, storage, open, close };
};
