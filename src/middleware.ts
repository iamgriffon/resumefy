import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

// Create a middleware handler for internationalization
const intlMiddleware = createMiddleware({
  locales: ['en', 'pt-BR', 'zh', 'es'],
  defaultLocale: 'en',
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 