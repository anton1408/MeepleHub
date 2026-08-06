# MeepleHub

MeepleHub is a pnpm/Turborepo monorepo.

## Requirements

- Node.js 18+
- pnpm 10.33.1 via Corepack

Enable Corepack if needed:

```sh
corepack enable
```

## Project Structure

```txt
apps/
  web/         Next.js web application
  mobile/      Reserved for a future mobile app
  storybook/   Reserved for future Storybook setup

packages/
  api/                  Reserved for shared API client code
  eslint-config/        Shared ESLint configs
  typescript-config/    Shared TypeScript configs
  ui/                   Shared React UI package
```

Dependency versions are centralized in `pnpm-workspace.yaml` using pnpm catalogs.

## Documentation

Architecture and product documentation lives in `apps/web/docs/architecture`:

- [Vision](apps/web/docs/architecture/vision.md) - product vision and goals
- [Domain Model](apps/web/docs/architecture/domain-model.md) - core entities and relationships
- [Information Architecture](apps/web/docs/architecture/information-architecture.md) - navigation and content structure
- [User Flows](apps/web/docs/architecture/user-flows.md) - key user journeys
- [Roadmap](apps/web/docs/architecture/roadmap.md) - planned work by phase

## Install

```sh
corepack pnpm install
```

## Development

Run the Next.js web app:

```sh
corepack pnpm dev:web
```

The web app runs at:

```txt
http://localhost:3000
```

## Scripts

Run all workspace builds:

```sh
corepack pnpm build
```

Run all workspace dev tasks:

```sh
corepack pnpm dev
```

Run lint checks:

```sh
corepack pnpm lint
```

Run TypeScript checks:

```sh
corepack pnpm check-types
```

Format TypeScript, TSX, and Markdown files:

```sh
corepack pnpm format
```

## Web App

`apps/web` is a Next.js App Router application.

Important files:

- `apps/web/src/app/layout.tsx` - root layout
- `apps/web/src/app/page.tsx` - home page
- `apps/web/src/app/globals.css` - global styles
- `apps/web/next.config.ts` - Next.js configuration

## UI Kit

`packages/ui-kit` is a shared React UI package. See the [UI Kit README](packages/ui-kit/README.md) for more information.
