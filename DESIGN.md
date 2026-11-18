# OneSIT design system

## Brief

A daily campus companion for SIT students. Preact, Vite and TypeScript keep the first download small and the generated files suitable for Android packaging. Use the owner's outlined SVG wordmark without a bottom line in the phone header; retain the other concepts for later selection.

## Concepts considered

| Concept               | Anchor and composition                                                                | Signature and feeling                                            | Screenshot                                                   | Originality / fit / feasibility / portability |
| --------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| Campus day board      | SIT's academic week and scattered school portals become a personal campus noticeboard | A star pins a service into the personal board; direct and useful | Current trimester strip, favourite services and dated events | 4 / 5 / 5 / 2                                 |
| Punggol connections   | The new campus and its linked buildings organise services like a route map            | A selected path joins services; exploratory                      | A transport-like map of campus tasks                         | 4 / 3 / 3 / 2                                 |
| One typographic index | OneSIT's name becomes a strict single-column catalogue                                | Entries slide into alignment; orderly                            | An oversized index of school links                           | 3 / 4 / 5 / 4                                 |

Choose Campus day board: the academic rhythm and shortcuts are the actual daily task, with no decorative journey between them.

## Concept card

Idea: A student's campus day, gathered on one personal board.
Metaphor: A campus noticeboard with pinned shortcuts and a week marker.
Signature: Favourite stars fill on press and immediately update the home shortcuts; a segmented trimester strip locates today.
Emotion: Recognise the week and find the next action within three seconds.
Motion verb: Settle into place.
Screenshot: A compact red week marker, four favourite services and upcoming event dates.

## System

- Ground: #F7F7F8. Surface: #FFFFFF. Ink: #242327. Muted: #69666E. Line: #E7E5E9. Accent: #C72535. Logo red remains #F0323C.
- System sans typography, with no font requests. Body 16px / 1.5, labels 12 to 14px, headings 26 to 38px with negative tracking, tabular academic numbers.
- Desktop: 220px navigation rail, content maximum 1160px, 32px gutters. Home content uses a 7:5 split. Phone: one content column, 20px gutters, two-column service grid, four-item bottom navigation with safe-area padding.
- Shapes: 16px main panel corners, 12px shortcuts and controls, circular star targets. Borders are quiet; shadows only mark the fixed mobile navigation.
- Motion: 140 to 180ms ease-out transform/colour changes, active press at scale .97. Still at rest. No loaders or scroll effects. Native scrolling is deliberate.
- Low latency takes precedence over the skill's default GSAP, Lenis and WebGL stack. These dependencies and their continuous clocks are omitted. CSS feedback is enough for this product.
- No remote favicons at runtime. Store icons locally. Future services are grey but retain readable labels and Coming soon badges. Original category icons are used where an official asset is unavailable, with no suggestion of an official logo.

## Composition

```text
Phone home                    Desktop home
OneSIT       settings         rail | Today at SIT        date
Today at SIT / date                 | week panel | Events
week + period + term strip          | countdowns | dated rows
three compact countdowns            | favourites | campus link
Favourites       Edit               | available shortcuts
shortcut  shortcut
shortcut  shortcut
What's happening  View all
dated event rows
Not affiliated with SIT.
Home Services Events More

Services                      Events
heading / search              heading / upcoming + past
category filters              month label
available and future tiles    date | title | venue
grey icons + explicit status  expandable detail / source

More / settings               About / 404
date overrides form           wordmark / factual context
local storage explanation     Vanguard credit / affiliation
roadmap + About + repository   direct route home if missing
```

## Genericness check

The first generic draft would be a marketing hero and identical feature cards. Replace it with the actual academic week, useful service favourites and a dated event list. Keep the compact service grid because it serves recognition and touch use. No invented campus photograph or decorative metrics.

## Decisions and assumptions

The main wordmark has no tagline at phone size. The owner has not selected a final large-format tagline. Events are deliberately limited to publicly verifiable summaries. External school pages retain their own loading and login behaviour.

## Review changes

Date inputs stack on phone screens. Event months share the academic strip treatment, with real event dates marked in red. Native view transitions settle page content by 6px over 160ms when supported; reduced-motion navigation is immediate. This adds no animation library or continuous clock.
