# react-graft

Turns a hook into a React context: a `Provider` that mounts it, a `use()` that reads it, and side effects that belong to the provider instead of to whichever component happened to be mounted.

Over a context written by hand it adds three things: provider props typed from the hook's own signature, a context nobody can supply from outside, and `inject`.

Package: [npmjs.com/package/react-graft](https://www.npmjs.com/package/react-graft)

Documentation: [dev.robertoattanasio.com/react-graft](https://dev.robertoattanasio.com/react-graft)

## Install

```sh
npm install react-graft
```

## Usage

Write a hook. What it returns is the value; what it accepts becomes a prop on the provider.

```tsx
export const GraftLikes = createGraft({
  name: "GraftLikes",
  graft: useGraft,
});

function useGraft({ start = 0 }: { start?: number }) {
  const [value, setValue] = useState(start);
  const like = useCallback(() => setValue((count) => count + 1), []);

  return { value, like };
}
```

```tsx
<GraftLikes.Provider start={10}>
  <LikeButton />
</GraftLikes.Provider>;

const { value, like } = GraftLikes.use();
```

Two providers are two independent instances. `use()` throws, naming the graft, when it is called outside its provider.

## inject

`inject` takes hooks, not components. Each runs inside the provider, in a component of its own that renders `null`, and receives the value the graft produced — the same object `use()` returns.

```tsx
export const GraftLikes = createGraft({
  name: "GraftLikes",
  graft: useGraft,
  inject: [useInjectTitle],
});

function useInjectTitle({ value }: { value: number }) {
  useEffect(() => {
    document.title = `${value} likes`;
  }, [value]);
}
```

They are siblings of `children`, never wrappers, so an injected effect keeps running when the tree below it unmounts — which is what lets a graft be the thing that reopens what it closed.

## API

`createGraft(options)`

| option   | type                          | default   |                                    |
| -------- | ----------------------------- | --------- | ---------------------------------- |
| `graft`  | `(options) => TValue`         | required  | the hook the provider mounts       |
| `inject` | `((value: TValue) => void)[]` | `[]`      | hooks run inside the provider      |
| `name`   | `string`                      | `"Graft"` | shown in DevTools and in the error |

Returns `{ Provider, use, displayName }`.

## Notes

- The context is private. Mounting the provider is the only way to supply a value.
- The value is rebuilt on every render, so every reader wakes when the provider does. Grafts are meant to be many and narrow.
- Injected hooks run after `children`, in the order of the array.
- `Graft.use()` and the entries of `inject` are hook names, so `react-hooks/rules-of-hooks` sees them.
- Nothing here renders, touches the DOM or reaches for a platform API.

## Built with

React 19 and TypeScript. No dependencies.

Conventions for contributing: [RULE.md](./RULE.md).

## License

[MIT](./LICENSE).
