---
"react-graft": major
---

`use()` returns a tracked snapshot: a component re-renders only when a field it read has changed, nested fields included, with no selectors and no `memo`, `useMemo` or `useCallback`. Functions in the value keep a stable identity and always call the latest render's function. The context holds a stable store, read through `useSyncExternalStore`, and the tracking is done by `proxy-compare`, the only dependency.

The API is unchanged. Upgrading: a component that read a field only inside an event handler used to see the latest value because it re-rendered with the provider; read that field in render, or call a function from the hook. See "Upgrading from 1.x" in the README.
