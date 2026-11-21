# useGraftStep

A step number between bounds, with the history of the steps reached.

```ts
useGraftStep(options?: UseGraftStepOptions): GraftStep
```

| Option         | Type     | Default     |                |
| -------------- | -------- | ----------- | -------------- |
| `defaultValue` | `number` | `0`         | the first step |
| `min`          | `number` | `-Infinity` |                |
| `max`          | `number` | `Infinity`  |                |

| Field     | Type                     |                                              |
| --------- | ------------------------ | -------------------------------------------- |
| `id`      | `string`                 | from `useId`                                 |
| `step`    | `number`                 | the current step                             |
| `min`     | `number`                 |                                              |
| `max`     | `number`                 |                                              |
| `history` | `readonly number[]`      | every step reached, in order, from the first |
| `setStep` | `(step: number) => void` | goes to a step                               |
| `onBack`  | `() => void`             | one step back                                |
| `onNext`  | `() => void`             | one step forward                             |

## Behavior

- Every move is clamped between `min` and `max`.
- A move that doesn't change the step, such as `onNext` at `max`, adds nothing to `history`.
- `history` is never trimmed: going back adds the step reached.

## Example

```tsx
export const GraftWizard = createGraft({ name: "GraftWizard", graft: useGraftStep });

<GraftWizard.Provider min={0} max={3}>
  <Wizard />
</GraftWizard.Provider>;
```
