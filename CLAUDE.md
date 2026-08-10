# Demo Monorepo — Global Agent Guide

**Status:** Demo / unnamed product. Do not invent a product name; refer to the workspace as **Demo** until named.
**Role:** Fullstack agent — read structure first, match existing patterns, keep scope tight.
**Scope of this file:** Global workflow + monorepo layout only. Module patterns live in skills (do not duplicate them here).

---

## Workspace layout

```
NEXT/                          # workspace root (this CLAUDE.md)
├── CLAUDE.md                  # global guide (you are here)
├── skills-lock.json           # lockfile for installed .agents skills
├── .agents/skills/<name>/     # Agent Skills registry (vendor / shared domain)
├── .claude/skills/<module>/   # Claude skills (module patterns)
├── .cursor/rules/             # Cursor always-on / glob rules
├── .cursor/skills/<module>/   # Cursor skills (mirror of .claude/skills)
└── cms/                       # Next.js App Router UI (only module today)
    ├── package.json           # git root of the cms app
    └── src/
        ├── app/[locale]/     # locale-prefixed routes
        ├── components/        # layout + ui (shadcn)
        ├── hooks/
        ├── i18n/              # i18next server/client + locales
        ├── lib/
        └── proxy.ts           # locale redirect (Next.js proxy)
```

Future modules (`api/`, `tracker/`, …) may appear later. Until they exist: **do not scaffold them** unless the user asks. When they appear, add a matching skill under `.claude/skills/` and `.cursor/skills/`, then link them in the Skills table below.

New shared/vendor skills go under `.agents/skills/` and must be listed in `skills-lock.json` — do not hand-edit locked vendor skill bodies unless updating the install.

---

## Workflow

```
Task
├─ 1. Discovery (read before write)
│   ├─ identify module from path (today: cms/)
│   ├─ cd into that module before any git command (cms/ has its own .git)
│   ├─ load matching module skill + any .agents skill that fits (see Skills)
│   ├─ read existing files in the touched area; reuse patterns
│   └─ exit ✔ know exact files + pattern to reuse
│
├─ 2. Implementation
│   ├─ code only within discovered scope/pattern
│   ├─ handle errors/edge cases inline
│   ├─ no hardcoded secrets; sanitize external input
│   └─ exit ✔ builds clean, no new type/lint errors
│
├─ 3. Verification (real execution)
│   ├─ lint / type-check / build as applicable
│   ├─ manual run when UI/i18n changes
│   └─ exit ✔ observed output matches intent
│
└─ 4. Regression
    ├─ re-check adjacent routes/locales if touched
    └─ exit ✔ nothing obvious broken
```

⚠ "Done" = Phase 3 (+ 4 when relevant) with real checks — not from reading code alone.

## Core principles

- **Reuse > new code** — extend existing modules; no duplication
- **Match existing patterns** — no new conventions when one already exists
- **Scope discipline** — only what was requested
- **Structure first** — folder placement and naming before feature inventiveness
- **Security first** — no secrets in repo; never commit `.env`

## Definition of Done

```
[ ] read existing code first; reused/extended where possible
[ ] matches existing architecture/naming/folders
[ ] only required files touched
[ ] no hardcoded secrets
[ ] errors/edge cases handled
[ ] lint/type-check (and build when warranted) pass
[ ] no scope creep / no invented product naming
```

---

## Skills — routing

```
Tầng 1 — Deterministic (hooks/scripts) — add when needed; none required for Demo yet

Tầng 2 — Skill trigger (load in Discovery)
├─ .agents/skills/<name>/SKILL.md     → shared / vendor domain skills (locked via skills-lock.json)
│    frontmatter `description` = when to load
│    body + references/ = authoritative patterns for that domain
└─ .claude/skills/<name>/SKILL.md     → module patterns (mirrored under .cursor/skills/)
     frontmatter `description` = when to load
     body = module patterns + Never Do
     details → references/ (progressive disclosure)

Tầng 3 — Cross-cutting rules
├─ .claude/rules/*.md     → only if a fact applies to ≥2 skills and is not already in a SKILL.md
└─ .cursor/rules/*.mdc    → Cursor injection (structure, CodeGraph, module globs)
```

### How to use `.agents`

1. On Discovery, match the task against `.agents/skills/*/SKILL.md` descriptions (and `skills-lock.json` for the installed set).
2. **Read the matching `SKILL.md` before writing** — do not rely on training memory for Supabase/Postgres conventions.
3. Follow progressive disclosure: load `references/` files named by the skill (e.g. `security-rls-basics.md`) only for the active concern.
4. Module skill (`cms`) and `.agents` skills **stack**: UI work under `cms/` that touches Supabase → load `cms` **and** the relevant Supabase skill(s).
5. Prefer the skill’s own CLI/docs/MCP guidance over inventing API shapes.

### Skill table

| skill | path | when |
| ----- | ---- | ---- |
| `cms` | `.claude/skills/cms/` (+ `.cursor/skills/cms/`) | any work under `cms/` |
| `supabase` | `.agents/skills/supabase/` | ANY Supabase work: Database, Auth, Edge Functions, Realtime, Storage, Vectors, Cron, Queues; `supabase-js` / `@supabase/ssr`; RLS/JWT/sessions; Supabase CLI or MCP; migrations / schema / security audits |
| `supabase-postgres-best-practices` | `.agents/skills/supabase-postgres-best-practices/` | BEFORE writing/changing Postgres: tables/columns/types, schema, migrations, RLS + tests, indexes, triggers, functions, pg_cron/pgmq, pgvector, dumps/imports; also slow queries, locks, connection issues, wrong-tenant row visibility |

> Task spans multiple skill triggers → load & follow **all** matching skills (module + `.agents`), not just one.
> Installed `.agents` set is recorded in `skills-lock.json` (source: `supabase/agent-skills`).

---

## MCP / tools by phase

```
Discovery
├─ CodeGraph     → symbols, callers, impact (prefer over grep for structure)
└─ Filesystem

Implementation
├─ shadcn MCP    → when adding/changing ui components under cms/
├─ Supabase MCP  → when task matches supabase / postgres skills (verify schema, RLS, queries)
└─ Filesystem

Verification
├─ Playwright    → when browser verification is needed
└─ Supabase CLI / advisors → when skill says to verify DB/auth changes
```

> If a mapped tool is available for the phase → use it; do not assume.
> For Supabase: follow `.agents/skills/supabase/SKILL.md` (changelog + docs first; verify after change).

---

## Architecture (current)

```
cms/   Next.js 16 App Router + React 19 + Tailwind 4 + shadcn (base-nova)
       locale-prefixed UI only · no fraud decision engine · no RabbitMQ

data   Supabase / Postgres when introduced — govern via .agents skills above
```
