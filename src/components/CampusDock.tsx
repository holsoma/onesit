import { Icon } from "./Icon";
import { NewsletterCatalogue } from "./NewsletterCatalogue";
import { services } from "../data/services";
import { countdownNames } from "../data/calendar";
import type { CountdownKind } from "../data/calendar";
import {
  academicState,
  countdowns,
  formatDay,
  singaporeDay,
} from "../lib/dates";
import type { Preferences } from "../lib/preferences";
const countdownChoices: CountdownKind[] = ["assessment", "break", "recess"];

export function CampusDock({
  now,
  preferences,
  update,
}: {
  now: Date | null;
  preferences: Preferences;
  update: (next: Preferences) => void;
}) {
  const day = now ? singaporeDay(now) : null;
  const academic = day ? academicState(day, preferences.dates) : null;
  const counter = day
    ? countdowns(day, preferences.dates).find(
        (item) => item.kind === preferences.countdown,
      )
    : undefined;
  const favourites = preferences.favourites
    .map((id) => services.find((service) => service.id === id))
    .filter((service) => service?.status === "available");
  const weekLabel = academic?.week
    ? `Week ${academic.week}`
    : day
      ? "Set dates"
      : "Week …";

  return (
    <div class="page home-page">
      <div class="dock-overview">
        <div class="dock-context">
          <time dateTime={day || undefined}>
            {day
              ? formatDay(day, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : "Your campus companion"}
          </time>
          <a
            class="dock-week"
            href="/more"
            aria-label={`${weekLabel}. ${academic?.period || "Academic dates"}. Edit dates`}
          >
            <span aria-hidden="true" />
            {weekLabel}
          </a>
        </div>

        <section class="dock-countdown" aria-label="Academic countdown">
          <div class="dock-countdown-copy">
            <label class="sr-only" for="home-countdown">
              Choose countdown
            </label>
            <div class="dock-countdown-picker">
              <select
                id="home-countdown"
                value={preferences.countdown}
                aria-describedby="home-countdown-date"
                onChange={(event) =>
                  update({
                    ...preferences,
                    countdown: event.currentTarget.value as CountdownKind,
                  })
                }
              >
                {countdownChoices.map((kind) => (
                  <option key={kind} value={kind}>
                    {countdownNames[kind]}
                  </option>
                ))}
              </select>
              <Icon name="chevron" />
            </div>
            <span id="home-countdown-date" class="dock-countdown-date">
              {counter?.target
                ? formatDay(counter.target)
                : "Published SIT calendar"}
              {counter?.custom ? " · Your date" : ""}
            </span>
          </div>
          <strong class="dock-countdown-value" role="status">
            {counter
              ? counter.days !== null && counter.days > 0
                ? `In ${counter.status}`
                : counter.status
              : "Checking dates"}
          </strong>
        </section>
      </div>
      <div class="dock-layout dock-catalogue-layout">
        <div class="dock-primary">
          <section aria-labelledby="shortcuts-heading" class="dock-favourites">
            <div class="dock-section-heading">
              <h1 id="shortcuts-heading">Your shortcuts</h1>
              <a
                class="text-link"
                href="/services"
                aria-label="Edit your shortcuts"
              >
                Edit <Icon name="settings" />
              </a>
            </div>
            {favourites.length ? (
              <ul class="dock-shortcuts" aria-label="Favourite services">
                {favourites.map(
                  (service) =>
                    service && (
                      <li key={service.id}>
                        <a
                          class="dock-shortcut"
                          href={service.url}
                          target={service.url?.startsWith("/") ? undefined : "_blank"}
                          rel={service.url?.startsWith("/") ? undefined : "noopener noreferrer"}
                        >
                          <img
                            src={`/services/${service.icon}.svg`}
                            alt=""
                            width="56"
                            height="56"
                          />
                          <span>{service.name}</span>
                          {!service.url?.startsWith("/") && <span class="sr-only"> Opens in a new tab</span>}
                        </a>
                      </li>
                    ),
                )}
              </ul>
            ) : (
              <div class="empty-state">
                <p>Keep your everyday services close.</p>
                <a class="text-link" href="/services">
                  Choose your shortcuts <Icon name="arrow" />
                </a>
              </div>
            )}
            <a class="dock-all-services" href="/services">
              <span>All services</span>
              <span class="dock-service-count">
                {
                  services.filter((service) => service.status === "available")
                    .length
                }{" "}
                available
                <Icon name="arrow" />
              </span>
            </a>
          </section>
        </div>
      </div>
      <section class="dock-catalogue" aria-labelledby="happening-heading">
        <div class="dock-section-heading">
          <h2 id="happening-heading">What’s Happening</h2>
        </div>
        <NewsletterCatalogue nested />
      </section>
      <div class="dock-secondary">
        <a class="dock-coming-soon" href="/coming-soon">
          <span>More services coming soon</span>
          <span class="dock-future-icons" aria-hidden="true">
            {["cates", "facilities", "health"].map((icon) => (
              <img
                key={icon}
                src={`/services/${icon}.svg`}
                alt=""
                width="26"
                height="26"
                loading="lazy"
              />
            ))}
          </span>
        </a>
      </div>
    </div>
  );
}
