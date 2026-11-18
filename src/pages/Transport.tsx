import { useRef, useState } from "preact/hooks";
import { Icon } from "../components/Icon";
import { busStop, busRoutes, mrt, transportChecked } from "../data/transport";
import { arrivalLabel, isStale, transportTime, upcomingBuses } from "../lib/transport";
import { useBusArrivals } from "../lib/use-bus-arrivals";
import "./transport.css";

function BusBoard() {
  const { snapshot, now, busy, issue, refresh } = useBusArrivals();
  const stale = snapshot ? isStale(snapshot, now) : false;
  const numbers = [...new Set([...busRoutes.map(route => route.number), ...(snapshot?.services.map(service => service.number) ?? [])])]
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  return (
    <section aria-labelledby="bus-heading">
      <div class="transport-stop">
        <div><span class="transport-code">Stop {busStop.code}</span><h2 id="bus-heading">{busStop.name}</h2><p>{busStop.road}</p></div>
        <button class="button button-outline transport-refresh" onClick={refresh} disabled={busy} aria-label="Refresh bus arrivals">
          <Icon name="refresh" />{busy ? "Updating" : "Refresh"}
        </button>
      </div>
      <p class="transport-update" role="status">
        {snapshot ? `${issue || stale ? "Last received" : "Updated"} ${transportTime(snapshot.receivedAt)} SGT` : busy ? "Fetching bus times…" : "No current bus times"}
      </p>
      {(issue || stale) && <p class="transport-notice" role="status">
        {issue === "offline" ? "You’re offline. Reconnect to update the times." : issue === "unavailable" ? "Bus times could not be refreshed. Try again shortly." : "These times are out of date. Refresh for the latest estimates."}
      </p>}
      <div class="bus-board" aria-label="Bus departures">
        {numbers.map(number => {
          const route = busRoutes.find(route => route.number === number);
          const service = snapshot?.services.find(service => service.number === number);
          const arrivals = snapshot && !stale ? upcomingBuses(service, now) : [];
          return (
            <article class="bus-row" key={number} aria-labelledby={`bus-${number}`}>
              <div class="bus-route-heading">
                <h3 id={`bus-${number}`}>{number}</h3>
                {route ? <a href={route.url} target="_blank" rel="noopener noreferrer" aria-label={`Service ${number} route to ${route.destination} (opens in a new tab)`}>{route.destination}<Icon name="external" /></a> : <span>Service {number}</span>}
              </div>
              {arrivals.length ? <ol class="bus-times" aria-label={`Next departures for service ${number}`}>
                {[0, 1, 2].map(index => {
                  const arrival = arrivals[index];
                  return <li key={index}>
                    <span class="bus-order">{index === 0 ? "Next" : index === 1 ? "Then" : "Later"}</span>
                    <strong>{arrival ? arrivalLabel(arrival, now) : <span aria-label="Not available">N/A</span>}</strong>
                    {arrival && <span class="bus-basis">{arrival.basis === "schedule" ? "Scheduled" : arrival.basis === "location" ? "Estimated" : ""}</span>}
                  </li>;
                })}
              </ol> : <p class="bus-no-times">{!snapshot && busy ? "Fetching times…" : stale ? "Refresh for current times" : "No estimates available"}</p>}
            </article>
          );
        })}
      </div>
      <p class="transport-help">Times are estimates. “Scheduled” means based on the operator’s timetable. Missing estimates do not necessarily mean a service has stopped.</p>
      <p class="transport-source">Bus data: <a href="https://datamall.lta.gov.sg/" target="_blank" rel="noopener noreferrer">LTA</a> via <a href="https://github.com/cheeaun/arrivelah" target="_blank" rel="noopener noreferrer">ArriveLah</a>. Updates every 30 seconds while this screen is open.</p>
    </section>
  );
}

function MrtBoard() {
  return (
    <section aria-labelledby="mrt-heading">
      <div class="mrt-heading"><span class="mrt-code">{mrt.code}</span><div><h2 id="mrt-heading">{mrt.name} MRT</h2><p>North East Line · Towards {mrt.destination}</p></div></div>
      <div class="mrt-timetable">
        <h3>First and last trains</h3>
        <table>
          <caption class="sr-only">Scheduled departures from Punggol Coast towards HarbourFront, Singapore time</caption>
          <thead><tr><th scope="col">Day</th><th scope="col">First</th><th scope="col">Last</th></tr></thead>
          <tbody>
            <tr><th scope="row">Monday to Saturday</th><td>{mrt.weekdayFirst}</td><td>{mrt.last}</td></tr>
            <tr><th scope="row">Sunday / public holiday</th><td>{mrt.sundayFirst}</td><td>{mrt.last}</td></tr>
          </tbody>
        </table>
        <p class="transport-help">Singapore time, 24-hour clock. Special service hours may apply on public holidays and event days.</p>
      </div>
      <p class="transport-notice">Published timetable. Live MRT arrival countdowns are not available in OneSIT.</p>
      <div class="transport-links">
        <a class="button button-outline" href={mrt.timetableUrl} target="_blank" rel="noopener noreferrer">Official train timings <Icon name="external" /></a>
        <a class="button button-outline" href={mrt.stationUrl} target="_blank" rel="noopener noreferrer">Station information <Icon name="external" /></a>
      </div>
      <p class="transport-source">Source: SBS Transit. Checked <time dateTime={transportChecked}>18 November 2026</time>.</p>
    </section>
  );
}

export default function Transport() {
  const [mode, setMode] = useState<"bus" | "mrt">("bus");
  const tabList = useRef<HTMLDivElement>(null);
  return (
    <div class="page transport-page">
      <a class="back-link" href="/services"><Icon name="back" />All services</a>
      <div class="page-heading"><div><h1>Punggol Coast</h1><p>Bus interchange & MRT</p></div></div>
      <div class="transport-tabs" role="tablist" aria-label="Transport type" ref={tabList}
        onKeyDown={event => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === "Home" ? "bus" : event.key === "End" ? "mrt" : mode === "bus" ? "mrt" : "bus";
          setMode(next);
          tabList.current?.querySelector<HTMLButtonElement>(`#tab-${next}`)?.focus();
        }}>
        {(["bus", "mrt"] as const).map(type => <button key={type} id={`tab-${type}`} role="tab" aria-selected={mode === type} aria-controls={`panel-${type}`} tabIndex={mode === type ? 0 : -1} onClick={() => setMode(type)}>
          <Icon name={type} />{type === "bus" ? "Bus arrivals" : "MRT timings"}
        </button>)}
      </div>
      <div id="panel-bus" role="tabpanel" aria-labelledby="tab-bus" tabIndex={0} hidden={mode !== "bus"}>{mode === "bus" && <BusBoard />}</div>
      <div id="panel-mrt" role="tabpanel" aria-labelledby="tab-mrt" tabIndex={0} hidden={mode !== "mrt"}><MrtBoard /></div>
    </div>
  );
}
