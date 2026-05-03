# BonusTracker Implementation Tasks

This file turns the approved plan into commit-sized tasks. Complete the tasks in order. Each task has a clear outcome, a verification step, and a suggested commit boundary.

## Progress Tracker

Mark a task complete only after its verification passes and the commit is created.

- [x] Task 1: Bootstrap the monorepo root
- [ ] Task 2: Create the workspace packages and base TypeScript config
- [ ] Task 3: Scaffold the Next.js web app for Vercel
- [ ] Task 4: Move the shared design tokens and global styles into packages/ui
- [ ] Task 5: Extract the core UI primitives into packages/ui
- [ ] Task 6: Add the Prisma database package and local development workflow
- [ ] Task 7: Implement the initial Prisma schema
- [ ] Task 8: Seed the database with v1 Ukrainian data
- [ ] Task 9: Add simple PIN authentication and session handling
- [ ] Task 10: Protect routes and add role-aware app shell
- [ ] Task 11: Implement admin reward management
- [ ] Task 12: Implement admin point award and deduction flow
- [ ] Task 13: Implement the user balance and history screens
- [ ] Task 14: Implement the exchange request and approval flow
- [ ] Task 15: Add PWA support
- [ ] Task 16: Deployment and production configuration
- [ ] Task 17: Final cleanup and migration closeout

## Working Rules

- Do one task per commit unless a task explicitly says otherwise.
- Do not start the next task until the current task verifies cleanly.
- Keep `_figma_design/` as the migration reference until the final cleanup task.
- Prefer the smallest working slice that satisfies the task and passes the listed checks.
- After verification and commit, change the matching checkbox in `Progress Tracker` from `[ ]` to `[x]`.

## Task 1: Bootstrap the monorepo root

Goal: convert the repository root into the actual pnpm workspace and Turborepo entrypoint.

Do:
- add a root `package.json`
- add a root `pnpm-workspace.yaml` covering `apps/*` and `packages/*`
- add `turbo.json`
- add shared scripts for `dev`, `build`, `lint`, and `typecheck`
- stop treating `_figma_design/` as the workspace root

Done when:
- `pnpm install` works from the repository root
- `pnpm turbo run build` resolves the workspace without configuration errors

Verify:
```bash
pnpm install
pnpm turbo run build
```

Suggested commit: `chore: bootstrap pnpm workspace and turborepo`

## Task 2: Create the workspace packages and base TypeScript config

Goal: establish the target monorepo shape without implementing app behavior yet.

Do:
- create `apps/web`
- create `packages/ui`
- create `packages/db`
- add shared TypeScript config where useful
- add package manifests with correct names and dependencies

Done when:
- the workspace contains the three target packages
- `pnpm turbo run build` can see all packages even if some are placeholders

Verify:
```bash
pnpm turbo run build
```

Suggested commit: `chore: create web ui and db workspaces`

## Task 3: Scaffold the Next.js web app for Vercel

Goal: replace the future Vite app target with a Next.js App Router app.

Do:
- initialize `apps/web` as a Next.js application
- use the App Router
- configure for Vercel deployment
- add a base layout and a working home page
- wire shared scripts into Turborepo

Done when:
- `pnpm --filter web dev` starts the app
- the home page renders successfully in the browser
- `pnpm --filter web build` succeeds

Verify:
```bash
pnpm --filter web build
```

Suggested commit: `feat: scaffold nextjs app router web app`

## Task 4: Move the shared design tokens and global styles into packages/ui

Goal: make the shared style layer reusable by the Next.js app.

Source files:
- `_figma_design/src/styles/index.css`
- `_figma_design/src/styles/tailwind.css`
- `_figma_design/src/styles/theme.css`
- `_figma_design/src/styles/fonts.css`

Do:
- create a style entrypoint in `packages/ui`
- migrate the token definitions and base typography rules
- adapt Tailwind scanning so the monorepo packages are visible
- choose an explicit app-level font strategy instead of carrying over the empty `fonts.css`

