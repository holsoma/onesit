import { createContext } from "preact";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "preact/hooks";
import {
  ErrorBoundary,
  LocationProvider,
  Router,
  Route,
  lazy,
  useLocation,
} from "preact-iso";
import { Icon } from "./components/Icon";
import { CampusDock } from "./components/CampusDock";
import { useRouteTransition } from "./lib/route-transition";
import { ServiceCard } from "./components/ServiceCard";
import { NewsletterCatalogue } from "./components/NewsletterCatalogue";
import { services, categories } from "./data/services";
import { calendarSource, calendarVerified } from "./data/calendar";
import { pageMeta, site } from "./data/site";
import {
  academicState,
  countdowns,
  formatDay,
  singaporeDay,
} from "./lib/dates";
import {
  initialPreferences,
  parsePreferences,
  storageKey,
} from "./lib/preferences";
import type { Preferences } from "./lib/preferences";
import type { DateOverrides } from "./lib/dates";
import "./style.css";
import "./components/campus-dock.css";
import "./transitions.css";

const Newsletter = lazy(() => import("./pages/Newsletter"));
const Transport = lazy(() => import("./pages/Transport"));
const AppContext = createContext<{
  preferences: Preferences;
  update: (p: Preferences) => void;
  now: Date | null;
  storageWarning: boolean;
  announce: (text: string) => void;
}>({
  preferences: initialPreferences(),
  update: () => {},
  now: null,
  storageWarning: false,
  announce: () => {},
});
const useApp = () => useContext(AppContext);
const navItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/services", label: "Services", icon: "grid" },
  { href: "/events", label: "Events", icon: "calendar" },
  { href: "/more", label: "More", icon: "more" },
];

