# useGraftAlert

A confirmation: `open` returns a promise that resolves with the answer.

```ts
useGraftAlert<T>(): GraftAlert<T>
```

| Field       | Type                                        |                                                       |
| ----------- | ------------------------------------------- | ----------------------------------------------------- |
| `id`        | `string`                                    | from `useId`, for `aria-*` attributes                 |
| `isActive`  | `boolean`                                   | whether it's open                                     |
| `storage`   | `T \| null`                                 | the payload of the last `open`                        |
| `open`      | `(payload?: T \| null) => Promise<boolean>` | opens it, resolves with the answer                    |
| `close`     | `(result?: boolean) => void`                | closes it, resolves with `result`, `false` by default |
| `onConfirm` | `() => void`                                | closes it, resolves `true`                            |
| `onDismiss` | `() => void`                                | closes it, resolves `false`                           |

## Behavior

- A new `open` while one is pending resolves the pending one with `false`.
- Unmounting resolves a pending `open` with `false`: an `await` never hangs.
- A React synthetic event passed as payload becomes `null`, so `onClick={open}` works.
- `storage` stays after closing, so the content doesn't vanish during a closing animation.

## Example

```tsx
export const GraftConfirm = createGraft({ name: "GraftConfirm", graft: useGraftAlert<string> });

const { open } = GraftConfirm.use();

if (await open("Delete this project?")) remove();
```
