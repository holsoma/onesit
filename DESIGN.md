# OneSIT design system

## Brief

OneSIT is a mobile campus companion. The owner selected Campus Dock: compact academic context, one selectable countdown, favourite service icons and What’s Happening. Remove the large week number and Today at SIT heading. Use RBS and Campus Map as service labels. Use the selected wordmark without bottom text.

Keep Preact, Vite and TypeScript. Static pages, local assets and system fonts keep loading quick. No login, calendar integration, server or additional animation library.

## Concepts considered

| Concept | Anchor | Composition and interaction | Originality / fit / feasibility / portability |
| --- | --- | --- | --- |
| Campus Dock | OneSIT brings separate school services together | A familiar row of favourite app icons, compact dates and one countdown | 3 / 5 / 5 / 3 |
| Campus Wayfinder | Navigating Punggol and separate online services | Search and aligned destination rows with a red location marker | 4 / 4 / 5 / 2 |
| Campus Bulletin | What’s Happening newsletter and student-led origin | One real event headline leads a short campus bulletin | 4 / 4 / 5 / 2 |

The owner chose Campus Dock for quick daily service access.

## Concept card

Idea: Bring the school's separate tools into one compact app dock.
Metaphor: A phone's favourite-app area.
Signature: Favourite icons sit in a stable dock and lift slightly on interaction.
Emotion: Ready to use.
Motion verb: Slot into place.
Screenshot: Small week label, one countdown, four service icons and dated events.

## System

- Home surface: #FFFFFF. Other pages: #F7F7F8. Ink: #242327. Secondary text: #69666E. Lines: #E7E5E9. Accent: #C72535. Soft accent: #FBECEF. Wordmark red: #F0323C.
- System sans typography. On phones: 24px shortcut heading, 18px section headings, 12px week label, 15px countdown value. Native select text stays 16px to avoid automatic zoom on mobile browsers.
- Phone gutters: 20px, reducing to 16px at 320px. Four shortcuts per row, wrapping when more are saved. Keep the bottom navigation and safe-area padding.
- Desktop: existing navigation rail. Academic context sits above aligned shortcut and event columns. At 1100px and below, use one column with a capped reading width.
- Main controls use 12px corners. Shortcut icons use 16px corners. Avoid framing every service in a separate card on Home.
- Only one countdown is visible. The native selector offers Final assessment, Trimester break and Recess week. Persist the choice with favourites and personal dates; older saved preferences remain valid.
- Still at rest. Use 160ms press, lift and directional feedback. Native page transitions remain available and respect reduced motion.
- Low latency takes precedence over the skill's default GSAP, Lenis and WebGL stack. No continuous animation, loader or scroll effect.
- Store service icons locally. Available services keep the same icon colours on Home and in Services. Reserve grey icons for coming-soon services, with readable labels and explicit status text in the directory.

## Composition

Phone:

```text
OneSIT                         settings
Wednesday, 18 November          Week 12
[Final assessment v          In 12 days]
[30 Nov                              ]

Your shortcuts                     Edit
IN4SIT       xSiTe      RBS     Campus Map
All services                 7 available

What’s Happening                View all
date     event title and venue
date     event title and venue
More services coming soon        icons

Not affiliated with SIT.    About OneSIT
Home       Services       Events    More
```

Desktop keeps the same reading order and separates shortcuts from events into two columns. Services retains its searchable catalogue. Events retains month groups and expandable summaries. More keeps personal dates and local preferences. About keeps the Vanguard credit and exact affiliation notice.

## Content and assumptions

The home feed contains reviewed public summaries identified in the owner's newsletter. It does not publish the original email, recipient information or embedded posters. Older events leave the upcoming list automatically; the empty state directs attention to the next newsletter review.

The visible week and selected countdown use Singapore calendar days. Personal overrides remain supported. Missing published dates show an explicit pending state. Service destinations handle their own sign-in.

## Restraint

The academic information supports the shortcuts. Do not restore the large week counter, add a second countdown or introduce a marketing heading. Keep familiar phone interactions, useful content and readable controls ahead of decorative effects.
