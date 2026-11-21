# useGraftPopover

The open state of a popover, with a payload and a ref for its anchor.

```ts
useGraftPopover<T, E = unknown>(options?: UseGraftPopoverOptions): GraftPopover<T, E>
```

| Option           | Type      | Default |             |
| ---------------- | --------- | ------- | ----------- |
| `isActiveOnLoad` | `boolean` | `false` | starts open |

| Field       | Type                            |                                 |
| ----------- | ------------------------------- | ------------------------------- |
| `id`        | `string`                        | from `useId`, for `aria-*`      |
| `isActive`  | `boolean`                       | whether it's open               |
| `storage`   | `T \| null`                     | the payload of the last `open`  |
| `anchorRef` | `RefObject<E \| null>`          | attach it to the anchor element |
| `open`      | `(payload?: T \| null) => void` | opens it with a payload         |
| `close`     | `() => void`                    | closes it                       |

## Behavior

- Same as [useGraftDialog](./dialog.md), plus `anchorRef`. `E` is the anchor's type, such as `HTMLButtonElement`.
- Positioning is up to the consumer: the hook only holds the ref.

## Example

```tsx
export const GraftMenu = createGraft({ name: "GraftMenu", graft: useGraftPopover<string, HTMLButtonElement> });

const { anchorRef, open } = GraftMenu.use();

<button ref={anchorRef} onClick={() => open("sort")}>
  Sort
</button>;
```
