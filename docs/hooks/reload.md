# useGraftReload

A flag that turns on, then off again after a delay: a way to unmount and mount a subtree again.

```ts
useGraftReload(options?: UseGraftReloadOptions): GraftReload
```

| Option  | Type     | Default |                                         |
| ------- | -------- | ------- | --------------------------------------- |
| `delay` | `number` | `0`     | milliseconds `isReloading` stays `true` |

| Field         | Type         |                              |
| ------------- | ------------ | ---------------------------- |
| `id`          | `string`     | from `useId`                 |
| `isReloading` | `boolean`    |                              |
| `onReload`    | `() => void` | sets `isReloading` to `true` |

## Behavior

- `isReloading` goes back to `false` after `delay`, in a timeout.
- Calling `onReload` while reloading does nothing more.

## Example

```tsx
const { isReloading, onReload } = GraftGallery.use();

{
  !isReloading && <Gallery />;
}
<button onClick={onReload}>Reload</button>;
```
