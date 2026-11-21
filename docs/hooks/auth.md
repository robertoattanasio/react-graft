# useGraftAuth

A token, and whether there is one.

```ts
useGraftAuth<T = string>(options?: UseGraftAuthOptions<T>): GraftAuth<T>
```

| Option         | Type        | Default |                   |
| -------------- | ----------- | ------- | ----------------- |
| `defaultValue` | `T \| null` | `null`  | the initial token |

| Field          | Type                 |                        |
| -------------- | -------------------- | ---------------------- |
| `id`           | `string`             | from `useId`           |
| `token`        | `T \| null`          |                        |
| `isAuthorized` | `boolean`            | `token !== null`       |
| `onAuth`       | `(token: T) => void` | sets the token         |
| `onAuthRevoke` | `() => void`         | sets it back to `null` |

## Behavior

- State only: storing the token, in a cookie or `localStorage`, is up to the consumer, for example in an [injected](../inject.md) hook.

## Example

```tsx
export const GraftSession = createGraft({ name: "GraftSession", graft: useGraftAuth });

const { isAuthorized, onAuthRevoke } = GraftSession.use();
```
