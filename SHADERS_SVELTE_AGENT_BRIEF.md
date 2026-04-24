# Agent Handoff: `@devmischief/shaders-svelte`

This document is the source of truth for continuing the Svelte wrapper package work.

## Primary Goal

Build and publish a Svelte package named `@devmischief/shaders-svelte` that provides Svelte-native components with an API close to `@paper-design/shaders-react`.

The first target component is `Dithering`.

---

## Product Intent

- Svelte developers should be able to install and use shader components easily:
  - `pnpm add @devmischief/shaders-svelte`
- They should not need to manually install core shaders unless they want to:
  - `@paper-design/shaders` is included as a package dependency in the wrapper package.
- API should feel familiar to users coming from `@paper-design/shaders-react`.

---

## Critical Constraints

1. Do not break the existing portfolio app in this repository.
2. Keep package work isolated from the app whenever possible.
3. Prefer developing/publishing the wrapper in a separate repo/folder from the portfolio app.
4. Keep Svelte code in Svelte 5 style (runes-compatible).

---

## Current Status (What has already been done)

A starter package scaffold was created previously with these key parts:

- `package.json` for `@devmischief/shaders-svelte`
- Svelte package config and tsconfig
- `src/lib/Dithering.svelte`
- `src/lib/internal/common.ts`
- `src/lib/index.ts`
- basic README

The wrapper logic includes:

- mounting `ShaderMount` from `@paper-design/shaders`
- mapping Dithering props to shader uniforms
- reactive uniform updates
- cleanup on component destroy

The portfolio app typecheck was run and passed after this work.

---

## Definition of Done (MVP)

The package is done for v0.1.0 when all items below are true:

1. `Dithering` component works in a clean SvelteKit demo app.
2. Public API is close to React equivalent:
   - `width`, `height`
   - `colorBack`, `colorFront`
   - `shape`, `type`, `size`
   - `speed`, `frame`
   - `scale`, `rotation`
   - `offsetX`, `offsetY`
   - `fit`, `worldWidth`, `worldHeight`, `originX`, `originY`
   - `minPixelRatio`, `maxPixelCount`
3. SSR-safe behavior (no client-only crashes on initial render).
4. `pnpm check` passes.
5. `pnpm build` passes and outputs distributable package artifacts.
6. README has install, usage, props table, and troubleshooting notes.
7. Package is publish-ready (`prepublishOnly`, exports, files list, metadata).

---

## Recommended Repo Structure

Use a dedicated repository (recommended) with this structure:

```txt
paper-design-shaders-svelte/
  package.json
  README.md
  svelte.config.js
  tsconfig.json
  src/
    lib/
      index.ts
      Dithering.svelte
      internal/
        common.ts
```

Optional:

- `examples/` demo app for local testing
- CI for `check` + `build`

---

## Implementation Guidance

### 1) Props/API parity

Mirror React naming as much as possible to reduce cognitive load for users.

### 2) Performance defaults

Set sensible defaults that avoid freezing/stutter on heavy pages:

- conservative `minPixelRatio`
- bounded `maxPixelCount`
- allow users to tune both

### 3) Lifecycle

- mount shader only in browser (`onMount`)
- update uniforms reactively
- dispose on unmount (`onDestroy`)

### 4) Type safety

- export useful public types from `index.ts`
- keep internal prop mapping strongly typed

### 5) Versioning

- Start at `0.0.1` or `0.1.0`
- use semver; avoid breaking API in patch releases

---

## Suggested Next Tasks (in order)

1. Ensure package is in its own repo/folder, not coupled to app workspace behavior.
2. Run clean install and ensure local scripts work:
   - `pnpm install`
   - `pnpm check`
   - `pnpm build`
3. Validate usage in a fresh SvelteKit test app.
4. Improve README (props table + examples + migration note from react wrapper).
5. Add second shader component (optional for v0.1, recommended for v0.2).
6. Publish:
   - `pnpm publish --access public`

---

## Publishing Checklist

- package name available on npm
- `README.md` complete and accurate
- exports and types correct
- no private/internal files in package tarball
- `pnpm build` and `pnpm check` both pass
- tested in a separate consumer project

---

## Non-Goals (for now)

- full wrapper coverage for every shader in first release
- custom design system/styling layer
- advanced editor/devtools integration

---

## Notes for Any New Agent

- Do not refactor the portfolio app unless explicitly asked.
- Keep all package work scoped to `@devmischief/shaders-svelte`.
- Preserve React-like API names unless there is a strong Svelte-specific reason.
- If changing prop names, document migration clearly.

