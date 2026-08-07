export type Grafted<TBase, TOwn> = Omit<TBase, keyof TOwn> & TOwn;
