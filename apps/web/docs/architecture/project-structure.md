# Project Structure

> Snapshot of the **actual** repository layout (kept in sync with the tree on disk).
> This is the source of truth for the file/folder structure — hand this to any tool or
> agent that needs an accurate map of the monorepo.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo (`turbo.json`, `pnpm-workspace.yaml` with a version `catalog`).
- **Web:** Next.js (App Router), React 19, Tailwind CSS v4.
- **UI kit:** React + Tailwind + Shadcn UI (as a scaffolding source only — see conventions).
- **i18n:** shared locale package (`en`, `uk`).
- **Tooling:** ESLint (flat config), Prettier, Husky (pre-commit: `check-types` + `format:check`), Vitest.

## Workspace layout

```
MeepleHub/
├── apps/
│   ├── web/                                # @meeplehub/web — Next.js App Router
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── globals.css
│   │   │   ├── styles/
│   │   │   │   └── theme.css                # app-level theme (moved here from ui-kit)
│   │   │   └── widgets/                     # FSD layer — only `header` exists so far
│   │   │       └── header/
│   │   │           ├── index.ts
│   │   │           └── ui/
│   │   │               └── Header.tsx
│   │   │   # NOTE: features/ · entities/ · shared/ · middleware.ts are planned (FSD) but NOT created yet
│   │   │
│   │   ├── docs/
│   │   │   └── architecture/
│   │   │       ├── vision.md
│   │   │       ├── domain-model.md
│   │   │       ├── information-architecture.md
│   │   │       ├── user-flows.md
│   │   │       ├── roadmap.md
│   │   │       └── project-structure.md     # this file
│   │   │
│   │   ├── next.config.ts
│   │   ├── next-env.d.ts
│   │   ├── postcss.config.mjs
│   │   ├── eslint.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── mobile/                             # placeholder (.gitkeep) — React Native, future
│   └── storybook/                         # placeholder (.gitkeep) — Storybook, future
│
├── packages/
│   ├── ui-kit/                             # @meeplehub/ui-kit — shared UI library
│   │   ├── src/
│   │   │   ├── ui/                          # one folder per component, `Ui`-prefixed
│   │   │   │   ├── UiButton/                # ⭐ reference component (see conventions)
│   │   │   │   │   ├── UiButton.tsx
│   │   │   │   │   ├── UiButton.style.ts    # styles via `cva` (→ Tailwind Variants later)
│   │   │   │   │   ├── UiButton.test.tsx    # the ONLY component with tests (demo)
│   │   │   │   │   └── index.ts
│   │   │   │   └── UiCard/
│   │   │   │       ├── UiCard.tsx
│   │   │   │       ├── UiCard.style.ts
│   │   │   │       └── index.ts
│   │   │   ├── style/
│   │   │   │   ├── index.css
│   │   │   │   └── theme.css
│   │   │   ├── temp/                        # staging area for Shadcn CLI output + shared helpers
│   │   │   │   └── utils.ts                 # `cn()` helper (clsx + tailwind-merge)
│   │   │   ├── feature/                     # placeholder (.gitkeep)
│   │   │   └── index.ts                     # public entry point (re-exports)
│   │   │
│   │   ├── components.json                  # Shadcn UI config (CLI outputs into src/temp)
│   │   ├── vitest.config.ts
│   │   ├── vitest.setup.ts
│   │   ├── eslint.config.mjs
│   │   ├── tsconfig.json
│   │   ├── README.md
│   │   └── package.json
│   │
│   ├── i18n/                               # @meeplehub/i18n — shared localization
│   │   ├── src/
│   │   │   ├── locales/
│   │   │   │   ├── en/common.json
│   │   │   │   └── uk/common.json
│   │   │   ├── i18n.ts
│   │   │   ├── locales.ts
│   │   │   ├── resources.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── api/                                # placeholder (.gitkeep) — shared API client, future
│   ├── eslint-config/                     # base.js · next.js · react-internal.js
│   └── typescript-config/                 # base.json · nextjs.json · react-library.json
│
├── .husky/
│   └── pre-commit                          # check-types + format:check
│
├── package.json                            # @meeplehub/monorepo (root)
├── pnpm-workspace.yaml                     # workspaces + version catalog
├── turbo.json
├── prettier.config.js
├── .prettierignore
├── .gitignore
└── README.md
```

## Conventions

### UI-kit component workflow

`UiButton` is the **reference implementation** — the template every future component
should follow. It is intentionally the only fully built-out example for now; other
components are added the same way, one at a time, as they are needed.

Components are **customized, not vendored as-is**. The flow is:

1. **Scaffold** with the Shadcn CLI — output lands in `src/temp/` (the staging area):
   ```sh
   pnpm dlx shadcn@latest add [component-name] --cwd packages/ui-kit
   ```
2. **Manually move & refactor** the component out of `src/temp/` into `src/ui/`, adapting
   it to the project's own convention (this manual step is where customization happens —
   the raw Shadcn output is never used directly). Each component becomes a `Ui`-prefixed
   folder:
   ```
   src/ui/UiButton/
   ├── UiButton.tsx        # markup + logic
   ├── UiButton.style.ts   # styles extracted into a `cva` / style object
   └── index.ts            # local re-export
   ```
3. **Re-export** from `src/index.ts` so consumers can import it.

Notes:

- **Styling:** currently `cva` (class-variance-authority); migration to Tailwind Variants planned.
- **Tests:** demonstrated on `UiButton` only — other components are added without tests for now; tests come later once the library matures.
- `src/temp/` also holds shared helpers that haven't been given a permanent home yet (e.g. `cn`).

### Package naming

- Root: `@meeplehub/monorepo`; web app: `@meeplehub/web`.
- Shared packages use the `@meeplehub/*` scope: `@meeplehub/ui-kit`, `@meeplehub/i18n`.

### Web app (FSD)

The web app follows Feature-Sliced Design. Only the `widgets` layer (with `header`) exists
today. `features/`, `entities/`, `shared/` and `middleware.ts` are planned and will be added
as the product grows.

## Placeholders (exist as `.gitkeep`, not yet implemented)

- `apps/mobile/` — React Native (future)
- `apps/storybook/` — Storybook (future)
- `packages/api/` — shared API client (future)
- `packages/ui-kit/src/feature/` — reserved
