import { createContext, useContext } from "react";

import { usePublished, useTracked } from "./graft.hook.js";
import { GRAFT_EMPTY } from "./type.js";

import type { CreateGraftOptions, Graft, GraftEmpty, GraftInject, GraftStore } from "./type.js";
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
  const GraftContext = createContext<GraftStore<TValue> | GraftEmpty>(GRAFT_EMPTY);
  GraftContext.displayName = name;

  const Provider = ({ children, ...options }: TOptions & { children?: ReactNode }): ReactNode => {
    const store = usePublished(graft(options as TOptions));

    return (
      <GraftContext value={store}>
        {children}
        {inject.map((injected, index) => (
          <Inject key={index} inject={injected} value={store.snapshot} />
        ))}
      </GraftContext>
    );
  };

  const use = (): TValue => {
    const store = useContext(GraftContext);
    if (store === GRAFT_EMPTY) throw new Error(`${name} was read outside its provider.`);

    return useTracked(store);
  };

  Provider.displayName = `${name}.Provider`;

  return { Provider, use, displayName: name };
};
