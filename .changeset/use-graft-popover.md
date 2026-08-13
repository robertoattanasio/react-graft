---
"react-graft": minor
---

`useGraftPopover` added: the same shape as `useGraftDialog` — `isActive`, `storage`, `open`, `close` and `id` — plus an `anchorRef` for the element that opens it. The ref is created and handed over, never read: it is typed by the caller through a second type parameter (`useGraftPopover<Payload, HTMLButtonElement>`), so a renderer that needs the trigger has it and one that leans on the layout around it can ignore it.

The rule on what a hook may hold now says renderer instead of element: the package depends on `react` and never on `react-dom`, and nothing in it names a type that belongs to one platform. A ref is state like any other — a hook may carry one, as long as it does not know what will end up inside it.
