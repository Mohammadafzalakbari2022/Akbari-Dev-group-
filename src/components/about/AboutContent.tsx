import { RemoteImage } from "@/components/ui/RemoteImage";
import { pickLocale } from "@/lib/i18n-json";
import type { AboutSection, TeamMemberDto } from "@/lib/data/types";

type AboutContentProps = {
  sections: AboutSection[];
  team: TeamMemberDto[];
  locale: string;
  teamTitle: string;
};

export function AboutContent({
  sections,
  team,
  locale,
  teamTitle,
}: AboutContentProps) {
  return (
    <div className="space-y-16">
      {sections.map((section) => (
        <section key={section.slug} className="max-w-3xl">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            {pickLocale(section.titleJson, locale)}
          </h2>
          <div className="rounded-xl glass-panel p-8">
            <p className="text-text-muted leading-relaxed whitespace-pre-line">
              {pickLocale(section.contentJson, locale)}
            </p>
          </div>
        </section>
      ))}

      {team.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-8">
            {teamTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <article
                key={member.id}
                className="rounded-xl glass-panel p-6 flex flex-col items-center text-center"
              >
                {member.photoUrl ? (
                  <RemoteImage
                    src={member.photoUrl}
                    alt=""
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-accent-primary/15 flex items-center justify-center mb-4 text-2xl font-bold text-accent-primary">
                    {pickLocale(member.nameJson, locale).charAt(0)}
                  </div>
                )}
                <h3 className="font-semibold text-text-primary">
                  {pickLocale(member.nameJson, locale)}
                </h3>
                <p className="text-sm text-accent-primary mt-1">
                  {pickLocale(member.roleJson, locale)}
                </p>
                {pickLocale(member.bioJson, locale) && (
                  <p className="mt-3 text-sm text-text-muted">
                    {pickLocale(member.bioJson, locale)}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
