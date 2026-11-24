# MeepleHub API

The MeepleHub API is a NestJS 12 application running on the Express platform. It provides game data backed by PostgreSQL, integrates with BoardGameGeek (BGG), and supports user registration.

The API is part of the [MeepleHub monorepo](../../README.md). Product and architecture documentation is available in [`apps/web/docs`](../web/docs/architecture/).

## Current capabilities

- Reads games stored in PostgreSQL through Prisma.
- Searches BGG and fetches game details through a typed BGG client. A mock client is available for local development.
- Caches fetched game details in PostgreSQL and refreshes stale records. If BGG is unavailable, an existing cached record is returned; if no record exists, the API responds with `502 Bad Gateway`.
- Registers users with validated input and Argon2 password hashing. Registration responses include only selected public user fields; the password hash is never returned.
- Uses Vitest for unit tests and Supertest for HTTP/e2e tests.

## Requirements

- Node.js 24 or later
- pnpm 10.33.1 (managed through Corepack)
- Docker Desktop with Docker Compose

Install workspace dependencies from the repository root:

```sh
corepack pnpm install
```

## Local setup

1. Copy the root Compose environment example and the API environment example:

   ```powershell
   Copy-Item .env.example .env
   Copy-Item apps/api/.env.example apps/api/.env
   ```

   On macOS or Linux, use `cp .env.example .env` and `cp apps/api/.env.example apps/api/.env`.

2. Make sure `DATABASE_URL` in `apps/api/.env` uses the same username, password, database name, and host port as `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `POSTGRES_PORT` in the root `.env`. The examples use port `5433` on the host.

3. Start PostgreSQL from the repository root:

   ```sh
   docker compose up -d postgres
   docker compose ps
   ```

   Wait until the `postgres` service reports `healthy`.

4. Generate Prisma Client and apply the checked-in migrations:

   ```sh
   pnpm --filter @meeplehub/api exec prisma generate
   pnpm --filter @meeplehub/api exec prisma migrate dev
   ```

5. Start the API in watch mode:

   ```sh
   pnpm dev:api
   ```

The API listens on `http://localhost:8080` by default. Set `PORT` in `apps/api/.env` to change the port.

## Environment variables

The API reads its environment from `apps/api/.env` during local development. The root `.env` is used by Docker Compose for PostgreSQL container settings; it is separate from the API environment file.

| Variable                  | Example/default                                                     | Description                                                                                          |
| ------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `PORT`                    | `8080`                                                              | HTTP port used by the API.                                                                           |
| `DATABASE_URL`            | `postgresql://meeplehub:...@localhost:5433/meeplehub?schema=public` | PostgreSQL connection string. Its credentials and host port must match the root Compose environment. |
| `BGG_USE_MOCK`            | `1`                                                                 | Set to `1` to use local BGG fixtures. Set to another value to use the real client.                   |
| `BGG_API_TOKEN`           | empty in the example                                                | Required when the real BGG client is enabled.                                                        |
| `BGG_GAME_CACHE_TTL_DAYS` | `30`                                                                | Number of days before cached game details are considered stale. Must be a positive integer.          |

The root `.env.example` contains `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `POSTGRES_PORT` for Docker Compose. Do not commit local `.env` files or real API tokens.

### BoardGameGeek API access

To use the live BGG integration, sign in to BoardGameGeek and register your XML API use by following BGG's [XML API guide](https://boardgamegeek.com/using_the_xml_api). Put the authorization token issued for your use in `BGG_API_TOKEN` in `apps/api/.env`. Keep the token secret and out of version control. The local mock client (`BGG_USE_MOCK=1`) does not require a BGG token. Review the [BGG XML API terms of use](https://boardgamegeek.com/wiki/page/XML%20API%20Terms%20of%20Use) before using the integration.

## HTTP endpoints

### Games

| Method | Endpoint                    | Behavior                                                                                                                                                                              |
| ------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/games`                    | Returns games currently stored in the MeepleHub database, sorted by name.                                                                                                             |
| `GET`  | `/games/search?query=catan` | Searches BoardGameGeek. The query is trimmed and must not be empty; invalid input returns `400 Bad Request`.                                                                          |
| `GET`  | `/games/:id`                | Looks up a game by its numeric BGG ID. Returns a fresh cached record when available; otherwise fetches it from BGG and stores or refreshes it. Returns `404` if BGG has no such game. |

