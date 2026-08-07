import { useCallback, useId, useRef, useState } from "react";

import type { GraftStore, UseGraftStoreOptions } from "./type.js";

const resolveDefault = <T>(defaultValue: T | (() => T) | null): T | null =>
  typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue;

export const useGraftStore = <T>({ defaultValue = null }: UseGraftStoreOptions<T> = {}): GraftStore<T> => {
  const id = useId();
  const defaultRef = useRef(defaultValue);

  const [value, setValue] = useState<T | null>(() => resolveDefault(defaultValue));

  const resetValue = useCallback(() => setValue(resolveDefault(defaultRef.current)), []);
  const cleanValue = useCallback(() => setValue(null), []);

  return { id, value, setValue, resetValue, cleanValue };
};
