---
name: cms
description: >-
  Use whenever writing, reviewing, or debugging code inside the Demo `cms/`
  Next.js App Router app — locale-prefixed UI with i18next and shadcn.
  Trigger on any task touching `cms/src/**`, `cms/components.json`, or cms
  package scripts: App Router pages under `src/app/[locale]/`, layout/header/footer,
  shadcn ui under `src/components/ui/`, feature/layout components, i18n
  (`src/i18n/**`, `locales/<lng>/<ns>.json`, LanguageSwitcher), `src/proxy.ts`
  locale redirects, hooks, or `@/*` path aliases — even when phrased as "add a
  page", "add a translated string", "wire a new locale", or "add a shadcn
  component". Covers the real directory layout, RSC vs client split, i18n
  server/client APIs, naming, and Never Do. Do NOT use for non-cms modules
  (they get their own skills when added). Skip for generic Next.js questions
  unrelated to this repo's `cms` app.
---

# CMS — Coding Skill (Demo)

**Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind 4, shadcn (`base-nova` / `@base-ui/react`), i18next + react-i18next, Lucide, React Compiler enabled.

**Git:** `cms/` is its own git root — run all git commands from `cms/`, not the workspace root.

**Stack with `.agents`:** If the task also touches Supabase / Postgres / Auth / RLS / migrations, load alongside this skill:
- `.agents/skills/supabase/SKILL.md`
- `.agents/skills/supabase-postgres-best-practices/SKILL.md` (schema, SQL, indexes, RLS authoring)

See root `CLAUDE.md` → Skills routing.

---

## MCP / tools for cms work

- **Before structural edits** (shared layout, i18n helpers, proxy): use CodeGraph (`codegraph_context` / `codegraph_callers`) with `projectPath` pointing at the workspace if needed — prefer over grep+read loops.
- **Before adding shadcn UI**: use the shadcn MCP (`search_items_in_registries` / `get_add_command_for_items`) or `npx shadcn@latest add …` so components match `components.json` (style `base-nova`, aliases `@/components`, `@/components/ui`).
- **After translation key changes**: keep `en` and `vi` namespace JSON in sync (same keys). See `references/i18n.md`.

---

## Directory layout

```
cms/
├── components.json          # shadcn config (aliases, style, css path)
├── next.config.ts           # reactCompiler: true
├── src/
│   ├── proxy.ts             # locale redirect + matcher (Next.js proxy)
│   ├── app/
│   │   ├── globals.css
│   │   └── [locale]/        # all user-facing routes are locale-prefixed
│   │       ├── layout.tsx   # root chrome: fonts, header, main, footer
│   │       ├── page.tsx     # home (RSC + getServerTranslation)
│   │       └── analytics/
│   │           ├── layout.tsx
│   │           └── [[...slug]]/page.tsx   # client page demo
│   ├── components/
│   │   ├── layout/          # SiteHeader, SiteFooter
│   │   ├── language-switcher.tsx
│   │   └── ui/              # shadcn primitives — do not hand-edit style system lightly
│   ├── hooks/               # e.g. use-mobile
│   ├── i18n/
│   │   ├── settings.ts      # languages, fallbackLng, cookieName, getOptions
│   │   ├── server.ts        # getServerTranslation(lng, ns) for RSC
│   │   ├── client.ts        # useTranslation(lng, ns) for client components
│   │   ├── utils.ts         # getLocalizedPath, isValidLocale
│   │   └── locales/<lng>/<ns>.json
│   └── lib/utils.ts         # cn() helper
└── package.json
```

Path alias: `@/*` → `./src/*` (see `tsconfig.json`).

---

## Where to look next

| Task touches... | Read |
|---|---|
| Route / `app/[locale]/` / RSC vs `"use client"` | `references/app-router.md` |
| Translations, locales, LanguageSwitcher, proxy | `references/i18n.md` |
| `components/ui`, layout components, shadcn | `references/components.md` |
| File/folder naming | `references/naming.md` |

---

## Never Do

- Do not invent product branding beyond existing copy in locale JSON / metadata.
- Do not add routes outside `src/app/[locale]/` (locale segment is required).
- Do not hardcode user-facing strings — use i18n namespaces; update **both** `en` and `vi`.
- Do not import client-only APIs into RSC without `"use client"`.
- Do not bypass `getLocalizedPath` / locale cookie patterns for nav links and language switches.
- Do not invent a new state library, CSS framework, or UI kit — extend shadcn + existing folders.
- Do not commit `.env` or secrets.
- Do not create `api/` or `tracker/` (or other modules) from cms work unless the user explicitly asks.
