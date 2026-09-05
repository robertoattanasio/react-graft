import { createContext, useContext } from "react";

import { GRAFT_EMPTY } from "./type.js";

import type { CreateGraftOptions, Graft, GraftEmpty, GraftInject } from "./type.js";
import type { ReactNode } from "react";

const Inject = <TValue,>({ inject, value }: { inject: GraftInject<TValue>; value: TValue }): null => {
  inject(value);

  return null;
};

export const createGraft = <TOptions, TValue>({
  graft,
  inject = [],
  name = "Graft",
}: CreateGraftOptions<TOptions, TValue>): Graft<TOptions, TValue> => {
  const GraftContext = createContext<TValue | GraftEmpty>(GRAFT_EMPTY);
  GraftContext.displayName = name;

  const Provider = ({ children, ...options }: TOptions & { children?: ReactNode }): ReactNode => {
    const value = graft(options as TOptions);

    return (
      <GraftContext value={value}>
        {children}
        {inject.map((injected, index) => (
          <Inject key={index} inject={injected} value={value} />
        ))}
      </GraftContext>
    );
  };

  const use = (): TValue => {
    const value = useContext(GraftContext);
    if (value === GRAFT_EMPTY) throw new Error(`${name} was read outside its provider.`);

    return value;
  };

  Provider.displayName = `${name}.Provider`;

  return { Provider, use, displayName: name };
};
