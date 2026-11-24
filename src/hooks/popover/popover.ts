import { useCallback, useId, useRef, useState } from "react";

import { sanitizeSyntheticEvent } from "../../utils/sanitize-event/sanitize-event.js";

import type { GraftPopover, UseGraftPopoverOptions } from "./type.js";

export const useGraftPopover = <T, E = unknown>({ isActiveOnLoad = false }: UseGraftPopoverOptions = {}): GraftPopover<
  T,
  E
> => {
  const id = useId();
  const [isActive, setIsActive] = useState(isActiveOnLoad);
  const anchorRef = useRef<E | null>(null);
  const [storage, setStorage] = useState<T | null>(null);

  const open = useCallback((payload: T | null = null) => {
    setStorage(() => sanitizeSyntheticEvent(payload));
    setIsActive(true);
  }, []);

  const close = useCallback(() => {
    setIsActive(false);
  }, []);

  return { id, isActive, storage, anchorRef, open, close };
};
