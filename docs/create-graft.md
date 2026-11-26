# createGraft

Turns a hook into a context: a `Provider` that runs the hook, and a `use` that reads its value.

```ts
createGraft<TOptions, TValue>(options: CreateGraftOptions<TOptions, TValue>): Graft<TOptions, TValue>
```

| Option   | Type                            | Default   |                                                          |
| -------- | ------------------------------- | --------- | -------------------------------------------------------- |
| `graft`  | `(options: TOptions) => TValue` | required  | the hook the provider runs                               |
| `inject` | `GraftInject<TValue>[]`         | `[]`      | hooks run inside the provider, see [inject](./inject.md) |
| `name`   | `string`                        | `"Graft"` | shown in React DevTools and in the error message         |

## Returns

| Field         | Type                                                        |                                         |
| ------------- | ----------------------------------------------------------- | --------------------------------------- |
| `Provider`    | `(props: TOptions & { children?: ReactNode }) => ReactNode` | runs the hook, provides its value       |
| `use`         | `() => TValue`                                              | reads the value of the nearest provider |
| `displayName` | `string`                                                    | `name`                                  |

Types: `CreateGraftOptions`, `Graft`, `GraftInject`.

## Behavior

- The provider's props, without `children`, are passed to the hook as its options object. Their types come from the hook's signature.
- Each provider is an independent instance of the hook. Two providers, two states.
- `use()` throws `"<name> was read outside its provider."` outside a provider.
- The context isn't returned: mounting the provider is the only way to supply a value.
- The value is expected to be a plain object. Anything else is provided as it is and compared by identity.
- `use()` returns a tracked snapshot of the value: a reader re-renders only when a field it read has changed, nested fields included. The provider re-rendering with the same fields re-renders no reader.
- A function in the value is wrapped once: its identity never changes, and it always calls the function of the latest render. Inline functions in the hook are fine, and so are they in effect dependencies.
- `Graft.use` and the injected hooks have hook names, so `react-hooks/rules-of-hooks` checks them.
- Nothing here renders an element, touches the DOM or uses a browser API.

## Tracking

The snapshot `use()` returns is a proxy that records the fields read during render, through [proxy-compare](https://www.npmjs.com/package/proxy-compare).

- Read the fields in the component that needs them: destructuring in render is the usual way.
- A reader that doesn't read a field, and passes the whole snapshot on, re-renders on every change of the value.
- A nested object read from the snapshot is tracked too: reading `storage.customer` re-renders only when `customer` changes, not when `storage` is a new object with the same `customer`.
- The snapshot is a new object whenever a field changes: don't use it as a whole in `memo`, `useMemo` or effect dependencies. Use its fields.

## Example

A hook from `react-graft/hooks`, with its type argument:

```tsx
import { createGraft } from "react-graft";
import { useGraftDialog } from "react-graft/hooks";

export const GraftSheet = createGraft({
  name: "GraftSheet",
  graft: useGraftDialog<string>,
});

<GraftSheet.Provider isActiveOnLoad={false}>
  <Page />
</GraftSheet.Provider>;
```
