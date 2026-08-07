import type { Grafted } from "./type.js";

export const graft = <TBase extends object, TOwn extends object>(base: TBase, own: TOwn): Grafted<TBase, TOwn> =>
  ({ ...base, ...own }) as Grafted<TBase, TOwn>;
