import { useCallback, useId, useState } from "react";

import type { GraftAuth, UseGraftAuthOptions } from "./type.js";

export const useGraftAuth = <T = string,>({ defaultValue = null }: UseGraftAuthOptions<T> = {}): GraftAuth<T> => {
  const id = useId();
  const [token, setToken] = useState<T | null>(defaultValue);

  const onAuth = useCallback((next: T) => setToken(next), []);
  const onAuthRevoke = useCallback(() => setToken(null), []);

  return { id, token, isAuthorized: token !== null, onAuth, onAuthRevoke };
};
