import type { RefObject } from "react";

export type GraftPopover<T = unknown, E = unknown> = {
  id: string;
  isActive: boolean;
  storage: T | null;
  anchorRef: RefObject<E | null>;
  open: (payload?: T | null) => void;
  close: () => void;
};

export type UseGraftPopoverOptions = {
  isActiveOnLoad?: boolean;
};
