# react-graft

A factory that turns a hook into a typed React context, with side effects that belong to the provider, plus state hooks under `react-graft/hooks`. Public package on npm.

## Docs

- [README.md](./README.md): what it does, install, usage, the tracking rules, upgrading from 1.x, links to the docs.
- [docs/](./docs/): [create-graft.md](./docs/create-graft.md), [inject.md](./docs/inject.md), one file per hook in `docs/hooks/`, plus [scripts.md](./docs/scripts.md) and [release.md](./docs/release.md).

Read the relevant doc before changing the package. When an option, a field or a behavior changes, update its doc in the same change.

## Structure

```
src/
  index.ts           the barrel of react-graft
  graft/
    graft.tsx        the factory
    graft.hook.ts    the provider's store and the tracked read
    graft.helper.ts  the store: snapshot, stable callers, listeners
    type.ts          its options, its return, the store, the empty sentinel
  hooks/
    index.ts         the barrel of react-graft/hooks
    <name>/<name>.ts the hook
    <name>/type.ts   its options and its return
  utils/
    <name>/<name>.ts a helper shared by the hooks, never exported
docs/
  hooks/<name>.md
```

The root barrel never imports from `hooks/`: a project that only uses `createGraft` doesn't load them.

## Naming

| What    | Convention         | Example                 |
| ------- | ------------------ | ----------------------- |
| file    | kebab-case         | `type.ts`               |
| type    | `Graft*`           | `GraftInject`           |
| helper  | camelCase          | `createGraft`           |
| hook    | `useGraft*`        | `useGraftDialog`        |
| options | `UseGraft*Options` | `UseGraftDialogOptions` |

## Factory

`createGraft` calls the hook, puts what it returns into a context, and returns `Provider`, `use` and `displayName`. It doesn't know what the hook holds.

- The context is never returned, so a value can only come from the hook.
- An empty context is the `GRAFT_EMPTY` symbol, so `undefined` and `null` are valid values.
- Each entry of `inject` is a hook, rendered by its own component that returns `null`, as a sibling after `children`.
- The context holds a store that never changes identity. The provider publishes a new snapshot only when a field of the hook's value changed; functions are wrapped once in stable callers that call the latest render's function.
- The snapshot is published while the provider renders, not in an effect: components that mount in the same render must see it, or a provider swapped for another one would give its new children the old value. The cost is the discarded-render case documented in `create-graft.md`. Moving the publish into the layout effect was tried and broke exactly that case.
- `use()` reads the snapshot through `useSyncExternalStore` and returns it as a proxy-compare proxy: a reader re-renders only when a field it read changed. Listeners are notified in a layout effect of the provider.
- A value that isn't a plain object is published as it is and compared by identity.
- `inject` is typed `GraftInject<NoInfer<TValue>>`: `TValue` is inferred from `graft` only.

## Hooks

Each hook returns one object, ready to be the `graft` of `createGraft`.

- Every object has an `id` from `useId`.
- Options are one object with defaults, so they map to the provider's props.
- A payload passed to `open` lives in state, so a new `open` on an open dialog re-renders it.
- A React synthetic event passed as payload becomes `null`, so `onClick={open}` works.
- Persistence and DOM access belong to the consumer, not to this package.

## Conventions

- Relative imports end in `.js`, types are imported with `import type`.
- React is a peer dependency. The only dependency is `proxy-compare`, for the tracked snapshot.
- No comments in the code unless asked.

## Adding a hook

1. `src/hooks/<name>/<name>.ts` and `type.ts`.
2. Export it, and its types, from `src/hooks/index.ts`.
3. `docs/hooks/<name>.md`, same layout as the others.
4. Link it in `README.md`.
5. `npm run ts:check`.
