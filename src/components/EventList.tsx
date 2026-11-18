import { useState } from "preact/hooks";
import type { CampusEvent } from "../lib/events";
import { eventStatus } from "../lib/events";
import { formatDay } from "../lib/dates";
import { Icon } from "./Icon";
export function EventList({
  events,
  now,
  compact = false,
}: {
  events: CampusEvent[];
  now: Date | null;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (!events.length)
    return (
      <div class="empty-state">
        <Icon name="calendar" />
        <h3>No events here yet</h3>
        <p>New events will appear after the next newsletter review.</p>
      </div>
    );
  return (
    <div class={`event-list ${compact ? "event-list-compact" : ""}`}>
      {events.map((event) => {
        const status = now ? eventStatus(event, now) : "upcoming";
        const isOpen = expanded === event.id;
        return (
          <article class="event-item" key={event.id}>
            <button
              class="event-summary"
              aria-expanded={isOpen}
              aria-controls={`details-${event.id}`}
              onClick={() => setExpanded(isOpen ? null : event.id)}
            >
              <span class="event-date" aria-hidden="true">
                <strong>{formatDay(event.start, { day: "2-digit" })}</strong>
                <span>{formatDay(event.start, { month: "short" })}</span>
              </span>
              <span class="event-heading">
                <span class="event-category">{event.category}</span>
                <h3>{event.title}</h3>
                <span class="event-venue">
                  {compact ? `${event.category} · ` : ""}
                  {event.venue}
                </span>
                {!compact && (
                  <span class="event-time">
                    Starts{" "}
                    <time dateTime={event.start}>
                      {formatDay(event.start, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      SGT
                    </time>
                  </span>
                )}
                {status === "registration-closed" && (
                  <span class="event-status">Registration closed</span>
                )}
                {status === "ongoing" && (
                  <span class="event-status">Happening now</span>
                )}
                <span class="sr-only">
                  {formatDay(event.start, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </span>
              <Icon name="chevron" class={isOpen ? "rotate-icon" : ""} />
            </button>
            <div
              id={`details-${event.id}`}
              class="event-details"
              hidden={!isOpen}
            >
              <p>{event.summary}</p>
              <dl>
                <div>
                  <dt>When</dt>
                  <dd>
                    {formatDay(event.start, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    to{" "}
                    {formatDay(event.end, {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    SGT
                  </dd>
                </div>
                <div>
                  <dt>Organiser</dt>
                  <dd>{event.organiser}</dd>
                </div>
              </dl>
              <a
                class="text-link"
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View organiser’s details <Icon name="external" />
              </a>
              <p class="source-note">
                Source: {event.sourceLabel}. Checked{" "}
                {formatDay(event.verifiedAt)}.
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
