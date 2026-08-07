# Conventions

How react-graft is written. The library is small on purpose, and these rules are what keeps it that way.

## The approach

**One convention, seven hooks.** Every hook returns an instance of the same shape — `id`, its state, its actions — so learning one teaches the others. A hook that needs its own shape is not a base: it is application code.

**The hook is the instance.** It renders nothing, creates no context, ships no provider and assumes no UI. What it returns is plain data, which is what makes it extensible.

**Grafting is a convention, not a contract.** A wrapper component calls the base hook, adds domain state, replaces actions through `graft`, and passes the result to a provider. There are no lifecycle hooks in the base — no `onBeforeClose`, no `onAfterOpen` — because the base must not know it is being extended. The rule that keeps this honest: **the base instance never leaves the wrapper.**

**Nothing on the read path.** Consumers use `createContext`, `useContext` and an accessor they wrote. This library never sits between the provider and the consumer, which is what leaves the door open to `use-context-selector` and friends.

## Files

One folder per hook, under `hooks/`, named in `snake_case`:

```
hooks/dialog/
  dialog.ts     the hook
  type.ts       its instance and its options
```

Shared logic lives in `utils/`, one folder per concern, with the same split. Nothing else: no barrel per folder, no index files except the root one.

## Naming

| what          | convention              | example                    |
| ------------- | ----------------------- | -------------------------- |
| folder, file  | `snake_case`            | `hooks/dialog/dialog.ts`|
| hook          | `useGraft<Name>`      | `useGraftDialog`         |
| instance type | `Graft<Name>`         | `GraftDialog`            |
| options type  | `UseGraft<Name>Options`| `UseGraftDialogOptions` |
| helper        | `camelCase`             | `sanitizeSyntheticEvent`   |

Three words are kept apart on purpose, and the documentation uses them the same way: an **instance** is what a hook returns, a **Provider** is the wrapper component that extends it, a **Context** is what `createContext` makes.

Actions are named for what they do to the state, and stay symmetrical: `open`/`close`, `start`/`reset`, `onAuth`/`onAuthRevoke`. A boolean that describes the instance starts with `is`.

## Options

Every option is optional and has a default, so a hook never throws for missing input. Options are passed as a single object with a default of `{}`, so `useGraftDialog()` is always valid.

An option earns its place only if it cannot be obtained by composing. A dialog with a live payload is `useGraftDialog` plus `useGraftStore`, not a `reactiveStorage` flag.

## State

**Each hook declares its reactivity profile, and it is public API.** `storage` is a ref because a dialog must not see its payload change while open; `value` is state because a store must. Write it down in the documentation of every hook: it is the thing consumers plan around.

**The returned object is rebuilt on every render**, and no hook memoizes it. This is deliberate: a value read from a ref cannot appear in a dependency array, so a memo would go stale exactly when the payload changes. Re-render control belongs to the consumer.

**Nothing touches the platform.** No `window`, no `document`, no storage, no navigation. Persistence is done by the consumer and handed back through `defaultValue`; that is what lets the same code run under React Native.

## Types

Instance types are exported from the root, because consumers build on them — `Grafted<TBase, TOwn>` is the foundation the extension pattern rests on, the same way `TagProps<T, OwnProps>` works in react-renderable.

Generics stay inferred: `useGraftDialog<User>()` annotates the payload once, and `storage` follows. An options type is generic only if a generic actually appears in it.

Type assertions are allowed only where TypeScript cannot follow a generic through, and they live in one place instead of being repeated.

## Comments

The reasoning lives in the documentation site. In the code, comment only what is genuinely surprising.

## Breaking changes

Renaming an action, changing a default, or moving a field between state and ref are all breaking — consumers rely on the reactivity profile as much as on the shape. They ship with a major changeset that says what to rename.
