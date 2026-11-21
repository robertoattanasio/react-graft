# useGraftStore

A value with a setter and a reset.

```ts
useGraftStore<T>(options: UseGraftStoreOptions<T>): GraftStore<T>
```

| Option         | Type | Default  |                   |
| -------------- | ---- | -------- | ----------------- |
| `defaultValue` | `T`  | required | the initial value |

| Field        | Type                          |                                       |
| ------------ | ----------------------------- | ------------------------------------- |
| `id`         | `string`                      | from `useId`                          |
| `value`      | `T`                           |                                       |
| `setValue`   | `Dispatch<SetStateAction<T>>` | React's setter: a value or an updater |
| `resetValue` | `() => void`                  | back to `defaultValue`                |

## Behavior

- `resetValue` goes back to the `defaultValue` of the first render: later changes of the prop are ignored.

## Example

```tsx
export const GraftFilters = createGraft({ name: "GraftFilters", graft: useGraftStore<Filters> });

<GraftFilters.Provider defaultValue={{ tag: null, sort: "newest" }}>
  <Projects />
</GraftFilters.Provider>;
```
