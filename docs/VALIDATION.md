# OneSIT validation

Validation records through 19 November 2026, using production builds.

## Functional checks

- TypeScript, ESLint, 24 logic tests and the production build pass.
- All 15 applicable browser tests pass locally; the optional private newsletter fixture test was skipped. The suite covers phone layouts, services, favourites, academic dates, countdown persistence, catalogue sections, Singapore midnight expiry, keyboard poster opening, external action buttons, newsletter imports/exports and transport states.
- Home and Events each render seven entries on 19 November: two internal items, two external events and three announcements. Older events, including HackRift, were removed at the owner's request. Empty SITeQuests navigation is omitted.
- All seven previews decode successfully. All original poster URLs return HTTP 200 with image content types. Originals are not requested until opened.
- Raw newsletters and local review files remain outside the repository.
- The seven items contain eight action links. Sushi-GO has no source registration link and retains its clickable poster. The action test checks HTTPS URLs, 44px touch height, new-tab behaviour and keyboard activation. Its external destination is intercepted locally, so no form is submitted.
- Four QR codes were decoded from the new posters. The beach, art;SITry and YMUN forms were opened read-only to check their content. Deadlines and capacity conditions are recorded in the newsletter maintenance guide. HTTP success alone does not establish that a form still accepts responses.
- Synthetic tests verify that registration cutoffs take priority over future event dates, undated forms do not acquire invented deadlines, individual pre-order links expire separately and a fourth announcement removes the oldest from view.
- The sidebar location label is `SIT Punggol`.

## Layout and accessibility

The refreshed Home and Events catalogue was checked at 320, 390 and 1440 pixels. Neither page has horizontal overflow, browser errors or WCAG A/AA violations. Section links scroll to their headings. Keyboard activation opens the original poster in a new tab. The phone section control fits the three current sections in two rows.

The static audit crawled seven public routes with zero failures. Two warnings flag the repeated organiser credit for the beach and art;SITry items, once on each catalogue page. The credit is accurate and retained.

Earlier section-bar validation covered 320, 390, 595, 768 and 1440 pixels. Labels fitted without clipping, all four then-current links worked with Enter, and touch targets were at least 46px high. Hover, keyboard focus and reduced-motion states were captured and checked. Counts remain hidden below 360px to preserve label space.

Two fresh reviews of the section bar found no blocking faults. The final control-specific scores were Design 7.5, Usability 8.0 and Responsive design 8.5, based on the screenshots and interaction measurements.

The first visual review led to dates appearing before descriptions, a two-column arrangement for phone section links, and moving the coming-soon link after the catalogue. A fresh second critic found no release-blocking layout fault and scored the interface 6.75/10. This is an agent estimate, not an official Awwwards assessment. The catalogue keeps the reviewed newsletter wording and original posters, including source inconsistencies, in accordance with the owner's request for no review comments.

## Performance

- Initial JavaScript: 19.3 KiB gzip. CSS: 6.6 KiB gzip.
- The newsletter parser remains outside the normal app download.
- The seven WebP previews total 340,016 bytes (about 332 KiB). The first preview loads eagerly with high priority; the others load lazily. Original posters are separate files. Thirty-six unused files from the previous issue were removed from the deployment.
- Before this catalogue refresh, a local cold-load check with 4x CPU slowdown, 1.6 Mbps download and 150ms latency measured Home LCP at 1,608ms and Events LCP at 1,780ms. CLS was below 0.001 on Home and zero on Events.
- The current static audit estimates the heaviest complete page at approximately 367 KB, including all preview images.

These are local laboratory measurements, not field performance guarantees. GitHub Actions repeats the build, logic checks and browser suite on each push.

## Transport release

- Live browser checks confirmed the ArriveLah feed works under the deployed security policy. Bus and MRT views have no horizontal overflow or WCAG A/AA violations at 320, 390 and 1440 pixels.
- Synthetic tests cover Scheduled/Estimated labels, minute rounding, malformed and empty feeds, expired predictions, offline recovery, stale snapshots, polling while hidden, tab switching, keyboard navigation and adding the internal transport route to home favourites.
- The transport chunk adds approximately 3.6 KiB gzip of JavaScript and 1.3 KiB gzip of CSS only when needed. Its CSS and module are linked in the transport page's initial HTML to avoid a delayed style change; they are not added to Home.
- On a local cold load with 4x CPU slowdown, 1.6 Mbps download and 150ms latency, Home LCP was 1,620ms with CLS zero. Transport LCP was 1,000ms with CLS 0.030; live bus estimates appeared after 1,427ms.
- The MRT panel shows the official timetable, not a simulated live arrival countdown. No API keys, geolocation, backend or new runtime packages were added.

## Anonymous feedback, 19 November 2026

- Home includes a 72px-high feedback link directly below the shortcuts. Its official Slido favicon is stored locally (1,308 bytes). No Slido code or API calls load on Home.
- Two visual passes cover 320, 390, 768, 1440 and 1920 pixels, plus hover, press, keyboard focus and reduced motion. No overflow, page errors or WCAG A/AA violations were found.
- Tab navigation reaches the link after the skip link and existing controls, with a visible 3px outline. Enter opens the exact supplied Slido URL in a new tab. This activation check intercepts the destination locally and does not submit feedback. The live Slido composer was separately checked and showed an optional name field.
- The final local cold-load measurement with 4x CPU slowdown, 1.6 Mbps download and 150ms latency gave Home LCP of 1,552ms and CLS below 0.001. The static audit reports zero failures and zero warnings.
- TypeScript, ESLint, all 19 logic tests, the production build and all 14 applicable browser tests pass. The private newsletter fixture test was skipped for this run.
- The README Home preview was refreshed; both images retain matching 780 by 1688 source dimensions and aligned display bounds.
- Two separate visual reviewers assessed the feedback control. The first prompted naming Slido in its visible supporting text. The final review found no blockers and scored the control 7.45/10 overall, with usability, accessibility, performance and responsive design at 8/10. This is an agent estimate, not an official Awwwards score.
