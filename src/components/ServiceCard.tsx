import type { Service } from "../data/services";
import { Icon } from "./Icon";
export function ServiceCard({
  service,
  favourite = false,
  onToggle,
  compact = false,
}: {
  service: Service;
  favourite?: boolean;
  onToggle?: (id: string) => void;
  compact?: boolean;
}) {
  const soon = service.status === "soon";
  const content = (
    <>
      <img
        class="service-icon"
        src={`/services/${service.icon}.svg`}
        width="42"
        height="42"
        alt=""
        loading="lazy"
      />
      <div class="service-copy">
        <h3>{service.name}</h3>
        {!compact && <p>{service.description}</p>}
        {soon && <span class="soon-label">Coming soon</span>}
      </div>
      {!soon && <Icon name="external" class="external-icon" />}
    </>
  );
  return (
    <article
      class={`service-card ${soon ? "service-soon" : ""} ${compact ? "service-compact" : ""}`}
    >
      {soon ? (
        <div class="service-body" aria-label={`${service.name}, coming soon`}>
          {content}
        </div>
      ) : (
        <a
          class="service-body"
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
          <span class="sr-only"> Opens in a new tab</span>
        </a>
      )}
      {!soon && !compact && onToggle && (
        <button
          class={`star-button ${favourite ? "is-favourite" : ""}`}
          onClick={() => onToggle(service.id)}
          aria-pressed={favourite}
          aria-label={`${favourite ? "Remove" : "Add"} ${service.name} ${favourite ? "from" : "to"} favourites`}
        >
          <Icon name="star" />
        </button>
      )}
    </article>
  );
}
