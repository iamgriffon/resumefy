import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "pt-BR", "es", "zh"];
export const defaultLocale = "en";

export default getRequestConfig(async ({ locale = "en" }) => {
  return {
    locale: locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

export async function getMessages(locale: string) {
  const messages = (await import(`./messages/en.json`)).default;
  return messages;
}
