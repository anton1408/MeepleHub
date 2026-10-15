# @meeplehub/api

MeepleHub backend — a [NestJS](https://nestjs.com) 12 application (Express platform, native ESM).

It is currently the default Nest starter (`GET /` → `Hello World!`), wired into the monorepo tooling. See the [Roadmap](../web/docs/architecture/roadmap.md) for planned work.

## Development

Run from the repository root:

```sh
pnpm dev:api
```

Or start every app at once (web + api) via Turborepo:

```sh
pnpm dev
```

The API runs at:

```txt
http://localhost:8080
```

Quick check (PowerShell needs `curl.exe`, since `curl` is an alias for `Invoke-WebRequest`):

```sh
curl.exe http://localhost:8080
```

## Environment variables

| Variable | Default | Description                                                       |
| -------- | ------- | ----------------------------------------------------------------- |
| `PORT`   | `8080`  | HTTP port. Hosting platforms (Render, Railway, Fly.io) inject it. |

Nest does **not** load `.env` files on its own — set variables in the shell for now. `@nestjs/config` will be added once the app needs real configuration (database URL, tokens).

Turborepo runs tasks in strict env mode, so every variable the API reads must be declared in [`turbo.json`](turbo.json) (`passThroughEnv` for runtime-only values). The `turbo/no-undeclared-env-vars` lint rule enforces this.

## Scripts

Run with `pnpm --filter @meeplehub/api <script>` from the root, or `pnpm <script>` inside `apps/api`.

- `dev`: Start in watch mode (recompiles and restarts on save).
- `dev:debug`: Watch mode with the Node inspector attached.
- `build`: Compile to `dist/` (`nest build`, uses `tsconfig.build.json`).
- `start`: Run the compiled app (`node dist/main`) — the production entry point.
- `lint`: ESLint with the shared `@meeplehub/eslint-config` (type-aware, `--max-warnings 0`).
- `check-types`: TypeScript type checking.
- `test` / `test:watch` / `test:cov`: Unit tests (Vitest, `src/**/*.spec.ts`).
- `test:e2e`: End-to-end tests (Vitest + Supertest, `test/**/*.e2e-spec.ts`).

## Structure

- `src/main.ts`: Bootstrap — creates the Nest app and listens on `PORT`.
- `src/app.module.ts`: Root module.
- `src/app.controller.ts` / `src/app.service.ts`: Starter controller and service.
- `src/*.spec.ts`: Unit tests, colocated with the code.
- `test/`: End-to-end tests.
- `nest-cli.json`: Nest CLI config (`nest build`, `nest generate`).
- `tsconfig.json` / `tsconfig.build.json`: Type checking (all files) / build (`src` only, specs excluded).
- `turbo.json`: Package-level Turborepo overrides (extends the root config).
- `eslint.config.mjs`: Shared base config + type-aware rules (`no-floating-promises`).

## Conventions

- **ESM imports need the `.js` extension** for local files (`import { AppService } from './app.service.js'`), because the project uses `"type": "module"` with `nodenext` module resolution. TypeScript maps `.js` to the `.ts` source.
- **Generate code with the Nest CLI** instead of creating files by hand:

  ```sh
  pnpm --filter @meeplehub/api exec nest generate module games
  ```

- **No floating promises**: every promise must be awaited (or explicitly `void`-ed) — enforced by ESLint.
