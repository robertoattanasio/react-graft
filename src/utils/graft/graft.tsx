import { createContext, useContext } from "react";

import type { CreateGraftOptions, Graft, GraftInject } from "./type.js";
import type { ReactNode } from "react";

const Inject = ({ inject }: { inject: GraftInject }): null => {
  inject();

  return null;
};

export const createGraft = <TOptions, TValue>({
  graft,
  inject = [],
  name = "Graft",
}: CreateGraftOptions<TOptions, TValue>): Graft<TOptions, TValue> => {
  const GraftContext = createContext<TValue | null>(null);
  GraftContext.displayName = name;

  const Provider = ({ children, ...options }: TOptions & { children?: ReactNode }): ReactNode => {
    const value = graft(options as TOptions);

    return (
      <GraftContext value={value}>
        {children}
        {inject.map((injected, index) => (
          <Inject key={index} inject={injected} />
        ))}
      </GraftContext>
    );
  };

  const use = (): TValue => {
    const value = useContext(GraftContext);
    if (!value) throw new Error(`${name} was read outside its provider.`);

    return value;
  };

  return Object.assign(GraftContext, { Provider, use });
};
