# Rules

How react-graft code is written.

## Files

The package is one function, in a folder of its own:

```
src/
  graft/
    graft.tsx   the factory
    type.ts     its options, its return, the empty sentinel
  index.ts      the only barrel
```

State hooks, persistence and DOM access belong to the consumer, not to this package.

## Naming

| what   | convention   | example       |
| ------ | ------------ | ------------- |
| file   | `snake_case` | `type.ts`     |
| type   | `Graft*`     | `GraftInject` |
| helper | `camelCase`  | `createGraft` |

## The factory

`createGraft` calls the hook, puts what it returns into a context, and returns `Provider`, `use` and `displayName`. It doesn't know what the hook holds.

- The context is never returned, so a value can only come from the hook.
- Each entry of `inject` is a hook, rendered by its own component that returns `null`.
- Injected hooks are siblings of `children`, rendered after them.
- The context value is rebuilt on every render of the provider.
- `inject` is typed `GraftInject<NoInfer<TValue>>`: `TValue` is inferred from `graft` only.
