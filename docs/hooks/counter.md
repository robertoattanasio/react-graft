# useGraftCounter

A countdown in seconds.

```ts
useGraftCounter(options?: UseGraftCounterOptions): GraftCounter
```

| Option         | Type             | Default |                                                     |
| -------------- | ---------------- | ------- | --------------------------------------------------- |
| `duration`     | `number`         | `30`    | seconds `start()` counts from                       |
| `defaultValue` | `number \| null` | `null`  | seconds to count from on load, `duration` if `null` |
| `startOnLoad`  | `boolean`        | `false` | starts counting on mount                            |

| Field        | Type                         |                                              |
| ------------ | ---------------------------- | -------------------------------------------- |
| `id`         | `string`                     | from `useId`                                 |
| `counter`    | `number`                     | seconds left, `0` when stopped               |
| `duration`   | `number`                     |                                              |
| `isCounting` | `boolean`                    |                                              |
| `start`      | `(seconds?: number) => void` | starts from `seconds`, `duration` by default |
| `reset`      | `() => void`                 | stops and sets `counter` to `0`              |

## Behavior

- Counts against a deadline, not by decrementing: a throttled background tab doesn't slow it down.
- Ticks once a second, and stops by itself at `0`.
- `start()` while counting restarts from the new value. `start(0)` does nothing.
- `defaultValue` is read only with `startOnLoad`.

## Example

```tsx
const { counter, isCounting, start } = GraftResend.use();

<button disabled={isCounting} onClick={() => start()}>
  {isCounting ? `Resend in ${counter}s` : "Resend code"}
</button>;
```