If BGG is unavailable while fetching a missing game, the API returns `502 Bad Gateway`. If a database record already exists but is stale, the API falls back to that record when BGG is unavailable.

Example requests:

```sh
curl.exe "http://localhost:8080/games"
curl.exe "http://localhost:8080/games/search?query=catan"
curl.exe "http://localhost:8080/games/13"
```

`curl.exe` is used in the examples because Windows PowerShell may define `curl` as an alias.

### Registration

`POST /auth/register` creates a user and returns HTTP `201 Created` on success.

Request body:

```json
{
  "email": "anton@example.com",
  "name": "Anton",
  "password": "safePassword123",
  "confirmPassword": "safePassword123",
  "bggUsername": "anton_bgg"
}
```

`bggUsername` is optional. Email is trimmed and converted to lowercase. The password must contain 8–20 characters, and `confirmPassword` must match it. The name must contain 3–20 characters. Invalid input returns `400 Bad Request`; an email that is already registered returns `409 Conflict`.

The response contains the user's `id`, `email`, `name`, optional `bggUsername`, and `createdAt`. It does not include the password or password hash.

PowerShell example:

```powershell
$body = @{
  email = "anton@example.com"
  name = "Anton"
  password = "safePassword123"
  confirmPassword = "safePassword123"
  bggUsername = "anton_bgg"
} | ConvertTo-Json -Compress

Invoke-WebRequest `
  -Uri "http://localhost:8080/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing
```

## Database

Prisma schema: [`prisma/schema.prisma`](prisma/schema.prisma). Checked-in migrations are in [`prisma/migrations`](prisma/migrations/).

The `Game` model keeps a MeepleHub identifier separate from the unique BGG ID and records when BGG data was last synchronized. The `User` model stores a unique email and an Argon2 password hash; user records are not yet connected to collections.

Useful commands from the repository root:

```sh
pnpm --filter @meeplehub/api exec prisma migrate status
pnpm --filter @meeplehub/api exec prisma migrate dev --name describe-your-change
pnpm --filter @meeplehub/api exec prisma generate
```

## Tests and quality checks

Run API checks from the repository root:

```sh
pnpm --filter @meeplehub/api test
pnpm --filter @meeplehub/api test:e2e
pnpm --filter @meeplehub/api lint
pnpm --filter @meeplehub/api check-types
pnpm --filter @meeplehub/api build
```

Unit tests cover services, controllers, DTO validation, cache freshness, and BGG client provider selection. HTTP/e2e tests exercise API routes with Supertest. The games HTTP tests use a mocked service, so they verify routing and request validation rather than a full request through PostgreSQL and BGG.

## Planned work

The following items are planned and are **not part of the current API implementation yet**:

- JWT-based access tokens, including the agreed automatic sign-in after registration.
- Login, password verification, authentication guards, and protected routes.
- User-owned game collections and collection management endpoints.
- Connecting the Next.js application to the API and handling API state in the frontend.
- Further security hardening, broader integration tests, and deployment.

See the [project roadmap](../web/docs/architecture/roadmap.md) for broader product plans.

## Package scripts

Run scripts from the repository root with `pnpm --filter @meeplehub/api <script>`:

| Script                             | Description                                   |
| ---------------------------------- | --------------------------------------------- |
| `dev`                              | Start NestJS in watch mode.                   |
| `build`                            | Compile the API into `dist/`.                 |
| `start`                            | Run the compiled API.                         |
| `test` / `test:watch` / `test:cov` | Run Vitest unit tests.                        |
| `test:e2e`                         | Run HTTP/e2e tests with Vitest and Supertest. |
| `lint`                             | Run ESLint.                                   |
| `check-types`                      | Run TypeScript type checking.                 |
