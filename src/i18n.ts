import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "pt-BR", "es", "zh"];

export default getRequestConfig(async ({ locale  = 'pt-BR'}) => {
  return {
    locale: locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

export async function getMessages(locale: string) {
  const messages = (await import(`./messages/${locale}.json`)).default;
  return messages;
}

export async function getTranslations(namespace: string, locale: string) {
  const messages = await getMessages(locale);
  return messages[namespace] || {} as Record<string, string>;
}
