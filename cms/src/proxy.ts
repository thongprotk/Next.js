import { NextRequest, NextResponse } from "next/server";
import { languages, fallbackLng, cookieName } from "@/i18n/settings";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = languages.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  const cookieLng = req.cookies.get(cookieName)?.value;
  const headerLng = req.headers.get("accept-language")?.split(",")[0]?.split("-")[0];
  const lng = cookieLng ?? headerLng ?? fallbackLng;
  const locale = languages.includes(lng as (typeof languages)[number]) ? lng : fallbackLng;

  return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
