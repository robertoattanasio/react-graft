---
"react-graft": minor
---

The eight state hooks are back, from their own entry: `react-graft/hooks`.

`useGraftAlert`, `useGraftAuth`, `useGraftCounter`, `useGraftDialog`, `useGraftPopover`, `useGraftReload`, `useGraftStep` and `useGraftStore`, with their types. Each returns one object with an `id` from `useId`, ready to be the `graft` of `createGraft`. The root entry is unchanged: `react-graft` still exports only `createGraft`, and a project that never imports `react-graft/hooks` never loads them.

Two fixes over the hooks removed in 1.0.0:

- `useGraftDialog`, `useGraftPopover` and `useGraftAlert` keep the payload in state, so calling `open` with a new payload while already open re-renders with it.
- `useGraftStep` updates `history` together with `step`, instead of one render later.