function Navigation() {
  const { path } = useLocation();
  return (
    <nav class="navigation" aria-label="Main navigation">
      {navItems.map((item) => (
        <a
          href={item.href}
          class={
            path === item.href ||
            (item.href === "/services" && path === "/transport") ||
            (item.href === "/more" &&
              ["/about", "/coming-soon", "/tools/newsletter"].includes(path))
              ? "active"
              : ""
          }
          aria-current={path === item.href ? "page" : undefined}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
function Shell() {
  const location = useLocation();
  useRouteTransition(location.route);
  const [preferences, setPreferences] =
    useState<Preferences>(initialPreferences);
  const [now, setNow] = useState<Date | null>(null);
  const [storageWarning, setStorageWarning] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRoute = useRef(true);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    try {
      setPreferences(parsePreferences(localStorage.getItem(storageKey)));
    } catch {
      setStorageWarning(true);
    }
    const timer = setInterval(tick, 30000);
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey)
        setPreferences(parsePreferences(event.newValue));
    };
    window.addEventListener("storage", sync);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", sync);
      document.removeEventListener("visibilitychange", tick);
      if (noticeTimeout.current) clearTimeout(noticeTimeout.current);
    };
  }, []);
  useEffect(() => {
    const meta = pageMeta[location.path] || pageMeta["/404"];
    document.title = `${meta.title} | OneSIT`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", site.url + location.path);
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [location.path]);
  function update(next: Preferences) {
    setPreferences(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }
  function announce(text: string) {
    setNotice(text);
    if (noticeTimeout.current) clearTimeout(noticeTimeout.current);
    noticeTimeout.current = setTimeout(() => setNotice(""), 2500);
  }
  return (
    <AppContext.Provider
      value={{ preferences, update, now, storageWarning, announce }}
    >
      <a class="skip-link" href="#main">
        Skip to content
      </a>
      <div class={`app-shell ${location.path === "/" ? "home-shell" : ""}`}>
        <header class="app-header">
          <a href="/" class="brand-link" aria-label="OneSIT home">
            <img src="/brand/onesit.svg" alt="OneSIT" width="131" height="30" />
          </a>
          <p class="rail-subtitle">Your campus companion.</p>
          <Navigation />
          <div class="rail-bottom">
            <span class="campus-marker">
              <Icon name="pin" /> SIT, Punggol
            </span>
            <p>{site.affiliation}</p>
            <a href="/about">
              Made by a SITizen <Icon name="arrow" />
            </a>
          </div>
          <a
            class="mobile-settings icon-button"
            href="/more"
            aria-label="Personalise OneSIT"
          >
            <Icon name="settings" />
          </a>
        </header>
        <div class="app-content">
          <main id="main" tabIndex={-1}>
            <ErrorBoundary>
              <Router>
                <Route path="/" component={Home} />
                <Route path="/services" component={Services} />
                <Route path="/transport" component={Transport} />
                <Route path="/events" component={Events} />
                <Route path="/more" component={More} />
                <Route path="/about" component={About} />
                <Route path="/coming-soon" component={ComingSoon} />
                <Route path="/tools/newsletter" component={Newsletter} />
                <Route default component={NotFound} />
              </Router>
            </ErrorBoundary>
          </main>
          <footer class="page-footer">
            <span>{site.affiliation}</span>
            <a href="/about">
              About OneSIT <Icon name="arrow" />
            </a>
          </footer>
        </div>
      </div>
      <div
        class={`toast ${notice ? "toast-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice && (
          <>
            <Icon name="check" />
            {notice}
          </>
        )}
      </div>
    </AppContext.Provider>
  );
}
export function App() {
  return (
    <LocationProvider>
      <Shell />
    </LocationProvider>
  );
}

function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: preact.ComponentChildren;
}) {
  return (
    <div class="page-heading">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
function Home() {
  return <CampusDock {...useApp()} />;
}
function Services() {
  const { preferences, update, announce } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const matches = services.filter(
    (s) =>
      (category === "All" || s.category === category) &&
      `${s.name} ${s.description} ${s.category}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  const toggle = (id: string) => {
    const exists = preferences.favourites.includes(id);
    update({
      ...preferences,
      favourites: exists
        ? preferences.favourites.filter((x) => x !== id)
        : [...preferences.favourites, id],
    });
    announce(exists ? "Removed from favourites" : "Added to favourites");
  };
  return (
    <div class="page">
      <PageHeading
        title="Campus, connected."
        description="Your everyday services, one tap away."
      />
      <div class="service-tools">
        <label class="search-field">
          <Icon name="search" />
          <span class="sr-only">Search services</span>
          <input
            type="search"
            placeholder="Find a service"
            value={query}
            onInput={(e) => setQuery(e.currentTarget.value)}
          />
        </label>
        <div class="filter-group" aria-label="Service categories">
          {categories.map((c) => (
            <button
              class={category === c ? "selected" : ""}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div class="section-heading results-heading">
        <p>
          {matches.filter((s) => s.status === "available").length} available
          {" · "}
          {matches.filter((s) => s.status !== "available").length} coming soon
        </p>
        <span>
          <Icon name="star" />
          Star to keep on Home
        </span>
      </div>
      <h2 class="sr-only">Service directory</h2>
      <div class="service-grid">
        {matches.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            favourite={preferences.favourites.includes(service.id)}
            onToggle={toggle}
          />
        ))}
      </div>
      {!matches.length && (
        <div class="empty-state">
          <Icon name="search" />
          <h2>No services found</h2>
          <p>Try another name or category.</p>
          <button
            class="button button-outline"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Clear search
          </button>
        </div>
      )}
      <p class="help-note">
        External services open in a new tab. Sign in on the service’s own website.
      </p>
    </div>
  );
}
function Events() {
  return (
    <div class="page catalogue-page">
      <PageHeading title="What’s Happening" />
      <NewsletterCatalogue />
    </div>
  );
}
function More() {
  const { preferences, update, announce, storageWarning, now } = useApp();
  const [draft, setDraft] = useState<DateOverrides>(preferences.dates);
  const [resetting, setResetting] = useState(false);
  const day = now ? singaporeDay(now) : null;
  const activeDates: DateOverrides = day
    ? {
        start: preferences.dates.start || academicState(day).term?.start,
        ...Object.fromEntries(
          countdowns(day, preferences.dates).map((c) => [c.kind, c.target]),
        ),
      }
    : {};
  useLayoutEffect(() => setDraft(preferences.dates), [preferences.dates]);
  return (
    <div class="page narrow-page">
      <PageHeading
        title="Your OneSIT"
        description="A few settings to make campus life yours."
      />
      <section class="settings-panel" aria-labelledby="date-settings">
        <div class="section-heading">
          <h2 id="date-settings">
            <Icon name="calendar" />
            Academic dates
          </h2>
        </div>
        <p class="section-intro">
          We use the published SIT calendar. Add your own dates when your
          schedule differs. Blank fields use dates calculated from the trimester
          start.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update({ ...preferences, dates: draft });
            announce("Your dates are saved");
          }}
        >
          <div class="form-grid">
            {(
              [
                ["start", "Trimester starts"],
                ["assessment", "Final assessment"],
                ["break", "Trimester break"],
                ["recess", "Recess week"],
              ] as const
            ).map(([key, label]) => (
              <div class="field">
                <label for={`date-${key}`}>{label}</label>
                <input
                  id={`date-${key}`}
                  aria-describedby={`date-${key}-hint`}
                  type="date"
                  value={draft[key] || ""}
                  onInput={(e) =>
                    setDraft({
                      ...draft,
                      [key]: e.currentTarget.value || undefined,
                    })
                  }
                />
                <small class="field-hint" id={`date-${key}-hint`}>
                  {activeDates[key]
                    ? `In use: ${formatDay(activeDates[key]!, { day: "numeric", month: "short", year: "numeric" })} (${preferences.dates[key] || preferences.dates.start ? "your dates" : "SIT"})`
                    : "Published dates not available"}
                </small>
              </div>
            ))}
          </div>
          <div class="form-actions">
            <button class="button button-primary" type="submit">
              Save my dates <Icon name="check" />
            </button>
            <button
              class="text-button"
              type="button"
              onClick={() => {
                setDraft({});
                update({ ...preferences, dates: {} });
                announce("Published calendar restored");
              }}
            >
              Use SIT dates
            </button>
          </div>
        </form>
        <p class="source-note">
          <a href={calendarSource} target="_blank" rel="noopener noreferrer">
            SIT and joint-programme calendar <Icon name="external" />
          </a>{" "}
          · Checked {formatDay(calendarVerified)}
        </p>
      </section>
      <section class="settings-panel" aria-labelledby="local-settings">
        <h2 id="local-settings">Saved on this device</h2>
        <p>
          Your favourites, countdown choice and dates stay in this browser.
          Clearing browser data removes them. There is no account or
          cross-device sync.
        </p>
        {storageWarning && (
          <p class="error-message" role="alert">
            Your browser cannot save preferences. Changes will last only while
            this page is open.
          </p>
        )}
        {resetting ? (
          <div class="reset-confirm">
            <p>Reset favourites, countdown choice and personal dates?</p>
            <button
              class="button button-outline"
              onClick={() => {
                update(initialPreferences());
                setResetting(false);
                announce("OneSIT preferences reset");
              }}
            >
              Reset preferences
            </button>
            <button class="text-button" onClick={() => setResetting(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button class="text-button" onClick={() => setResetting(true)}>
            Reset preferences
          </button>
        )}
      </section>
      <div class="more-links">
        <a href="/coming-soon">
          <Icon name="grid" />
          <span>Coming soon</span>
          <Icon name="chevron" />
        </a>
        <a href="/about">
          <Icon name="heart" />
          <span>About OneSIT</span>
          <Icon name="chevron" />
        </a>
        <a href={site.repository} target="_blank" rel="noopener noreferrer">
          <Icon name="code" />
          <span>Contribute on GitHub</span>
          <Icon name="external" />
        </a>
      </div>
    </div>
  );
}
function ComingSoon() {
  return (
    <div class="page">
      <a class="back-link" href="/services">
        <Icon name="back" />
        All services
      </a>
      <PageHeading
        title="More campus, less searching."
        description="These services are on the list. They are not available in OneSIT yet."
      />
      <h2 class="sr-only">Service directory</h2>
      <div class="service-grid">
        {services
          .filter((s) => s.status === "soon")
          .map((service) => (
            <ServiceCard service={service} />
          ))}
      </div>
      <section class="roadmap-note">
        <Icon name="code" />
        <div>
          <h2>Help shape what comes next.</h2>
          <p>
            Room photos, lectorial codes, board game lists, printing points and
            community tools all start with accurate local knowledge.
          </p>
          <a
            href={`${site.repository}/issues`}
            class="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Suggest a feature <Icon name="external" />
          </a>
        </div>
      </section>
    </div>
  );
}
function About() {
  return (
    <div class="page narrow-page about-page">
      <a class="back-link" href="/more">
        <Icon name="back" />
        Your OneSIT
      </a>
      <div class="about-brand">
        <img src="/brand/onesit.svg" alt="OneSIT" width="240" height="55" />
      </div>
      <h1>A companion for campus life.</h1>
      <p class="about-lead">
        Campus services, academic dates and student events. Together, in one
        place.
      </p>
      <section class="about-section">
        <span class="about-symbol">
          <Icon name="flag" />
        </span>
        <div>
          <h2>From a member of SIT Vanguard.</h2>
          <p>
            OneSIT is an open-source, student-led app piloted by a member of SIT
            Vanguard. Its wordmark pays homage to SIT Vanguard.
          </p>
          <p>
            A small initiative to make the everyday parts of student life easier
            to find.
          </p>
        </div>
      </section>
      <section class="about-section">
        <span class="about-symbol">
          <Icon name="code" />
        </span>
        <div>
          <h2>Open for contribution.</h2>
          <p>
            OneSIT’s code is open source under the MIT licence. Report a broken
            link, improve a feature or help keep campus information accurate.
          </p>
          <a
            class="text-link"
            href={site.repository}
            target="_blank"
            rel="noopener noreferrer"
          >
            Find OneSIT on GitHub <Icon name="external" />
          </a>
        </div>
      </section>
      <div class="about-affiliation">{site.affiliation}</div>
      <p class="help-note">
        School websites and third-party services have their own terms and
        privacy policies. OneSIT stores personal settings in your browser and
        does not collect your school credentials. The transport screen requests
        bus estimates from ArriveLah.
      </p>
    </div>
  );
}
function NotFound() {
  return (
    <div class="page not-found">
      <span class="not-found-number">404</span>
      <h1>A little off campus.</h1>
      <p>This page does not exist. Your campus shortcuts are one tap away.</p>
      <a class="button button-primary" href="/">
        Back to Home <Icon name="arrow" />
      </a>
    </div>
  );
}
