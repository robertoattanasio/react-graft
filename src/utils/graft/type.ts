import type { Context, ReactNode } from "react";

export type GraftInject = () => void;

export type CreateGraftOptions<TOptions, TValue> = {
  graft: (options: TOptions) => TValue;
  inject?: readonly GraftInject[];
  name?: string;
};

export type Graft<TOptions, TValue> = Context<TValue | null> & {
  Provider: (props: TOptions & { children?: ReactNode }) => ReactNode;
  use: () => TValue;
};
