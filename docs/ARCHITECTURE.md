# Architecture

## Application

Preact renders a shared shell and routes with preact-iso. Vite prerenders every public page. All service information is local to the build. There is no database, backend function or authenticated API.

Primary screens share a small bundle. The newsletter editor is a separate dynamic import. Its parser runs in a worker and never loads on ordinary app pages. The build enforces an initial JavaScript budget of 60 KiB gzip and a CSS budget of 15 KiB gzip, including static imports. The generated `dist/bundle-report.json` records measured bytes.

## Public records

- Services: stable ID, label, description, category, status, local icon and an optional external URL. Only available entries expose links and favourite controls.
- Academic terms: published start and end dates, year and trimester number. The source and verification date are kept beside the records.
- Catalogue: section ID and title, then entries with stable IDs, titles, summaries, organisers, displayed dates and venues, local poster paths, preview paths, image dimensions and labelled external actions. Home and Events render the same `src/data/catalogue.json` records in newsletter order. Past entries remain part of the issue. Registration and other action URLs come from the newsletter or decoded poster QR codes.
- Newsletter review exports: dated event summaries with timezones, source URLs and optional registration deadlines. These are a separate format used by the local review tool, not the displayed catalogue.

Service icons are original category illustrations. They are checked-in SVGs, including the greyed-out future services. No favicon service or third-party image host is contacted by a visitor.

## Preferences and dates

`onesit.preferences.v1` stores favourites, date overrides and the selected countdown in localStorage. The reader validates the version and filters invalid service IDs and dates. Existing preferences without a countdown selection retain their favourites and dates and default to Final assessment. Invalid countdown values also fall back to Final assessment. Corrupt data returns defaults; unavailable storage leaves changes in memory and shows a warning in settings. Tabs receive storage events.

Academic calculations use calendar days in Asia/Singapore, including week 7 as recess, week 14 as final assessment and subsequent weeks as the break. A 30-second check and a visibility-change check refresh the date after midnight or device suspension. Unpublished periods do not invent a week number. Countdown targets include the current ongoing period, then the next published period. Personal dates replace their respective target and never display a negative countdown.

## Publication and privacy

The newsletter tool has no GitHub token or upload endpoint. It reads the local file, extracts inert content and exports only the allowed event fields. The catalogue and selected posters are published through a reviewed repository change followed by a static deployment. Raw emails and recipient metadata remain private. The first WebP poster preview loads eagerly; the remaining previews load lazily. Full originals load only when opened. Existing school websites control their own authentication and loading speed.

## Dependency audit

At initial setup, production dependencies passed `npm audit --omit=dev`. The full development-tree audit reported the picomatch ReDoS advisory GHSA-fc5q-39xc-vjpf through build and lint tools. The latest available picomatch was still 4.0.7, within the affected range. Do not force-downgrade the framework to satisfy an audit suggestion. Track the upstream fix and rerun the audit when updating tooling; the build service is not exposed to visitors.