Done when:
- `apps/web` can import one shared stylesheet from `packages/ui`
- the token classes such as `bg-background` and `text-foreground` work in the web app

Verify:
```bash
pnpm --filter web build
```

Suggested commit: `feat: migrate shared design tokens to ui package`

## Task 5: Extract the core UI primitives into packages/ui

Goal: promote the reusable shadcn-style components into a shared library.

Source files:
- `_figma_design/src/app/components/ui/*`
- `_figma_design/src/app/components/figma/ImageWithFallback.tsx`

Do:
- migrate the `cn` helper
- migrate button, card, input, dialog, select, tabs, badge, toast, and other primitives needed first
- preserve the existing `class-variance-authority` and Radix UI patterns
- export the components cleanly from `packages/ui`

Done when:
- `apps/web` uses shared components from `packages/ui`
- there are no direct imports from `_figma_design/src/app/components/ui` in `apps/web`

Verify:
```bash
pnpm --filter web build
```

Suggested commit: `feat: extract shared ui primitives`

## Task 6: Add the Prisma database package and local development workflow

Goal: create the persistence layer for points, rewards, exchanges, and auth.

Do:
- set up Prisma in `packages/db`
- define the PostgreSQL datasource
- add the generated client workflow
- add local development instructions or scripts for PostgreSQL
- add `prisma validate`, migration, and seed scripts

Done when:
- Prisma validates successfully
- a local database can accept migrations from the workspace

Verify:
```bash
pnpm --filter db prisma validate
pnpm --filter db prisma migrate dev
```

Suggested commit: `feat: add prisma db package`

## Task 7: Implement the initial Prisma schema

Goal: model the domain requested in the brief plus the minimum auth support.

Required models:
- `User`
- `PointsLog`
- `RewardDefinition`
- `Exchange`

Do:
- add user role support for `ADMIN` and `USER`
- store hashed PINs, not plain text PINs
- relate points logs and exchanges to users
- snapshot exchange cost so reward edits do not rewrite history
- add timestamps and status fields needed for auditability

Done when:
- the schema matches the domain requirements
- a migration is generated successfully

Verify:
```bash
pnpm --filter db prisma validate
pnpm --filter db prisma migrate dev
```

Suggested commit: `feat: define bonus tracker prisma schema`

## Task 8: Seed the database with v1 Ukrainian data

Goal: create a useful v1 development dataset.

Do:
- seed one Admin account and one User account
- seed the initial reward definitions based on the prototype ideas
- keep Ukrainian names and copy for v1
- document the local development PIN values outside the committed database if needed

Done when:
- a fresh local database can be seeded end to end
- the app can rely on seeded rewards and users during development

Verify:
```bash
pnpm --filter db prisma db seed
```

Suggested commit: `feat: seed admin user and starter rewards`

## Task 9: Add simple PIN authentication and session handling

Goal: support a single household entry screen that resolves the session to Admin or User.

Do:
- build a single PIN entry page in `apps/web`
- compare the submitted PIN with the stored hash
- issue a signed HTTP-only session cookie
- expose the authenticated user and role on the server
- add logout

Done when:
- entering the Admin PIN creates an Admin session
- entering the User PIN creates a User session
- invalid PINs are rejected cleanly

Verify:
```bash
pnpm --filter web build
```

Manual check:
- log in with each PIN and confirm the role is resolved correctly

Suggested commit: `feat: implement pin authentication`

## Task 10: Protect routes and add role-aware app shell

Goal: ensure the web app exposes only the correct surfaces per role.

Do:
- add authenticated layouts or guards in the App Router
- redirect unauthenticated users to the PIN screen
- redirect authenticated users away from screens they should not access
- create the initial app shell for Admin and User views

Done when:
- direct navigation without a session redirects to login
- User cannot open Admin screens
- Admin cannot accidentally land on User-only flows unless intentionally supported

Verify:
```bash
pnpm --filter web build
```

Manual check:
- test route access as anonymous, Admin, and User

