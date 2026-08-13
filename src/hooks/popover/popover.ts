import { useCallback, useId, useRef, useState } from "react";

import { sanitizeSyntheticEvent } from "../../utils/sanitize_event/sanitize_event.js";

import type { GraftPopover, UseGraftPopoverOptions } from "./type.js";

export const useGraftPopover = <T, E = unknown>({
  isActiveOnLoad = false,
}: UseGraftPopoverOptions = {}): GraftPopover<T, E> => {
  const id = useId();
  const [isActive, setIsActive] = useState(isActiveOnLoad);
  const anchorRef = useRef<E | null>(null);
  const storageRef = useRef<T | null>(null);

  const open = useCallback((payload: T | null = null) => {
    storageRef.current = sanitizeSyntheticEvent(payload);
    setIsActive(true);
  }, []);

  const close = useCallback(() => {
    setIsActive(false);
  }, []);

  return { id, isActive, storage: storageRef.current, anchorRef, open, close };
};
