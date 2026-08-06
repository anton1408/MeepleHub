# @repo/ui-kit

This is a React UI component package for MeepleHub, built on top of React, Tailwind CSS, and Shadcn UI.

## Adding new components

This package uses Shadcn UI as a starting point for components, but each component is then refactored into the package's own convention.

**1. Scaffold with the Shadcn CLI.** The generated files land in `src/temp/` (see the aliases in `components.json`), which acts as a staging area:

```sh
pnpm dlx shadcn@latest add [component-name] --cwd packages/ui-kit
```

For example, to scaffold a button:

```sh
pnpm dlx shadcn@latest add button --cwd packages/ui-kit
```

**2. Refactor the scaffolded component into `src/ui/`.** Create a folder per component using the `Ui` prefix, and split it into dedicated files:

```
src/ui/UiButton/
├── UiButton.tsx        # Component markup and logic
├── UiButton.style.ts   # Styles extracted into a `cva` / style object (see note below)
└── index.ts            # Local re-export
```

**3. Re-export from the package entry point** so the component is available to consumers:

```ts
// src/index.ts
export { UiButton } from './ui/UiButton';
export type { TUiButton } from './ui/UiButton';
```

> **Note on styling:** Component styles currently use `cva` (class-variance-authority). This is temporary — they will be migrated to Tailwind Variants later.

## Scripts

The following scripts are available for development and testing:

- `pnpm lint`: Run code style linting.
- `pnpm check-types`: Run TypeScript type checking.
- `pnpm test`: Run tests (vitest).

> **Note on tests:** The testing setup is intentionally demonstrated on `UiButton` only. Other components are being added without tests for now to keep focus on building out the component library; tests will be added later once the project is more mature.

## Structure

- `src/ui/`: Component source code (one folder per component, `Ui`-prefixed).
- `src/style/`: Global styles and Tailwind configuration.
- `src/temp/`: Staging area for Shadcn CLI output plus shared helpers (e.g. the `cn` utility). Components are moved out of here into `src/ui/` during the refactor step.
- `src/index.ts`: Package entry point that re-exports the public components.
