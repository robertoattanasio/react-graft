# react-graft

`react-graft` turns a hook into a typed context with a `Provider` and a `use()` function. The provider runs your hook, and `use()` gives its value to components below it. The provider's props follow the hook's options, so TypeScript checks them for you. You can also attach side effects to the provider, where they keep running even if the components inside it unmount.

Package: [npmjs.com/package/react-graft](https://www.npmjs.com/package/react-graft)

Documentation: [dev.robertoattanasio.com/react-graft](https://dev.robertoattanasio.com/react-graft)

## Installation

```sh
npm install react-graft
```

React 19 is required as a peer dependency.

First, define a hook and pass it to `createGraft`:

```tsx
import { createGraft } from "react-graft";

const useLikes = ({ start = 0 }: { start?: number }) => {
  const [value, setValue] = useState(start);
  const like = useCallback(() => setValue((count) => count + 1), []);

  return { value, like };
};

export const GraftLikes = createGraft({ name: "GraftLikes", graft: useLikes });
```

Then wrap the components that need the value in the provider, and read it with `use()`:

```tsx
<GraftLikes.Provider start={10}>
  <LikeButton />
</GraftLikes.Provider>;

const { value, like } = GraftLikes.use();
```

## API

The guides explain the factory and how to attach side effects to a provider:

- [createGraft](./docs/create-graft.md)
- [inject](./docs/inject.md): side effects that belong to the provider

The package also includes ready-made hooks under `react-graft/hooks`:

- [useGraftAlert](./docs/hooks/alert.md)
- [useGraftAuth](./docs/hooks/auth.md)
- [useGraftCounter](./docs/hooks/counter.md)
- [useGraftDialog](./docs/hooks/dialog.md)
- [useGraftPopover](./docs/hooks/popover.md)
- [useGraftReload](./docs/hooks/reload.md)
- [useGraftStep](./docs/hooks/step.md)
- [useGraftStore](./docs/hooks/store.md)

## Scripts

For the available project scripts and what they do, see [docs/scripts.md](./docs/scripts.md).

## License

[MIT](./LICENSE)
