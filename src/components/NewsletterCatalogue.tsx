import catalogue from "../data/catalogue.json";
import "./newsletter-catalogue.css";

export function NewsletterCatalogue({ nested = false }: { nested?: boolean }) {
  const SectionHeading = nested ? "h3" : "h2";
  const EntryHeading = nested ? "h4" : "h3";

  return (
    <div class="newsletter-catalogue">
      <nav class="catalogue-sections" aria-label="Newsletter sections">
        {catalogue.map((section) => (
          <a key={section.id} href={`#catalogue-${section.id}`}>
            {section.title}
          </a>
        ))}
      </nav>
      {catalogue.map((section, sectionIndex) => (
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
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
