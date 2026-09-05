# Conventions

## Files

The package is one function. It lives in a folder of its own, and `index.ts` is the only barrel:

```
src/
  graft/
    graft.tsx   the factory
    type.ts     its options, its return, the empty sentinel
  index.ts      the only barrel
```

Anything that is not `createGraft` does not belong here. State hooks, persistence, DOM access, platform types: all of it is the consumer's, and the documentation is where it gets shown.

## Naming

| what   | convention   | example       |
| ------ | ------------ | ------------- |
| file   | `snake_case` | `type.ts`     |
| type   | `Graft*`     | `GraftInject` |
| helper | `camelCase`  | `createGraft` |

## The factory

`createGraft` distributes, it does not define. It calls the hook, puts what it returns into a context, and adds `Provider` and `use()`. It must stay ignorant of what the hook holds.

Four rules are load-bearing and easy to break:

- **The context is private.** `createGraft` returns `Provider`, `use` and `displayName`, never the context itself, so a reader can never receive a value the hook did not produce.
- **`inject` takes hooks**, each wrapped in its own component rendering `null`. Isolation of re-renders depends on the wrapper being one component per hook, and the ban on JSX in graft files depends on it accepting functions rather than elements.
- **Injected hooks are siblings of `children`**, never wrappers, and they come after them. An injected effect has to outlive whatever the tree below does, or a graft could not be the thing that reopens what it closed.
- **The context value is rebuilt on every render.** A hook holding a ref would otherwise hand out a stale value.

`inject` is typed `GraftInject<NoInfer<TValue>>`, so the entries read the value without taking part in inferring it: `TValue` comes from `graft` and from nowhere else.

## Consumers

Not enforced by the package, but what the documentation shows:

```ts
export const GraftInvoiceDialog = createGraft({
  name: "GraftInvoiceDialog",
  graft: useGraft,
  inject: [useInject],
});

function useGraft() { … }
function useInject(value) { … }
```

The exported constant first, its functions below, `name` matching the constant so DevTools and errors say what the file says. Injected hooks read the value from their argument rather than from `use()`, which keeps them free of the constant that mounts them.
