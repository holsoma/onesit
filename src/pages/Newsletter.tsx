import { useEffect, useRef, useState } from "preact/hooks";
import { Icon } from "../components/Icon";
import { readInertHtml } from "../lib/newsletter";
import { validateEvents } from "../lib/events";
import type { CampusEvent } from "../lib/events";
import { singaporeDay } from "../lib/dates";
import eventData from "../data/events.json";
import "./newsletter.css";

type Preview = {
  subject: string;
  text: string;
  links: { label: string; url: string }[];
  images: { name: string; url: string }[];
};
type Draft = {
  id: string;
  title: string;
  summary: string;
  organiser: string;
  category: string;
  start: string;
  end: string;
  venue: string;
  url: string;
  sourceLabel: string;
  registrationCloses: string;
};
const blankDraft = (): Draft => ({
  id: "",
  title: "",
  summary: "",
  organiser: "",
  category: "Campus",
  start: "",
  end: "",
  venue: "",
  url: "",
  sourceLabel: "",
  registrationCloses: "",
});
const inSingapore = (value: string) =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(new Date(value))
    .replace(" ", "T");
function cleanEvent(e: CampusEvent): CampusEvent {
  return {
    id: e.id,
    title: e.title,
    summary: e.summary,
    organiser: e.organiser,
    category: e.category,
    start: e.start,
    end: e.end,
    venue: e.venue,
    url: e.url,
    sourceLabel: e.sourceLabel,
    verifiedAt: e.verifiedAt,
    ...(e.registrationCloses
      ? { registrationCloses: e.registrationCloses }
      : {}),
  };
}

