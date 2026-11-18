# Campus Dock validation

Validated on 18 November 2026 against the production build.

## Functional checks

- TypeScript, ESLint and 14 logic tests pass.
- Nine browser tests pass. They cover layouts at 320, 360 and 430 pixels; available and coming-soon services; favourites; Singapore dates and overrides; one selectable countdown and persistence; zero and seven favourites; invalid newsletter imports; allowed export fields; and the supplied private newsletter.
- Existing version-one preferences without a countdown choice retain their favourites and dates. They default to Final assessment. Unknown countdown values also fall back safely.
- The actual roughly 37 MB newsletter imports locally, with no external requests observed during import. It is not included in the repository.
- The public event feed remains unchanged. The full newsletter catalogue and extracted images were prepared separately for the owner's local review.

## Visual and accessibility checks

Two complete screenshot passes cover seven public page types on desktop, throttled mobile and reduced motion, with navigation, keyboard and hover evidence. Supplemental captures cover the selected countdown, seven shortcuts, expanded event details, saved dates and widths of 320, 768, 1024 and 1920 pixels.

All eight routes, including the newsletter tool, have no reported WCAG A/AA violations, browser errors, missing images or horizontal overflow in the final 390px checks. Sampled touch targets are at least 44px. Reduced-motion content remains visible.

The screenshot tool flagged the Services search input as lacking focus. A separate eight-Tab capture shows a clear 2px red outline on the enclosing search field. The tool inspected only the input, so this was a false positive. Both the screenshot and computed styles were reviewed.

The first design review led to consistent colours for available service icons, shared desktop alignment, labelled event-month scales and visible event start times. Grey remains reserved for coming-soon services.

The second fresh critic scored the interface **7.51/10** after the focus evidence was supplied: Design 7.5, Usability 8.0, Creativity 6.8 and Content 7.5. Developer scores were Semantics/SEO 8.0, Animation 7.5, Accessibility 8.0, Performance 9.0, Responsive design 8.5 and Metadata 8.0. These are agent estimates, not an official Awwwards assessment.

The remaining design opportunities are desktop content prominence and a more distinctive visual identity. The owner's selected minimal dock remains the basis of the release.

## Performance

- Initial JavaScript: **18.6 KiB gzip**. CSS: **5.8 KiB gzip**.
- The newsletter parser is excluded from the normal app download.
- Three local cold-load trials at 4x CPU slowdown, 1.6 Mbps download and 150ms network latency measured home LCP at **832, 844 and 844ms**, with CLS **0**.
- The second full screenshot pass measured mobile LCP from **812 to 844ms**, with scrolling at **60 to 61fps**.
- Static metadata audit: **0 FAIL, 0 WARN**.

These are local laboratory measurements, not field performance guarantees. GitHub Actions repeats the build, logic checks and browser suite on each push; the private-file test is skipped in CI. Runtime dependencies passed the initial release audit; the architecture guide records the outstanding upstream development-tool advisory.
