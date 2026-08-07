import type { Dispatch, SetStateAction } from "react";

export type GraftStore<T = unknown> = {
  id: string;
  value: T | null;
  setValue: Dispatch<SetStateAction<T | null>>;
  resetValue: () => void;
  cleanValue: () => void;
};

export type UseGraftStoreOptions<T = unknown> = {
  defaultValue?: T | (() => T) | null;
};