export default function Newsletter() {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [entries, setEntries] = useState<CampusEvent[]>(
    eventData as CampusEvent[],
  );
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [reviewed, setReviewed] = useState(false);
  const worker = useRef<Worker | null>(null);
  const editor = useRef<HTMLDetailsElement | null>(null);
  const importVersion = useRef(0);
  const urls = useRef<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function clearPreview() {
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current = [];
    setPreview(null);
  }
  function stop() {
    importVersion.current++;
    worker.current?.terminate();
    worker.current = null;
    if (timer.current) clearTimeout(timer.current);
    setBusy(false);
  }
  useEffect(
    () => () => {
      importVersion.current++;
      worker.current?.terminate();
      urls.current.forEach((url) => URL.revokeObjectURL(url));
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function importMsg(file: File | undefined) {
    if (!file) return;
    stop();
    clearPreview();
    setError("");
    setStatus("");
    if (
      !file.name.toLowerCase().endsWith(".msg") ||
      file.size > 50 * 1024 * 1024
    ) {
      setError("Choose an Outlook .msg file no larger than 50 MiB.");
      return;
    }
    setBusy(true);
    const version = importVersion.current;
    try {
      const buffer = await file.arrayBuffer();
      if (version !== importVersion.current) return;
      const task = new Worker(
        new URL("../workers/newsletter.worker.ts", import.meta.url),
        { type: "module" },
      );
      worker.current = task;
      timer.current = setTimeout(() => {
        stop();
        setError(
          "Reading took too long. Try another file or enter events manually.",
        );
      }, 120000);
      task.onmessage = (e) => {
        if (worker.current !== task) return;
        stop();
        if (!e.data.ok) {
          setError(e.data.error);
          return;
        }
        const extracted = e.data.html
          ? readInertHtml(e.data.html)
          : { text: e.data.text, links: [] };
        const images = (
          e.data.images as { name: string; data: Uint8Array; mime: string }[]
        ).map((image) => {
          const url = URL.createObjectURL(
            new Blob([new Uint8Array(image.data).buffer], { type: image.mime }),
          );
          urls.current.push(url);
          return { name: image.name, url };
        });
        setPreview({
          subject: e.data.subject,
          text: extracted.text || e.data.text,
          links: extracted.links,
          images,
        });
        setStatus(
          "Newsletter opened on this device. Review details before adding an event.",
        );
      };
      task.onerror = () => {
        stop();
        setError(
          "The email could not be read. You can still enter events manually.",
        );
      };
      task.postMessage({ buffer }, [buffer]);
    } catch {
      stop();
      setError("Unable to open this file. Try saving a fresh .msg copy.");
    }
  }
  async function importFeed(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024)
        throw new Error("The event file is too large.");
      const value = JSON.parse(await file.text());
      const problems = validateEvents(value);
      if (problems.length) throw new Error(problems.slice(0, 3).join(" "));
      setEntries((value as CampusEvent[]).map(cleanEvent));
      setStatus("Existing event feed loaded.");
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid event file.");
    }
  }
  function saveDraft(e: SubmitEvent) {
    e.preventDefault();
    setError("");
    if (!reviewed) {
      setError("Review the event details and public source before adding it.");
      return;
    }
    const duplicate = entries.find(
      (e) =>
        e.title.toLowerCase() === draft.title.trim().toLowerCase() &&
        e.start.slice(0, 16) === draft.start,
    );
    const event: CampusEvent = {
      ...draft,
      id: draft.id || duplicate?.id || crypto.randomUUID(),
      start: draft.start + ":00+08:00",
      end: draft.end + ":00+08:00",
      verifiedAt: singaporeDay(),
      registrationCloses: draft.registrationCloses
        ? draft.registrationCloses + ":00+08:00"
        : undefined,
    };
    const problems = validateEvents([event]);
    if (problems.length) {
      setError(problems.join(" "));
      return;
    }
    setEntries((previous) =>
      [...previous.filter((e) => e.id !== event.id), cleanEvent(event)].sort(
        (a, b) => Date.parse(a.start) - Date.parse(b.start),
      ),
    );
    setDraft(blankDraft());
    setReviewed(false);
    setStatus("Reviewed event added to the export list.");
  }
  function edit(event: CampusEvent) {
    if (editor.current) editor.current.open = true;
    setDraft({
      ...event,
      start: inSingapore(event.start),
      end: inSingapore(event.end),
      registrationCloses: event.registrationCloses
        ? inSingapore(event.registrationCloses)
        : "",
    });
    setReviewed(false);
    document
      .getElementById("event-form-heading")
      ?.scrollIntoView({ block: "start" });
  }
  function exportFeed() {
    const problems = validateEvents(entries);
    if (problems.length) {
      setError(problems.join(" "));
      return;
    }
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            entries
              .map(cleanEvent)
              .sort((a, b) => Date.parse(a.start) - Date.parse(b.start)),
            null,
            2,
          ) + "\n",
        ],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "events.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(
      "Event summaries exported. Commit events.json to publish them. No email content or posters were exported.",
    );
  }
  return (
    <div class="page newsletter-page">
      <a href="/more" class="back-link">
        <Icon name="back" />
        Your OneSIT
      </a>
      <div class="page-heading">
        <div>
          <h1>Newsletter review</h1>
          <p>Open locally. Review carefully. Publish selected events.</p>
        </div>
      </div>
      <div class="privacy-note">
        <Icon name="book" />
        <p>
          The email stays on this device. Only reviewed event summaries and
          links go into the exported file. Posters, headers and recipient
          details are never exported.
        </p>
      </div>
      <div class="import-actions">
        <label class="file-button button button-outline">
          <Icon name="upload" />
          Open .msg newsletter
          <input
            type="file"
            accept=".msg"
            aria-label="Open .msg newsletter"
            onChange={(e) => {
              void importMsg(e.currentTarget.files?.[0]);
              e.currentTarget.value = "";
            }}
          />
        </label>
        <label class="file-button text-button">
          Load existing event file
          <input
            type="file"
            accept=".json,application/json"
            aria-label="Load existing event file"
            onChange={(e) => {
              void importFeed(e.currentTarget.files?.[0]);
              e.currentTarget.value = "";
            }}
          />
        </label>
        {busy && (
          <button
            class="text-button"
            onClick={() => {
              stop();
              setStatus("Import cancelled.");
            }}
          >
            Cancel import
          </button>
        )}
      </div>
      {busy && <p role="status">Reading the newsletter on your device…</p>}
      {error && (
        <p role="alert" class="error-message">
          {error}
        </p>
      )}
      <p class="tool-status" role="status">
        {status}
      </p>
      <div class="review-layout">
        <section class="review-source" aria-label="Newsletter source">
          {preview ? (
            <>
              <div class="section-heading">
                <h2>{preview.subject}</h2>
                <button class="text-button" onClick={clearPreview}>
                  Clear email
                </button>
              </div>
              <details open>
                <summary>Extracted text</summary>
                <pre class="email-text">
                  {preview.text || "No text found. Review the posters below."}
                </pre>
              </details>
              <details>
                <summary>Source links ({preview.links.length})</summary>
                <ul class="source-links">
                  {preview.links.map((link) => (
                    <li>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                        <Icon name="external" />
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
              <details>
                <summary>Posters ({preview.images.length})</summary>
                <div class="poster-list">
                  {preview.images.map((image) => (
                    <figure>
                      <img
                        src={image.url}
                        alt={`Newsletter attachment: ${image.name}`}
                        loading="lazy"
                      />
                      <figcaption>{image.name}</figcaption>
                    </figure>
                  ))}
                </div>
              </details>
            </>
          ) : (
            <div class="empty-source">
              <Icon name="upload" />
              <h2>Your newsletter goes here</h2>
              <p>
                Choose an Outlook .msg file, up to 50 MiB. Text, source links
                and posters will appear here for review.
              </p>
              <p>You can also add an event manually.</p>
            </div>
          )}
        </section>
        <section class="review-editor">
          <details class="event-editor-disclosure" ref={editor}>
            <summary id="event-form-heading">
              {draft.id ? "Edit event" : "Add an event manually"}
              <Icon name="chevron" />
            </summary>
            <form onSubmit={saveDraft}>
              <div class="editor-fields">
                {(
                  [
                    ["title", "Event title"],
                    ["organiser", "Organiser"],
                    ["venue", "Venue"],
                    ["sourceLabel", "Public source name"],
                  ] as const
                ).map(([key, label]) => (
                  <label class="field">
                    <span>{label}</span>
                    <input
                      required
                      maxLength={180}
                      value={draft[key]}
                      onInput={(e) =>
                        setDraft({ ...draft, [key]: e.currentTarget.value })
                      }
                    />
                  </label>
                ))}
                <label class="field">
                  <span>Public source URL</span>
                  <input
                    required
                    type="url"
                    value={draft.url}
                    onInput={(e) =>
                      setDraft({ ...draft, url: e.currentTarget.value })
                    }
                  />
                </label>
                <label class="field">
                  <span>Category</span>
                  <select
                    value={draft.category}
                    onChange={(e) =>
                      setDraft({ ...draft, category: e.currentTarget.value })
                    }
                  >
                    {[
                      "Campus",
                      "Community",
                      "Culture",
                      "Careers",
                      "Sports",
                      "Learning",
                    ].map((c) => (
                      <option>{c}</option>
                    ))}
                  </select>
                </label>
                <div class="form-grid">
                  {(
                    [
                      ["start", "Starts, Singapore time"],
                      ["end", "Ends, Singapore time"],
                      ["registrationCloses", "Registration closes, optional"],
                    ] as const
                  ).map(([key, label]) => (
                    <label class="field">
                      <span>{label}</span>
                      <input
                        type="datetime-local"
                        required={key !== "registrationCloses"}
                        value={draft[key]}
                        onInput={(e) =>
                          setDraft({ ...draft, [key]: e.currentTarget.value })
                        }
                      />
                    </label>
                  ))}
                </div>
                <label class="field">
                  <span>Short summary</span>
                  <textarea
                    required
                    maxLength={1200}
                    value={draft.summary}
                    onInput={(e) =>
                      setDraft({ ...draft, summary: e.currentTarget.value })
                    }
                  />
                </label>
                <label class="review-check">
                  <input
                    type="checkbox"
                    checked={reviewed}
                    onChange={(e) => setReviewed(e.currentTarget.checked)}
                  />
                  <span>
                    I checked the details and source. This summary is suitable
                    for public publication.
                  </span>
                </label>
                <div class="form-actions">
                  <button class="button button-primary" type="submit">
                    <Icon name="plus" />
                    {draft.id ? "Save changes" : "Add event"}
                  </button>
                  {draft.id && (
                    <button
                      type="button"
                      class="text-button"
                      onClick={() => {
                        setDraft(blankDraft());
                        setReviewed(false);
                      }}
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
              </div>
            </form>
          </details>
        </section>
      </div>
      <section class="export-panel">
        <div class="section-heading">
          <h2>Events to export ({entries.length})</h2>
          <button class="button button-primary" onClick={exportFeed}>
            <Icon name="download" />
            Export events
          </button>
        </div>
        <p class="section-intro">
          This list starts with two previously reviewed examples. Load your
          working event file before editing. Removing an entry excludes it from
          the exported file.
        </p>
        <ul class="export-list">
          {entries.map((event) => (
            <li>
              <div>
                <strong>{event.title}</strong>
                <span>
                  {event.start.slice(0, 10)} · {event.venue}
                </span>
              </div>
              <button class="text-button" onClick={() => edit(event)}>
                Edit
              </button>
              <button
                class="icon-button"
                aria-label={`Remove ${event.title} from export`}
                onClick={() =>
                  setEntries(entries.filter((e) => e.id !== event.id))
                }
              >
                <Icon name="close" />
              </button>
            </li>
          ))}
        </ul>
        <p class="help-note">
          Exported summaries are review material. The public catalogue is
          maintained separately with its section groups and posters. See the
          newsletter maintenance guide in the repository before publishing.
        </p>
      </section>
    </div>
  );
}
