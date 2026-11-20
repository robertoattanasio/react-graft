import type { Dispatch, SetStateAction } from "react";

export type GraftStore<T = unknown> = {
  id: string;
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  resetValue: () => void;
};

export type UseGraftStoreOptions<T = unknown> = {
  defaultValue: T;
};
