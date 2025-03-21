"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "./button";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const LanguageButton = ({
  language,
  isSelected,
  onClick,
}: {
  language: Language;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <li key={language.code}>
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer gap-2 w-full text-left px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm ${
        isSelected
          ? "bg-slate-700 text-white"
          : "text-gray-200 hover:bg-slate-700"
      }`}
    >
      <span className="text-base sm:text-lg">{language.flag}</span>
      <span>{language.name}</span>
    </button>
  </li>
);

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = [
    { code: "en", name: t("en"), flag: "🇺🇸" },
    { code: "pt-BR", name: t("pt-BR"), flag: "🇧🇷" },
    { code: "zh", name: t("zh"), flag: "🇨🇳" },
    { code: "es", name: t("es"), flag: "🇪🇸" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split("/");
    const pathnameWithoutLocale = segments.slice(2).join("/") || "";
    router.push(`/${newLocale}/${pathnameWithoutLocale}`);
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div>
      <Button
        onClick={toggleDropdown}
        className="z-10 rounded-full w-10 h-10 border-none"
        variant="outline"
      >
        <span className="flex items-center">
          <span className="text-base sm:text-lg">
            {currentLanguage.flag}
          </span>
          <span className="hidden xs:inline w-8 h-8">{currentLanguage.name}</span>
        </span>
      </Button>

      {isOpen && (
        <div className="absolute mt-1 right-0 bg-slate-800 rounded-md shadow-lg overflow-hidden z-50">
          <ul className="py-1">
            {languages.map((language) => (
              <LanguageButton
                key={language.code}
                language={language}
                isSelected={locale === language.code}
                onClick={() => handleLanguageChange(language.code)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
