# Release validation

Validated on 18 November 2026 against the production build.

- TypeScript, ESLint and 13 logic tests pass.
- Seven browser tests pass, including layout at 320, 360 and 430 pixels, favourites, date overrides, malformed imports, allowed export fields and the supplied private newsletter.
- The actual roughly 37 MB newsletter imports locally. No external requests were observed during import. It is not included in the repository.
- Eight routes at 390px have no reported WCAG A/AA violations, browser errors, missing images or horizontal overflow.
- Three cold-load trials with 4x CPU slowdown, 1.6 Mbps download and 150 ms network latency produced home LCP values of 884, 892 and 888 ms. CLS was zero in each trial. These are local laboratory measurements, not field performance guarantees.
- Initial JavaScript is 18.8 KiB gzip and CSS is 6.0 KiB gzip. The newsletter parser is excluded from the normal app download.
- The static metadata audit reports zero failures and warnings. Decorative empty alt attributes are kept explicit in generated HTML for static auditing tools.
- Public, unauthenticated HTTP requests to production Home, Services and About return 200. A missing route returns 404. Security headers are present.
- GitHub Actions passed for the initial release. Runtime dependencies passed `npm audit --omit=dev`; see the architecture guide for an unresolved upstream development-tool advisory.

Two screenshot passes cover desktop, throttled mobile, reduced motion, sampled keyboard stops, hover states and navigation. The first outside review found a cramped date form, accessible-name mismatches and incomplete hover feedback. These were fixed. Events now use month groups tied to the academic date-strip design.

The second fresh review scored the interface 7.35/10 using the Awwwards rubric: Design 7.2, Usability 8.0, Creativity 6.6 and Content 7.5. Developer scores were Semantics/SEO 8.0, Animation 7.0, Accessibility 8.0, Performance 9.0, Responsive design 8.5 and Metadata 8.0. These are agent review scores, not an official Awwwards assessment. SEO and metadata scores relied on the aggregate audit; transition screenshots did not establish continuous motion.

Its five practical recommendations were applied: settings show active dates, Home puts events and the campus map before future services, service counts separate available and coming-soon entries, the manual newsletter form starts collapsed, and back links use consistent arrow feedback. Browser checks were rerun after these changes. An immediate date-entry test exposed a delayed form reset; date fields now synchronise before interaction.

The repeated service grid and the small event feed remain areas for future improvement. The compact grid serves recognition and touch use; events should grow through reviewed public submissions rather than placeholder content.
