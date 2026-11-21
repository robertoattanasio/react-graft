# useGraftDialog

The open state of a dialog, with a payload.

```ts
useGraftDialog<T>(options?: UseGraftDialogOptions): GraftDialog<T>
```

| Option           | Type      | Default |             |
| ---------------- | --------- | ------- | ----------- |
| `isActiveOnLoad` | `boolean` | `false` | starts open |

| Field      | Type                            |                                |
| ---------- | ------------------------------- | ------------------------------ |
| `id`       | `string`                        | from `useId`, for `aria-*`     |
| `isActive` | `boolean`                       | whether it's open              |
| `storage`  | `T \| null`                     | the payload of the last `open` |
| `open`     | `(payload?: T \| null) => void` | opens it with a payload        |
| `close`    | `() => void`                    | closes it                      |

## Behavior

- The payload lives in state: a new `open` on an open dialog re-renders it with the new payload.
- A React synthetic event passed as payload becomes `null`, so `onClick={open}` works.
- `storage` stays after closing, so the content doesn't vanish during a closing animation.

## Example

```tsx
export const GraftProject = createGraft({ name: "GraftProject", graft: useGraftDialog<Project> });

const { open } = GraftProject.use();

<button onClick={() => open(project)}>Details</button>;
```
