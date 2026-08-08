# react-graft

A factory that turns a hook into a React context, with a set of small state hooks to put in it.

Package: [npmjs.com/package/react-graft](https://www.npmjs.com/package/react-graft)

Documentation: [dev.robertoattanasio.com/react-graft](https://dev.robertoattanasio.com/react-graft)

## Install

```sh
npm install react-graft
```

## Usage

`createGraft` takes a hook and returns a React context augmented with a `Provider` that mounts it and a `use()` that reads it. Whatever the hook accepts becomes a prop on the provider, typed from its own signature.

```tsx
export const GraftUserDialog = createGraft({
  name: "GraftUserDialog",
  graft: useGraftDialog<User>,
});

<GraftUserDialog.Provider>
  <Toolbar />
</GraftUserDialog.Provider>;

const dialog = GraftUserDialog.use();
```

The hook is yours. Write one that composes the hooks you need, spread what you took and override what does not fit — the type follows the object you return.

```tsx
export const GraftInvoiceDialog = createGraft({
  name: "GraftInvoiceDialog",
  graft: useGraft,
  inject: [useInject],
});

function useGraft() {
  const dialog = useGraftDialog<Invoice>();
  const discard = GraftDiscard.use();

  const close = useCallback(async () => {
    if (!(await discard.open())) return;

    dialog.close();
  }, [dialog, discard]);

  return { ...dialog, close };
}
```

`inject` takes hooks, not components. They run inside the provider, each in a component of its own that renders `null`, as siblings of `children` — so an injected effect keeps running when the tree below it unmounts, and the file needs no JSX.

## Hooks

| hook              | holds                                                         |
| ----------------- | ------------------------------------------------------------- |
| `useGraftStore`   | a value, with a way back to its default and a way to empty it |
| `useGraftDialog`  | whether something is open, and the payload it opened with     |
| `useGraftAlert`   | a question that resolves with its answer                      |
| `useGraftStep`    | a position in a sequence, clamped, with its history           |
| `useGraftCounter` | a countdown measured against the clock                        |
| `useGraftReload`  | a flag that goes up and comes back down after a delay         |
| `useGraftAuth`    | a credential and whether it is there                          |

Each returns a plain object and a stable `id` from `useId`.

## Built with

React 19 and TypeScript. No dependencies.

## Approach

- **A convention, not a framework.** A hook holds the feature, a provider mounts it, `use()` reads it, `inject` carries its side effects. Past those four names nothing is prescribed.
- **Logic only.** Nothing here renders, touches the DOM or reaches for a platform API. What a dialog looks like, and when its content leaves the screen, belongs to your UI.
- **Atomic, never global.** State lives in `useState` and `useRef` where the provider is. Two providers are two instances; unmount one and it is gone, with its effects.
- **Small on purpose.** Grafts are meant to be many and narrow. Granularity is what decides how much of the tree wakes up when something changes.
- **Plain React.** No proxies, no compiler, no subscription trick. The rules of hooks apply and the linter enforces them, `use()` included.

Conventions for contributing: [RULE.md](./RULE.md).

## License

[MIT](./LICENSE).
