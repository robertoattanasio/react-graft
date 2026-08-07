# react-graft

Small state hooks for React, built to be grafted onto: extend an instance, override an action, share it as a context.

Documentation: [dev.robertoattanasio.com/react-graft](https://dev.robertoattanasio.com/react-graft)

## Install

```sh
npm install react-graft
```

## What you get

Seven hooks, each holding one recurring piece of interaction state and nothing else. `useGraftDialog`, `useGraftAlert` for things that open and close. `useGraftStore`, `useGraftAuth` for values that are held. `useGraftTab`, `useGraftCounter`, `useGraftReload` for state that moves on its own. Plus `graft`, which is how you extend one.

Every hook returns an instance of the same shape — `id`, its state, its actions — and renders nothing:

```tsx
const dialog = useGraftDialog<User>();

<button onClick={() => dialog.open(user)}>edit</button>;
{
  dialog.isActive && <UserModal user={dialog.storage} onClose={dialog.close} />;
}
```

## Grafting

An instance is plain data, so a wrapper of yours can take one, add its own state, replace an action, and pass the result down. That is the graft: a base you did not write and a scion you did, joined into one instance the consumer cannot tell apart.

```tsx
export type AgreementDialog = Grafted<
  GraftDialog<Agreement>,
  { close: (agreement?: Agreement | null, bypassBlocker?: boolean) => Promise<void> }
>;

export const AgreementDialogProvider = ({ children }: { children?: ReactNode }) => {
  const dialog = useGraftDialog<Agreement>();
  const alert = useGraftAlert();

  const close = useCallback(
    async (agreement?: Agreement | null, bypassBlocker = false) => {
      if (isLockedRef.current && !bypassBlocker) {
        const confirmed = await alert.open();
        if (!confirmed) return;
      }

      dialog.close();
    },
    [alert, dialog],
  );

  return (
    <AGREEMENT_DIALOG.Provider value={graft(dialog, { close })}>
      {children}
      {dialog.isActive && <Agreement />}
    </AGREEMENT_DIALOG.Provider>
  );
};
```

The consumer calls `close()` and never learns there is a base underneath. `dialog.close()` inside the override is the delegation back to it.

## Built with

React 19 and TypeScript, nothing else: no dependencies, no runtime beyond React itself. No `window`, no `document`, no storage — the same code runs on the web and on React Native. Published as compiled ESM with type declarations, and side-effect free.

## Approach

- **The hook is the instance.** It returns a flat object and renders nothing. No context is created, no provider is shipped, no UI is assumed.
- **Grafted, not configured.** A wrapper adds domain state and replaces actions; `Grafted<TBase, TOwn>` declares only the delta.
- **Consumed with React itself.** `createContext`, `useContext`, and an accessor of your own. Nothing from this library sits on the read path, so a context selector drops in unchanged.
- **Each hook declares its reactivity.** A dialog freezes the payload it was opened with; a store keeps its value live. What is missing is obtained by composing hooks, not by adding options.
- **The instance is rebuilt every render**, deliberately, because a frozen payload cannot be memoized soundly.
- **Platform-agnostic.** Persistence, scrolling and native APIs belong to the consumer.

Conventions for contributing: [RULE.md](./RULE.md).

## License

[MIT](./LICENSE).
