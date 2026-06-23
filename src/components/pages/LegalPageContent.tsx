import { pickLocale } from "@/lib/i18n-json";

type Props = {
  titleJson: unknown;
  contentJson: unknown;
  locale: string;
};

export function LegalPageContent({ titleJson, contentJson, locale }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-text-primary mb-8">
        {pickLocale(titleJson, locale)}
      </h1>
      <div className="rounded-xl glass-panel p-8">
        <p className="text-text-muted leading-relaxed whitespace-pre-line">
          {pickLocale(contentJson, locale)}
        </p>
      </div>
    </div>
  );
}
