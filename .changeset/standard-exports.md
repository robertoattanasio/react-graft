---
"react-graft": patch
---

Remove the `development` condition from `exports`. Bundlers in development mode received the TypeScript source instead of the compiled build; every environment now resolves `dist`.
