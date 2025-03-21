import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, getMessages } from "@/i18n";
import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locale || !locales.includes(locale)) {
    notFound();
  }
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col">
        <nav className="flex justify-between items-center">
          <Header />
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