Suggested commit: `feat: add role-based routing and shell`

## Task 11: Implement admin reward management

Goal: let the parent manage the available bonuses.

Do:
- add reward list, create, edit, and deactivate flows
- validate server input
- persist via Prisma-backed server mutations
- show current cost in points and active state

Done when:
- Admin can manage reward definitions from the UI
- changes persist after refresh

Verify:
```bash
pnpm --filter web build
```

Manual check:
- create, edit, deactivate, and reload the rewards screen

Suggested commit: `feat: add admin reward crud`

## Task 12: Implement admin point award and deduction flow

Goal: move the existing local add-points behavior onto the server with audit history.

Do:
- add an Admin form to award or deduct points
- persist to `PointsLog`
- record who performed the action
- block invalid operations and validate the payload

Done when:
- Admin can award points and deduct points
- the resulting history persists after refresh

Verify:
```bash
pnpm --filter web build
```

Manual check:
- award points, deduct points, and confirm the history reflects both operations

Suggested commit: `feat: add admin points management`

## Task 13: Implement the user balance and history screens

Goal: give the child a server-backed view of earned and spent points.

Do:
- add a balance screen
- add a history screen backed by persisted records
- derive the current balance from approved logs and exchanges
- remove any remaining localStorage-based state from the new app

Done when:
- User can see the current balance and transaction history
- data remains correct after refresh and across sessions

Verify:
```bash
pnpm --filter web build
```

Manual check:
- sign in as User and confirm balance plus history match the database state

Suggested commit: `feat: add user balance and history views`

## Task 14: Implement the exchange request and approval flow

Goal: let the child request bonuses and keep parental control over approval.

Do:
- add the User reward catalog screen
- allow the User to request an exchange
- persist requests in `Exchange`
- add Admin approval or rejection actions
- update the derived balance only through approved server-side mutations

Done when:
- User can create a reward request
- Admin can approve or reject it
- reward history stays correct even after reward definition edits

Verify:
```bash
pnpm --filter web build
```

Manual check:
- request a reward, approve it as Admin, then confirm the User balance and history update correctly

Suggested commit: `feat: add exchange request and approval flow`

## Task 15: Add PWA support

Goal: make the app installable as a Progressive Web App.

Do:
- add a manifest
- add icons
- register the service worker through the chosen Next.js-compatible PWA solution
- cache the shell and static assets needed for installability

Done when:
- the app is installable on a supported mobile browser
- the manifest and service worker load in production mode

Verify:
```bash
pnpm --filter web build
pnpm --filter web start
```

Manual check:
- confirm installability in the browser and confirm the manifest is valid

Suggested commit: `feat: add pwa support`

## Task 16: Deployment and production configuration

Goal: make the app ready for Vercel preview and production deployment.

Do:
- document required environment variables
- verify production database and auth secret configuration
- ensure the build runs cleanly in production mode
- add any Vercel-specific config only if needed

Done when:
- a Vercel preview build can succeed with the documented environment

Verify:
```bash
pnpm turbo run build
```

Suggested commit: `chore: prepare vercel deployment configuration`

## Task 17: Final cleanup and migration closeout

Goal: remove ambiguity about what remains authoritative after the migration.

Do:
- confirm `apps/web` and `packages/ui` fully replace direct runtime dependence on `_figma_design/`
- archive, trim, or document `_figma_design/` as design reference only
- update the root README with the final development and deployment commands

Done when:
- the repository has one clear runtime path
- the documentation points contributors to the new monorepo packages

Verify:
```bash
pnpm turbo run build
```

Suggested commit: `chore: finalize migration from figma prototype`

## Final acceptance checklist

- Admin can log in with a PIN and manage rewards plus points.
- User can log in with a PIN and view balance, history, and reward requests.
- All balance and history data are server-backed.
- Prisma migrations and seed scripts work locally.
- The app builds successfully in the monorepo.
- The web app is installable as a PWA.
- The project is ready for Vercel deployment.
