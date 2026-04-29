
# ATS — Application Tracking System

A simplified job board built with React + Phoenix/Elixir.

-   **Unauthenticated users** can browse and search job listings, and apply to a job.
-   **Authenticated users** can create, edit, and delete job offers, and view applicants per job.

## Repository Structure

This is a monorepo containing both frontend and backend:

-   **`/frontend`** — React 19 + TypeScript + Vite
-   **`/` (root)** — Phoenix/Elixir REST API + PostgreSQL

----------

## Setup

### Prerequisites

We recommend [asdf](http://asdf-vm.com/guide/getting-started.html) to manage language versions. The required versions are declared in `.tool-versions`.

```bash
asdf plugin add erlang https://github.com/asdf-vm/asdf-erlang.git
asdf plugin add elixir https://github.com/asdf-vm/asdf-elixir.git
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf install

```

### Backend

**1. Install Elixir dependencies**

```bash
mix deps.get

```

**2. Set up the database**

The backend expects a PostgreSQL instance. You can use the included Docker Compose file:

```bash
docker-compose up -d

```

This starts Postgres on port `5432` with user/password `postgres`. The database config lives in `config/dev.exs` — update it if your local setup differs.

**3. Create, migrate, and seed the database**

```bash
mix ecto.setup

```

This runs `ecto.create`, `ecto.migrate`, and `seeds.exs` (which inserts sample jobs, professions, and candidates).

**4. Run backend tests**

```bash
mix test

```

**5. Start the Phoenix server**

```bash
mix phx.server

```

The API will be available at `http://localhost:4000`.

----------

### Frontend

To run the frontend open a new terminal from the root folder

```bash
cd frontend
corepack enable
yarn install
yarn dev

```

**Start the dev server**

```bash
yarn dev

```

The app will be available at `http://localhost:5173`.

**Run frontend tests**

```bash
yarn test

```

----------


## Technical Decisions

### State management — React Query

Used `@tanstack/react-query` for all server state. It handles caching, loading/error states, and cache invalidation after mutations, which removes the need for any manual `useEffect`-based data fetching. It also makes the files more readable and shorter. All Apis were converted to using reactQuery Hooks

### Auth — cookie-based with `useMe`

Authentication state is derived from a `user-token` cookie set by the backend. A `useMe` hook wraps the `/api/me` call with React Query, making the current user available reactively across the app without prop drilling or a context provider.

### Type safety

Union types (`ContractType`, `StatusType`, `WorkModeType`) are defined once in `types/types.ts` and referenced by both the `Job` type and the select option arrays in `utils/jobMap.ts`. This ensures the form options and the API types stay in sync.

### Search — backend-driven

Search and filtering is handled entirely on the backend via composable Ecto query filters. The frontend sends query parameters and React Query re-fetches when they change, so no client-side filtering logic is needed.

### Libraries added

-   `@tanstack/react-query` — server state, caching, mutations
-   `js-cookie` — read auth cookies set by the Phoenix backend

----------

## What I Would Do With More Time

-   Add route guards to redirect unauthenticated users away from `/jobs/new` and `/jobs/:id/update`
-   Add a profession selector to the Create/Update job forms
-   Improve test coverage — particularly for `JobDetail` and the search filtering behavior
- Improve mock data in tests for more uniform experience
-   Add loading skeletons instead of full-page spinners for a better UX
-   Incorporate pagination
-   Make components more accessible with a11y

----------

## LLM Usage

Claude was used to assist with:
-   Typing the select option arrays and union types
-   Refactoring auth state into the `useMe` hook with React Query
-   Fixing error in test cases
-   Vibe code the introduction to starting the backend
