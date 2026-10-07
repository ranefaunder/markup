---
name: faunder-stack
description: Follow shared Faunder app architecture and development conventions. Use when scaffolding a new product from the Faunder repository or changing an existing app's architecture; not for routine feature work.
---

# Faunder Stack

This skill defines shared Faunder application architecture and development conventions. It is available both in the Faunder repository and in each app repository.

- From the Faunder repository, use it to scaffold a new product app.
- From an app repository, use it when evaluating or changing architecture. Preserve that app's established structure and apply the blueprint selectively.
- Do not use it for routine feature changes that do not affect architecture.

## Sources and skill distribution

- Canonical skill sources live in `stack/skills/`.
- Edit a skill at its source there, then run `bun stack/sync-skills.ts` to copy it to the Faunder `.agents/skills/` directory and the app repositories listed in `stack/skills.json`.
- Run `bun stack/sync-skills.ts --check` to report drift without writing files.
- Never edit a synchronized copy as the only source of a lasting change. Add or change the source and sync it.
- The manifest is the distribution boundary: only skills listed for an app are copied to it. Keep app-specific skills scoped to their app.

## Start a new application

1. Establish the app's name, short purpose, intended user, and first useful workflow from the request. Use reasonable defaults for details that do not block a useful start; ask only for missing decisions that materially change the architecture or product.
2. Read [the project blueprint](references/project-blueprint.md), the root `AGENTS.md`, `dev.ts`, and `caddy/dev/Caddyfile`. Check current app folders, ports, domains, and any existing repository before creating files.
3. Keep each product app in its own repository under `apps/<slug>/`. Reuse or clone its existing remote repository if one exists. For a genuinely new app, initialize a separate local Git repository there; create or change a hosted GitHub repository only when the user asks for that external action.
4. Use the blueprint's shared architecture as a starting point, then include only the systems the product needs. Abblet and Cuukbuuk demonstrate useful boundaries, not business features to copy: do not add Abblet's generated-app platform/SDK or Cuukbuuk's recipe domain unless requested.
5. Set up the smallest runnable vertical slice: Bun + TypeScript server, Preact UI with the existing Faunder patterns when the product is a web app, and a clear development command. Add SQLite migrations and query modules when the app needs persistence. Keep secrets out of source control and provide `.env.example` for required configuration.
6. Integrate the app with the Faunder development workspace: choose a free port, add it to `dev.ts`'s `defaultPorts`, add the `<slug>.faunder.dev` HTTPS reverse-proxy block to `caddy/dev/Caddyfile`, and record the URL in root and app `AGENTS.md`. Ensure `package.json` has a `dev` script so the workspace launcher discovers the app. Keep generated app logs at the app repository root as `dev-<slug>.log`.
7. Add only project-specific instructions to the app's `AGENTS.md`. The shared `faunder-stack` skill is distributed to apps for architectural guidance; keep its new-project scaffolding workflow scoped to the Faunder repository.
8. Summarize the created structure, app repository path, development URL and port, required local configuration, and any unfinished setup. Do not push, deploy, or create external resources unless the user requested them.

## Existing app work

When asked to change an existing app's architecture, first inspect that app's own repository and preserve its current conventions. Use the blueprint to explain or coordinate cross-project conventions; do not rewrite an app to match it mechanically. The blueprint is primarily for browser product apps; CLI tools, component libraries, and static sites may need different structures.
