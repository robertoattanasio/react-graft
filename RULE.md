# Conventions

## Files

One folder per hook, under `hooks/`, named in `snake_case`:

```
hooks/dialog/
  dialog.ts     the hook
  type.ts       its instance and its options
```

Shared logic lives in `utils/`, one folder per concern, with the same split — `utils/graft/` holds the factory. No barrel per folder, no index files except the root one, which exports every hook and every type.

## Naming

| what          | convention              | example                  |
| ------------- | ----------------------- | ------------------------ |
| folder, file  | `snake_case`            | `hooks/dialog/dialog.ts` |
| hook          | `useGraft<Name>`        | `useGraftDialog`         |
| instance type | `Graft<Name>`           | `GraftDialog`            |
| options type  | `UseGraft<Name>Options` | `UseGraftDialogOptions`  |
| helper        | `camelCase`             | `sanitizeSyntheticEvent` |

## What a hook may do

Hold state, and nothing else. No `window`, no `localStorage`, no DOM, no rendering — a hook that needs any of those is a hook for a different package.

The package is agnostic of the renderer: it depends on `react`, never on `react-dom`, and nothing in it names a type that belongs to one platform. A ref is state like any other, so a hook may hold one and hand it over; what it may not do is know what will end up inside it. Persistence is exposed through options and overrides, never performed.

Every hook takes a single optional options object with defaults, and returns a flat object. Options that the UI has to read back — a duration, a bound — are returned too, so a caller never writes the same number twice.

Actions are `useCallback` and free of the value they act on where possible, so their identity stays stable. `null` means empty; `undefined` is not a state.

## The factory

`createGraft` distributes, it does not define. It calls the hook, puts what it returns into a context, and adds `Provider` and `use()`. It must stay ignorant of what the hook holds.

Two rules that are load-bearing and easy to break:

- **`inject` takes hooks**, each wrapped in its own component rendering `null`. Isolation of re-renders depends on the wrapper being one component per hook, and the ban on JSX in graft files depends on it accepting functions rather than elements.
- **Injected hooks are siblings of `children`**, never wrappers. An injected effect has to outlive whatever the tree below does, or a graft could not be the thing that reopens what it closed.

The context value is deliberately rebuilt on every render: a hook holding a ref would otherwise hand out a stale value.

## Consumers

Not enforced by the package, but what the documentation shows:

```ts
export const GraftInvoiceDialog = createGraft({
  name: "GraftInvoiceDialog",
  graft: useGraft,
  inject: [useInject],
});

function useGraft() { … }
function useInject() { … }
```

The exported constant first, its functions below, `name` matching the constant so DevTools and errors say what the file says.
