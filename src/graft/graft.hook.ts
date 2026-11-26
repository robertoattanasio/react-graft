import { createProxy, isChanged } from "proxy-compare";
import { useCallback, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from "react";

import { createGraftStore, notifyGraftStore, publishGraftStore, subscribeGraftStore } from "./graft.helper.js";
import { GRAFT_EMPTY } from "./type.js";

import type { GraftEmpty, GraftStore } from "./type.js";

export const usePublished = <TValue>(value: TValue): GraftStore<TValue> => {
  const storeRef = useRef<GraftStore<TValue> | null>(null);
  storeRef.current ??= createGraftStore(value);

  const store = storeRef.current;
  publishGraftStore(store, value);

  useLayoutEffect(() => {
    notifyGraftStore(store);
  }, [store, store.snapshot]);

  return store;
};

export const useTracked = <TValue>(store: GraftStore<TValue>): TValue => {
  const affected = useMemo(() => new WeakMap<object, unknown>(), [store]);
  const proxyCache = useMemo(() => new WeakMap<object, unknown>(), [store]);
  const renderedRef = useRef<TValue | GraftEmpty>(GRAFT_EMPTY);

  let isRendering = true;

  const subscribe = useCallback((listener: () => void) => subscribeGraftStore(store, listener), [store]);
  const readSnapshot = () => {
    const next = store.snapshot;
    const rendered = renderedRef.current;
    if (isRendering || rendered === GRAFT_EMPTY) return next;

    return isChanged(rendered, next, affected) ? next : rendered;
  };

  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => store.snapshot);
  isRendering = false;

  useLayoutEffect(() => {
    renderedRef.current = snapshot;
  });

  return createProxy(snapshot, affected, proxyCache);
};
