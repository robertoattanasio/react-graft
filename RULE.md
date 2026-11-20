# Rules

How react-graft code is written.

## Files

The package is one function, plus the state hooks published under `react-graft/hooks`:

```
src/
  graft/
    graft.tsx      the factory
    type.ts        its options, its return, the empty sentinel
  hooks/
    <name>/
      <name>.ts    the hook
      type.ts      its options and its return
    index.ts       the barrel of react-graft/hooks
  utils/
    <name>/
      <name>.ts    a helper shared by the hooks, never exported
  index.ts         the barrel of react-graft
```

The root barrel never imports from `hooks/`: a project that only uses `createGraft` doesn't load them. Persistence and DOM access belong to the consumer, not to this package.

## Naming

| what    | convention         | example                 |
| ------- | ------------------ | ----------------------- |
| file    | `snake_case`       | `type.ts`               |
| type    | `Graft*`           | `GraftInject`           |
| helper  | `camelCase`        | `createGraft`           |
| hook    | `useGraft*`        | `useGraftDialog`        |
| options | `UseGraft*Options` | `UseGraftDialogOptions` |

## The hooks

Each hook returns one object, ready to be the `graft` of `createGraft`.

- Every object has an `id` from `useId`.
- A payload passed to `open` lives in state, so a new `open` on an open dialog re-renders it.
- A React synthetic event passed as payload becomes `null`, so `onClick={open}` works.

## The factory

`createGraft` calls the hook, puts what it returns into a context, and returns `Provider`, `use` and `displayName`. It doesn't know what the hook holds.

- The context is never returned, so a value can only come from the hook.
- Each entry of `inject` is a hook, rendered by its own component that returns `null`.
- Injected hooks are siblings of `children`, rendered after them.
- The context value is rebuilt on every render of the provider.
- `inject` is typed `GraftInject<NoInfer<TValue>>`: `TValue` is inferred from `graft` only.
