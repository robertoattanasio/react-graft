import type { GraftCaller, GraftStore } from "./type.js";

export const createGraftStore = <TValue>(value: TValue): GraftStore<TValue> => {
  const store: GraftStore<TValue> = {
    value,
    snapshot: value,
    caller: new Map(),
    listener: new Set(),
  };
  store.snapshot = readSnapshot(store, value);

  return store;
};

export const publishGraftStore = <TValue>(store: GraftStore<TValue>, value: TValue) => {
  store.value = value;
  store.snapshot = readSnapshot(store, value);
};

export const subscribeGraftStore = (store: GraftStore<unknown>, listener: () => void) => {
  store.listener.add(listener);

  return () => {
    store.listener.delete(listener);
  };
};

export const notifyGraftStore = (store: GraftStore<unknown>) => {
  store.listener.forEach((listener) => listener());
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype;

const isShallowEqual = (first: Record<string, unknown>, second: Record<string, unknown>) => {
  const firstKey = Object.keys(first);
  if (firstKey.length !== Object.keys(second).length) return false;

  return firstKey.every((key) => Object.is(first[key], second[key]));
};

const readCaller = (store: GraftStore<unknown>, key: string): GraftCaller => {
  const cached = store.caller.get(key);
  if (cached) return cached;

  const caller: GraftCaller = (...argList) => {
    const latest = (store.value as Record<string, unknown>)[key];
    if (typeof latest !== "function") throw new Error(`${key} is not a function anymore.`);

    return latest(...argList);
  };
  store.caller.set(key, caller);

  return caller;
};

const readSnapshot = <TValue>(store: GraftStore<TValue>, value: TValue): TValue => {
  if (!isRecord(value)) return value;

  const next: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    const field = value[key];
    next[key] = typeof field === "function" ? readCaller(store, key) : field;
  }

  const previous = store.snapshot;
  if (isRecord(previous) && isShallowEqual(previous, next)) return previous as TValue;

  return next as TValue;
};
