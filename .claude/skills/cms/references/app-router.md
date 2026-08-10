# App Router

## Locale segment

Every page lives under `src/app/[locale]/`. `generateStaticParams` in the locale layout emits `en` and `vi`.

```tsx
// params are async in this Next version
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // ...
}
```

## RSC vs client

| Kind | Pattern | i18n |
|---|---|---|
| Server Component (default) | no `"use client"` | `getServerTranslation(locale, ns)` from `@/i18n/server` |
| Client Component | `"use client"` at top | `useTranslation(locale, ns)` from `@/i18n/client`; get `locale` from `useParams()` |

Home (`page.tsx`) is an RSC example. Analytics (`analytics/[[...slug]]/page.tsx`) is a client example.

## Layout chrome

`[locale]/layout.tsx` owns:

- `metadata` / `metadataBase` (site-wide defaults)
- fonts (Geist)
- `SiteHeader` / `SiteFooter`
- `<main>` width constraints

Route-level `layout.tsx` files override/extend metadata for that segment (see analytics layout). Prefer lean metadata on real pages — the analytics file is also a field reference; delete unused fields when copying.

## Proxy (locale redirect)

`src/proxy.ts` redirects paths without a locale prefix to `/{locale}/...` using cookie `i18next` → `Accept-Language` → `fallbackLng`. Matcher skips `api`, `_next`, static files.

When adding public non-locale paths, update the matcher intentionally.
