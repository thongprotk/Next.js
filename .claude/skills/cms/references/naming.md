# Naming

| Kind | Convention | Example |
|---|---|---|
| App route folders | kebab-case URL segments | `analytics/`, `[[...slug]]/` |
| Page/layout files | Next defaults | `page.tsx`, `layout.tsx` |
| Components | PascalCase file matching export | `site-header.tsx` → `SiteHeader` (kebab file OK for layout) |
| shadcn ui | keep generated names | `button.tsx`, `card.tsx` |
| Hooks | `use-*.ts` | `use-mobile.ts` |
| i18n namespaces | lowercase short words | `common`, `home`, `analytics` |
| Locale codes | BCP47 short | `en`, `vi` |
| Lib helpers | kebab or single word | `utils.ts` |

## Placement rules

1. User-facing route → `src/app/[locale]/…`
2. Reusable UI primitive → `src/components/ui/` (via shadcn)
3. App chrome → `src/components/layout/`
4. Feature UI used by multiple routes → `src/components/<feature>/`
5. Translation keys → matching namespace JSON under **both** locales
6. Shared pure helpers → `src/lib/`
7. Locale redirect / matcher → `src/proxy.ts` only
