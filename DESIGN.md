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
- Desktop: existing navigation rail. Academic context and shortcuts sit above the newsletter catalogue. Posters use three columns on wide screens, two on tablets and one on phones.
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
All services                 8 available

What’s Happening
[Internal] [SITeQuests] [External] [Announcements]
Internal events
[poster opens original]
title, organiser, summary, date and venue
...remaining newsletter sections
More services coming soon        icons

Not affiliated with SIT.    About OneSIT
Home       Services       Events    More
```

Desktop keeps the same reading order. Home and Events share the full newsletter catalogue. Section links jump to Internal events, SITeQuests, External events and Announcements. Services retains its searchable directory. More keeps personal dates and local preferences. About keeps the app introduction, contribution link and exact affiliation notice. The owner removed the Vanguard attribution section.

The newsletter section links form one compact control, with a pale grey background and white buttons. Use four columns on wide screens and two on phones, with at least 46px touch height. Entry counts appear beside the labels when space permits. Hover and keyboard focus use the red accent. Keep the links free of underlines and avoid adding a second divider below the section title.

Each catalogue item ends with an outlined red action button for its registration or other source link, recovered from the newsletter or poster QR code. Use a destination-specific label and an external-link icon. Buttons are at least 44px high and open in a new tab. Preserve the original poster action separately on the image.

Transport is a separate page with Bus arrivals and MRT timings tabs. Show the next three available bus estimates per service, with explicit Scheduled or Estimated labels. Preserve missing-data and offline states. Bus data stops refreshing when the page is hidden, when the MRT tab is selected, or after navigation. The owner chose official first/last MRT train times because routine live train predictions are not available from the chosen public sources. Do not invent a countdown from train frequencies.

## Content and assumptions

The owner approved publishing the reviewed 19-entry catalogue and its posters. Home and Events retain the newsletter's section order, including past entries, surveys and the report announcement. The first smaller WebP preview loads eagerly and the remaining previews load lazily. Selecting an image opens the original in a new tab. No separate poster links or reviewer comments appear. Raw email and recipient information remain excluded.

The visible week and selected countdown use Singapore calendar days. Personal overrides remain supported. Missing published dates show an explicit pending state. Service destinations handle their own sign-in.

## Restraint

The academic information supports the shortcuts. Do not restore the large week counter, add a second countdown or introduce a marketing heading. Keep familiar phone interactions, useful content and readable controls ahead of decorative effects.

## Anonymous feedback

The owner chose Home, directly below the shortcuts, for a small link to the supplied Slido event. Keep Preact, Vite, system fonts and existing CSS; this addition needs no runtime dependency or embedded form.

Three component directions were considered:

| Direction | Anchor and treatment | Signature, emotion and frame | Originality / fit / feasibility / portability |
| --- | --- | --- | --- |
| Dock note | The chosen Campus Dock gains one compact feedback row after All services. | The external-link icon moves towards its destination on hover. Calm and available; a small favicon and two lines below the dock. | 3 / 5 / 5 / 3 |
| Campus dropbox | Campus suggestion boxes inform a wide ruled feedback strip. | A line opens on focus. Inviting; a larger slot between shortcuts and events. | 4 / 3 / 4 / 3 |
| Utility chip | The app's existing utility controls gain a single icon and label. | Press feedback matches settings. Immediate; a small isolated chip below the dock. | 2 / 4 / 5 / 4 |

Choose Dock note: it fits the requested placement and gives the anonymous purpose enough space without adding a new section heading.

Idea: Make feedback as easy to reach as a campus shortcut.
Metaphor: A note attached to the existing app dock.
Signature: A small external-link icon moves up and right, using the current 160ms easing.
Emotion: Easy to approach.
Motion verb: Slot into place.
Screenshot: Shortcuts, All services, then a single feedback row before What's Happening.

Use the existing white, charcoal, grey and red palette. Keep Slido's official green favicon at 24px as the destination identifier. The row uses a 12px radius, 12px inner gap, a 15px label and 12px supporting text. The whole row is a touch target at least 72px high. Keep it still at rest and remove motion under reduced-motion preferences.

```text
[favourite shortcuts]
All services                         8 available
[Slido] Anonymous feedback                    ↗
        Any topic, via Slido.
What's Happening
```

The genericness check removed a separate feedback heading and decorative icon container. This remains a small utility within the selected Campus Dock. It opens Slido in a new tab without loading Slido code, sending a referrer or submitting responses from OneSIT. The event's composer showed an optional name field when checked on 19 November 2026; its host controls future settings.

The first review prompted naming Slido in the visible supporting text. The title already states that feedback is anonymous; the second line identifies the destination without claiming a specific recipient that the event does not name.
