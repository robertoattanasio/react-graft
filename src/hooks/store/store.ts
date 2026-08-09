import { useCallback, useId, useRef, useState } from "react";

import type { GraftStore, UseGraftStoreOptions } from "./type.js";

export const useGraftStore = <T>({ defaultValue }: UseGraftStoreOptions<T>): GraftStore<T> => {
  const id = useId();
  const defaultRef = useRef(defaultValue);

  const [value, setValue] = useState<T>(defaultValue);

  const resetValue = useCallback(() => setValue(defaultRef.current), []);

  return { id, value, setValue, resetValue };
};
