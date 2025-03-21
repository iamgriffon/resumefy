import { NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import { locales } from "@/i18n"
import type { ReactNode } from "react"
import { Header } from "@/components/layout/Header"
import { getMessages } from "@/i18n"

interface LocaleLayoutProps {
  children: ReactNode
  params: {
    locale: string
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!locale || !locales.includes(locale)) {
    notFound()
  }
  const messages = await getMessages(locale)

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main className="w-full h-full overflow-x-hidden overflow-y-auto px-2 sm:px-4">{children}</main>
    </NextIntlClientProvider>
  )
}

