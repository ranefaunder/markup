# Faunder App Project Blueprint

Use this for a new browser-based product app. It is a shared baseline derived from Abblet and Cuukbuuk; adapt it to the product instead of copying either product wholesale.

## Default stack

- Bun for runtime, scripts, package management, and the HTTP server.
- TypeScript for server and client code.
- Preact, `preact-iso`, `htm`, and signals for an interactive browser application.
- Faunder UI CSS for product interfaces; use the `faunder-ui` skill. For Preact components that benefit from colocated markup and scoped CSS, use `preact-single-file-components`.
- Bun's built-in SQLite for local relational persistence when needed. Keep schema changes in ordered migrations and put SQL access in query modules; avoid adding an ORM by default.
- `bun test` is the existing unit-test convention. Add or use tests where appropriate to the app; do not create placeholder suites.

Prefer the current compatible dependency versions in the new app's own lockfile rather than copying old pinned versions from another project.

## Suggested repository shape

```text
AGENTS.md
README.md
.env.example
.gitignore
package.json
tsconfig.json
app/
  App.ts
  Layout.ts
  components/
  routes/                 # when route-level views need their own modules
  stores/
  lib/
server/
  server.ts
  api/
  routes/
    app.ts
    static.ts
  services/
  database/               # only when persistence is needed
    db.ts
    migrate.ts
    migrations/
    queries/
i18n/                     # when the app needs localization
static/
  styles/
test/                     # when tests are part of the project
types/
utils/
ops/                      # deployment, backups, or maintenance commands
```

For a Preact product app, the usual feature-oriented shape is:

```text
app/
  App.ts                  # client entry and route composition
  Layout.ts                # shared product shell
  components/<feature>/    # views and UI grouped by product area
  lib/                     # client-side helpers
  stores/                  # shared client state
utils/
  markup.ts                # app's shared `html` and `css` template helpers
server/
  server.ts                # Bun server entry and route registration
  api/<domain>/            # API handlers grouped by domain
  routes/
    app.ts                 # app page / server-side rendering
    static.ts              # static files such as CSS, images, and fonts
    ...                    # callback or additional page routes as needed
  services/<domain>/       # reusable server-side domain operations
  database/                # persistence modules, only when needed
```

Keep responsibilities clear:

- `app/` owns the Preact user interface; route views, components, stores, and small UI helpers stay separated by role.
- In Preact apps, components use the app's `utils/markup.ts` `html` and `css` helpers. Keep component-specific CSS in the component with a unique `data-scope` and native `@scope ([data-scope="Name"]) to ([data-scope])`; keep shared tokens and global rules in shared stylesheets. Do not bind `htm` directly in each component or create a competing markup helper.
- `server/api/` owns HTTP API handlers; `server/routes/` owns HTTP page and static-file routing; `server/services/` owns reusable domain operations. Keep the app page/SSR handler and static-file handler in separate route modules (for example, `server/routes/app.ts` and `server/routes/static.ts`) and register them from `server/server.ts`.
- `server/database/migrations/` changes the schema; `server/database/queries/` is the persistence boundary for application code.
- `i18n/`, `static/`, `test/`, `types/`, `utils/`, and `ops/` are added when they have real content. Avoid empty placeholder directories.
- Keep product rules out of generic helpers and HTTP route handlers where a domain service or query module is a better boundary.

## Development integration with the Faunder repository

The Faunder repository is a workspace and tools repository, not an app monorepo. Product repos are independent checkouts under `apps/`, which the parent repo excludes from tracking.

For each new app:

1. Give `package.json` a `dev` script; `dev.ts` discovers apps by this script.
2. Pick the next unused port aligned to a multiple of ten after checking `dev.ts` and listeners. Add the stable port to `dev.ts`'s `defaultPorts` map; do not rely on a secret-bearing `.env` to provide the default.
3. Use `https://<slug>.faunder.dev` as the local development hostname when the user has not specified another domain. Add its reverse-proxy site block to `caddy/dev/Caddyfile`, pointing at `127.0.0.1:<port>` and importing `dev_tls`.
4. Add the hostname to the root `AGENTS.md` development URL list and the app's own `AGENTS.md`. Include the app's `dev-<slug>.log` behavior in the app instructions.
5. Keep local secrets in ignored `.env` files; describe required names, never values, in `.env.example`.

Local DNS, certificate issuance, deployment, credentials, and public reachability are separate operational setup. Do not change router, DNS, Cloudflare, production services, or external repositories as an assumed part of creating the local project.

## Product-specific choices

Do not add features just because one reference project has them:

- Abblet's generated-app runtime, SDK, AI platform, billing, and runtime-origin security exist for Abblet's product model.
- Cuukbuuk's recipe, book, and library domains exist for Cuukbuuk.
- Authentication, PWA support, uploads, AI services, background workers, analytics, email, and deployment scripts are optional capabilities. Add each only when the new app needs it.
- A library, CLI, internal tool, or static site may need a smaller or different architecture; do not force the full web-app baseline on it. The app-level skill is distributed to these repos for shared guidance, but this browser-app shape applies only when it fits.
