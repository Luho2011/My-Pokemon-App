# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — runs `prisma generate` then `next build` (ESLint is ignored during builds via `next.config.ts`)
- `npm run lint` — ESLint
- `npx prisma migrate dev` / `npx prisma db push` — apply `prisma/schema.prisma` changes (no migrations are checked in; no test suite exists)

Requires `DATABASE_URL` (PostgreSQL) in `.env`.

## Architecture

A Pokémon Soul Link run tracker (Next.js App Router, React 19, Tailwind 4, Prisma + PostgreSQL, `@dnd-kit` for drag-and-drop). UI text is partly German.

- **Run lifecycle:** `app/page.tsx` has a server action that creates a `Run` and redirects to `/run/[id]`. That page ([app/run/[id]/page.tsx](app/run/[id]/page.tsx)) is a single large client component: it loads the run via `GET /api/run/[id]` (returns run with `pokemon` and `routes`), groups Pokémon by `slot` into a `board` state, and renders a `DndContext` with one `SoulLinkColumn` per player (`player1`–`player4`) plus a `death` list.
- **Persistence:** UI state is optimistic client state; changes are written via REST handlers in `app/api/`: `pokemon/create` (new Pokémon always starts in slot `"bench"`), `pokemon/move` (updates `slot` by `instanceId` after a drop), `routes/create`. There is no delete/update endpoint for routes.
- **Data model** ([prisma/schema.prisma](prisma/schema.prisma)): `Run` → many `Pokemon` and `Route`. `Pokemon.slot` is a free-form string (`player1..4 | death | bench`), not an enum; `instanceId` (a client-generated UUID) is the unique key used for moves, not `id`. The `Status` enum is currently unused.
- **Pokémon data:** `lib/pokemon.ts` fetches the first 151 from PokeAPI; `lib/pokemon-names.ts` maps German→English names so search accepts either (`normalizePokemonQuery`). `lib/createPokemon.ts` builds a Pokémon object (sprite URL derived from the PokeAPI id in the URL).
- **Prisma client:** always import the singleton from `@/lib/prisma` (cached on `globalThis` in dev). Path alias `@/` maps to the repo root.

## Caveat

`AGENTS.md` says this Next.js version has breaking changes and to read `node_modules/next/dist/docs/`, but that directory does not exist in the installed `next@15.5.15`; verify APIs against the installed package. Note that existing route handlers use `params.id` synchronously (e.g. `app/api/run/[id]/route.ts`), whereas Next 15 passes `params` as a Promise.
