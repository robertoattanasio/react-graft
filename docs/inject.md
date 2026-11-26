# inject

Hooks that run inside the provider and receive the graft's value: side effects that belong to the provider, not to the components below it.

```ts
type GraftInject<TValue> = (value: TValue) => void;
```

## Behavior

- Each entry runs in a component of its own, rendered by the provider, that returns `null`.
- It receives the value as the provider holds it, with the same stable functions `use()` returns, but untracked: it runs on every render of the provider.
- Injected components are siblings of `children`, rendered after them, in the order of the array. They never wrap the children.
- An injected effect keeps running when the tree below the provider unmounts. A graft can reopen what it closed, or clean up after a page that's gone.
- `TValue` is inferred from `graft` only: an injected hook is checked against it, never widens it.

## Example

```tsx
const useInjectTitle = ({ value }: { value: number }) => {
  useEffect(() => {
    document.title = `${value} likes`;
  }, [value]);
};

export const GraftLikes = createGraft({
  name: "GraftLikes",
  graft: useLikes,
  inject: [useInjectTitle],
});
```
