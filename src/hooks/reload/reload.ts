import { useCallback, useEffect, useId, useState } from "react";

import type { GraftReload, UseGraftReloadOptions } from "./type.js";

export const useGraftReload = ({ delay = 0 }: UseGraftReloadOptions = {}): GraftReload => {
  const id = useId();
  const [isReloading, setIsReloading] = useState(false);

  const onReload = useCallback(() => setIsReloading(true), []);

  useEffect(() => {
    if (!isReloading) return;

    const timer = setTimeout(() => setIsReloading(false), delay);
    return () => clearTimeout(timer);
  }, [isReloading, delay]);

  return { id, isReloading, onReload };
};
