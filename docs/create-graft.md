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
- The value is passed as it is, and the hook returns a new object on every render: every reader re-renders with the provider. Grafts are meant to be many and narrow.
- `Graft.use` and the injected hooks have hook names, so `react-hooks/rules-of-hooks` checks them.
- Nothing here renders an element, touches the DOM or uses a browser API.

## Example

A hook from `react-graft/hooks`, with its type argument:

```tsx
import { createGraft } from "react-graft";
import { useGraftDialog } from "react-graft/hooks";

export const GraftSheet = createGraft({ name: "GraftSheet", graft: useGraftDialog<string> });

<GraftSheet.Provider isActiveOnLoad={false}>
  <Page />
</GraftSheet.Provider>;
```
