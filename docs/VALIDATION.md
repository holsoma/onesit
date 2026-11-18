# Catalogue validation

Validated on 18 November 2026 against the production build.

## Functional checks

- TypeScript, ESLint, 14 logic tests and the production build pass.
- All 10 browser tests pass locally, including the supplied private newsletter. CI skips that private-file test. The suite covers phone layouts, services, favourites, academic dates, countdown persistence, catalogue sections, keyboard poster opening and newsletter imports/exports.
- Home and Events each render 19 entries: 10 internal events, one SITeQuest, seven external events and one announcement.
- All 19 previews decode successfully. All original poster URLs return HTTP 200 with image content types. Originals are not requested until opened.
- Raw newsletters and local review files remain outside the repository.

## Layout and accessibility

Two screenshot passes cover Home and Events at 1440, 768, 390 and 320 pixels. Neither page has horizontal overflow or browser errors. Section links scroll to their headings. Keyboard activation opens the original poster in a new tab, and the focused poster has a visible outline. Reduced-motion screenshots retain the catalogue content.

The final Home WCAG A/AA scan reports no violations. The static audit crawled six public routes with zero failures and zero warnings.

The revised section bar was checked at 320, 390, 595, 768 and 1440 pixels. Labels fit without clipping, all four links work with Enter, and touch targets are at least 46px high. Hover, keyboard focus and reduced-motion states were captured and checked. Counts are hidden below 360px to preserve label space.

Two fresh reviews of the section bar found no blocking faults. The final control-specific scores were Design 7.5, Usability 8.0 and Responsive design 8.5, based on the screenshots and interaction measurements.

The first visual review led to dates appearing before descriptions, a two-column arrangement for phone section links, and moving the coming-soon link after the catalogue. A fresh second critic found no release-blocking layout fault and scored the interface 6.75/10. This is an agent estimate, not an official Awwwards assessment. The catalogue keeps the reviewed newsletter wording and original posters, including source inconsistencies, in accordance with the owner's request for no review comments.

## Performance

- Initial JavaScript: 20.3 KiB gzip. CSS: 6.4 KiB gzip.
- The newsletter parser remains outside the normal app download.
- All 19 WebP previews total approximately 1.03 MiB. The first preview loads eagerly with high priority; the others load lazily. Original posters are separate files.
- A local cold-load check with 4x CPU slowdown, 1.6 Mbps download and 150ms latency measured Home LCP at 1,608ms and Events LCP at 1,780ms. CLS was below 0.001 on Home and zero on Events.
- The static audit estimates the heaviest complete page at approximately 1,094 KB, including all preview images.

These are local laboratory measurements, not field performance guarantees. GitHub Actions repeats the build, logic checks and browser suite on each push.
