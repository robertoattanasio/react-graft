# react-graft

## 0.2.0

### Minor Changes

- d4d8c15: Keep the graft's context private, read it through a dedicated empty sentinel, and let `useGraftStore` hold the type you asked for.

  `createGraft` no longer returns the React context itself: `Graft<TOptions, TValue>` is now a plain object of `Provider`, `use` and `displayName`, and no longer extends `Context<TValue | null>`. Mounting the graft as a provider directly (`<MyGraft value={...}>`) or reading it with `useContext(MyGraft)` no longer typechecks — the provider is the only way to supply a value, so a reader can never receive one the hook did not produce. The provider also gets a `displayName` of its own, next to the one already set on the context.

  `use()` detects a missing provider with an internal symbol instead of a `null` check, so a graft whose hook returns `0`, `false`, `""` or `NaN` reads that value instead of throwing "was read outside its provider". `use()` now returns exactly `TValue`, without the previous `NonNullable` narrowing.

  `useGraftStore<T>` is a `useState` with a reset, and nothing more. `value` is `T` rather than `T | null`, so a store holds what its type says and reads need no `?? fallback`; nullability is the caller's to declare, with `useGraftStore<T | null>`. Consequently `defaultValue` is required and takes a value rather than a value or a factory — compute it beforehand if it has to be built — and `cleanValue` is gone: it was `resetValue` on a nullable store, and where `null` is a legitimate value `setValue(null)` says it plainly.

  Migrating: add the `T | null` you were relying on and drop the fallbacks that went with it, replace `defaultValue: () => build()` with a value, and replace `cleanValue()` with `setValue(null)` or `resetValue()`.

  Still experimental, still `0.x`: these are breaking changes shipped as a minor.
