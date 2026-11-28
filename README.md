# react-graft

`react-graft` turns a hook into a typed React context. You write a feature's state, actions and effects as one ordinary hook, and `createGraft` gives you a `Provider`, the component that runs the hook for a part of the tree, and a `use()` function that reads its value anywhere below it.

Each component re-renders only when a field it read has changed. A player that updates its position five times a second re-renders its progress bar, and leaves its track list, its controls and its buttons alone. There are no selectors to write and no `memo`, `useMemo` or `useCallback` to add: the value is tracked as you read it.

Package: [npmjs.com/package/react-graft](https://www.npmjs.com/package/react-graft)

Documentation and a live example: [react-graft.robertoattanasio.com](https://react-graft.robertoattanasio.com)

## Installation

```sh
npm install react-graft
```

React 19 is required as a peer dependency.

## Usage

Write the hook as you would anywhere else:

```tsx
import { useState } from "react";
import { createGraft } from "react-graft";

const useLikes = ({ start = 0 }: { start?: number }) => {
  const [value, setValue] = useState(start);
  const like = () => setValue((count) => count + 1);

  return { value, like };
};

export const GraftLikes = createGraft({ name: "GraftLikes", graft: useLikes });
```

Wrap the part of the tree that needs it. The provider's props are the hook's options, typed from its signature:

```tsx
<GraftLikes.Provider start={10}>
  <LikeCount />
  <LikeButton />
</GraftLikes.Provider>
```

Read it where you need it:

```tsx
const LikeCount = () => {
  const { value } = GraftLikes.use();

  return <span>{value}</span>;
};

const LikeButton = () => {
  const { like } = GraftLikes.use();

  return <button onClick={like}>Like</button>;
};
```

A click re-renders `LikeCount`, which read `value`. `LikeButton` read only `like`, so it never re-renders.

## Only what you read

`use()` returns a snapshot of the hook's value that records which fields the component reads during render. When the hook's value changes, the component re-renders only if one of those fields changed.

- **Fields.** Reading `value` subscribes the component to `value`, and to nothing else.
- **Nested fields.** Reading `track.title` re-renders only when the title changes, even if the hook returns a new `track` object on every render with the same title.
- **Functions.** Every function in the value keeps the same identity for the life of the provider and always calls the latest version. Inline functions in the hook are fine, and so are they in effect dependencies.
- **The provider itself.** When the hook re-renders and returns the same fields, no reader re-renders.

The tracking is done by [proxy-compare](https://www.npmjs.com/package/proxy-compare), the package's only dependency.

## Good to know

- **Read in render what you use.** A field that a component reads only inside an event handler isn't tracked, so the handler sees the value from the component's last render. Read the field in render, or call a function from the hook, which always sees the latest state. See the example below.
- **Destructure, don't pass the whole value on.** A component that hands the whole snapshot to a child, or to `JSON.stringify`, reads every field and re-renders on every change.
- **Don't use the snapshot as a whole in dependencies.** It's a new object whenever a field changes. Put its fields in `useEffect`, `useMemo` and `memo` comparisons instead.
- **Plain objects only.** The hook should return a plain object. Anything else is provided as it is and compared by identity, as a plain context would.
- **Concurrent renders.** The provider publishes the new value while it renders, so the components that mount in the same render see it at once. If React throws that render away, in a transition or under Suspense, a reader that re-renders before the next commit can show the discarded value for one render.

### Where you read a field

What counts is where a field is read, not how. Both of these read `position` during render, so both re-render when it changes:

```tsx
const Position = () => {
  const { position } = GraftPlayer.use();

  return <span>{position}</span>;
};
```

```tsx
const Position = () => {
  const player = GraftPlayer.use();

  return <span>{player.position}</span>;
};
```

This one reads `position` only when the button is clicked. During render it reads nothing, so it never re-renders, and the click shares the position of its first render:

```tsx
const ShareButton = () => {
  const player = GraftPlayer.use();

  return <button onClick={() => share(player.position)}>Share</button>;
};
```

Read the field in render, so the component follows it:

```tsx
const ShareButton = () => {
  const { position } = GraftPlayer.use();

  return <button onClick={() => share(position)}>Share</button>;
};
```

Or let the hook do it with a function, which always sees the latest state and never re-renders the button:

```tsx
const usePlayer = () => {
  const [position, setPosition] = useState(0);
  const shareCurrent = () => share(position);

  return { position, shareCurrent };
};

const ShareButton = () => {
  const { shareCurrent } = GraftPlayer.use();

  return <button onClick={shareCurrent}>Share</button>;
};
```

## Side effects in the provider

`inject` runs hooks inside the provider, next to the components below it rather than in them. An injected effect keeps running when the tree below the provider unmounts, so a graft can sync its value to the URL, the title or storage without a component to host it. See [inject](./docs/inject.md).

## API

- [createGraft](./docs/create-graft.md): the factory, its options and what `use()` returns
- [inject](./docs/inject.md): side effects that belong to the provider

Ready-made hooks under `react-graft/hooks`, each one a graft on its own:

- [useGraftAlert](./docs/hooks/alert.md)
- [useGraftAuth](./docs/hooks/auth.md)
- [useGraftCounter](./docs/hooks/counter.md)
- [useGraftDialog](./docs/hooks/dialog.md)
- [useGraftPopover](./docs/hooks/popover.md)
- [useGraftReload](./docs/hooks/reload.md)
- [useGraftStep](./docs/hooks/step.md)
- [useGraftStore](./docs/hooks/store.md)

## Upgrading from 1.x

The API is the same. What changes is when components re-render:

- In 1.x every reader re-rendered with the provider. In 2.0 a reader re-renders only when a field it read has changed.
- Functions in the value now keep their identity. `useCallback` in the hook still works, and is no longer needed.
- A component that read a field only inside an event handler used to see the latest value because it re-rendered anyway. Read that field in render, or call a function from the hook.

## Scripts

For the available project scripts and what they do, see [docs/scripts.md](./docs/scripts.md).

## License

[MIT](./LICENSE)
