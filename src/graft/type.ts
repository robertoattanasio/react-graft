import type { ReactNode } from "react";

export const GRAFT_EMPTY = Symbol("react-graft/empty");
export type GraftEmpty = typeof GRAFT_EMPTY;

export type GraftInject<TValue> = (value: TValue) => void;

export type CreateGraftOptions<TOptions, TValue> = {
  graft: (options: TOptions) => TValue;
  inject?: readonly GraftInject<NoInfer<TValue>>[];
  name?: string;
};

export type Graft<TOptions, TValue> = {
  Provider: (props: TOptions & { children?: ReactNode }) => ReactNode;
  use: () => TValue;
  displayName: string;
};
