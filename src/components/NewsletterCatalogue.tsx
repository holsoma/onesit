import catalogue from "../data/catalogue.json";
import { Icon } from "./Icon";
import "./newsletter-catalogue.css";
import { currentCatalogue } from "../lib/catalogue";
import { singaporeDay } from "../lib/dates";

export function NewsletterCatalogue({ nested = false, now }: { nested?: boolean; now?: Date | null }) {
  const SectionHeading = nested ? "h3" : "h2";
  const EntryHeading = nested ? "h4" : "h3";
  const sections = currentCatalogue(catalogue, singaporeDay(now ?? new Date()));

  if (!sections.length) return <p class="help-note">New entries will appear after the next newsletter update.</p>;

  return (
    <div class="newsletter-catalogue">
      <nav class="catalogue-sections" aria-label="Newsletter sections">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#catalogue-${section.id}`}
            aria-label={section.title}
          >
            <span>{section.title}</span>
            <span class="catalogue-section-count" aria-hidden="true">
              {section.entries.length}
            </span>
          </a>
        ))}
      </nav>
      {sections.map((section, sectionIndex) => (
        <section
          class="catalogue-section"
          id={`catalogue-${section.id}`}
          aria-labelledby={`catalogue-${section.id}-heading`}
          key={section.id}
        >
          <SectionHeading id={`catalogue-${section.id}-heading`}>
            {section.title}
          </SectionHeading>
          <div class="catalogue-grid">
            {section.entries.map((entry, entryIndex) => (
              <article class="catalogue-entry" key={entry.id}>
                <a
                  class="catalogue-poster"
                  href={entry.poster}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${entry.title} poster (opens in a new tab)`}
                >
                  <img
                    src={entry.preview}
                    width={entry.width}
                    height={entry.height}
                    loading={sectionIndex === 0 && entryIndex === 0 ? "eager" : "lazy"}
                    fetchpriority={sectionIndex === 0 && entryIndex === 0 ? "high" : undefined}
                    decoding="async"
                    alt={`${entry.title} poster`}
                  />
                </a>
                <EntryHeading>{entry.title}</EntryHeading>
                <p class="catalogue-organiser">By {entry.organiser}</p>
                {(entry.when || entry.where) && (
                  <dl class="catalogue-facts">
                    {entry.when && (
                      <div>
                        <dt>Date and time</dt>
                        <dd>{entry.when}</dd>
                      </div>
                    )}
                    {entry.where && (
                      <div>
                        <dt>Venue</dt>
                        <dd>{entry.where}</dd>
                      </div>
                    )}
                  </dl>
                )}
                <p class="catalogue-summary">{entry.summary}</p>
                <div class="catalogue-actions">
                  {entry.actions.map((action) => (
                    <a
                      key={action.url}
                      class="button button-outline catalogue-action"
                      href={action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${action.label}: ${entry.title} (opens in a new tab)`}
                    >
                      {action.label}
                      <Icon name="external" />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
