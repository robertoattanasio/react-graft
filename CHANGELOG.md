# react-graft

## 1.0.0

### Major Changes

- react-graft is `createGraft`, and nothing else.

  The eight state hooks — `useGraftStore`, `useGraftAuth`, `useGraftDialog`, `useGraftPopover`, `useGraftAlert`, `useGraftStep`, `useGraftCounter`, `useGraftReload` — are no longer exported, and neither are their types. They were patterns worth writing once, not a library: what the package does is turn a hook into a context, and which hooks those are is the caller's business. The documentation shows them instead, as code you own.

  Migrating: lift the hooks you were using out of the 0.3.0 source into your own project. They depend on nothing but React, so they keep working unchanged.

  `inject` now receives the value. `GraftInject` is `(value: TValue) => void`, typed through `NoInfer<TValue>` so the entries read the value without taking part in inferring it — `TValue` still comes from `graft` and from nowhere else. An injected hook no longer has to name the constant that mounts it, which also removes the trap that made `inject: [useInject]` work only when `useInject` was a hoisted function declaration. Injected hooks that took no argument are unaffected.

  `react-dom` is out of `peerDependencies`. The package never imported it, and now says so.

## 0.3.0

### Minor Changes

- 221916b: `useGraftPopover` added: the same shape as `useGraftDialog` — `isActive`, `storage`, `open`, `close` and `id` — plus an `anchorRef` for the element that opens it. The ref is created and handed over, never read: it is typed by the caller through a second type parameter (`useGraftPopover<Payload, HTMLButtonElement>`), so a renderer that needs the trigger has it and one that leans on the layout around it can ignore it.

  The rule on what a hook may hold now says renderer instead of element: the package depends on `react` and never on `react-dom`, and nothing in it names a type that belongs to one platform. A ref is state like any other — a hook may carry one, as long as it does not know what will end up inside it.

## 0.2.0

### Minor Changes

- d4d8c15: Keep the graft's context private, read it through a dedicated empty sentinel, and let `useGraftStore` hold the type you asked for.

  `createGraft` no longer returns the React context itself: `Graft<TOptions, TValue>` is now a plain object of `Provider`, `use` and `displayName`, and no longer extends `Context<TValue | null>`. Mounting the graft as a provider directly (`<MyGraft value={...}>`) or reading it with `useContext(MyGraft)` no longer typechecks — the provider is the only way to supply a value, so a reader can never receive one the hook did not produce. The provider also gets a `displayName` of its own, next to the one already set on the context.

  `use()` detects a missing provider with an internal symbol instead of a `null` check, so a graft whose hook returns `0`, `false`, `""` or `NaN` reads that value instead of throwing "was read outside its provider". `use()` now returns exactly `TValue`, without the previous `NonNullable` narrowing.

  `useGraftStore<T>` is a `useState` with a reset, and nothing more. `value` is `T` rather than `T | null`, so a store holds what its type says and reads need no `?? fallback`; nullability is the caller's to declare, with `useGraftStore<T | null>`. Consequently `defaultValue` is required and takes a value rather than a value or a factory — compute it beforehand if it has to be built — and `cleanValue` is gone: it was `resetValue` on a nullable store, and where `null` is a legitimate value `setValue(null)` says it plainly.

  Migrating: add the `T | null` you were relying on and drop the fallbacks that went with it, replace `defaultValue: () => build()` with a value, and replace `cleanValue()` with `setValue(null)` or `resetValue()`.

  Still experimental, still `0.x`: these are breaking changes shipped as a minor.
