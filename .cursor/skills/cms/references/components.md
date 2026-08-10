# Components

## Folders

| Path | Role |
|---|---|
| `src/components/ui/` | shadcn primitives — generated/updated via shadcn CLI/MCP |
| `src/components/layout/` | app chrome (`SiteHeader`, `SiteFooter`) |
| `src/components/*.tsx` | shared app widgets (e.g. `language-switcher.tsx`) |
| Feature folders | add under `src/components/<feature>/` when a feature grows beyond one file |

## shadcn

- Config: `cms/components.json` — style `base-nova`, RSC, aliases `@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`
- Styling helper: `cn()` from `@/lib/utils`
- Icons: `lucide-react`

Prefer composing existing `ui/*` primitives. Do not introduce a second component library.

## Layout components

- Receive `locale` as a prop from the server layout.
- Use `getServerTranslation(locale, "common")` for nav/footer copy.
- Use `getLocalizedPath` for internal `Link` hrefs.

## Client widgets

Mark `"use client"` only when needed (hooks, events, browser APIs). Keep leaves client and parents server when possible.
