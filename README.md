<div align="center">

<h1><img src="public/brand/onesit.svg" alt="OneSIT" width="240" /></h1>

A mobile website for SIT services, academic dates and student events.

[![Checks](https://github.com/holsoma/onesit/actions/workflows/checks.yml/badge.svg)](https://github.com/holsoma/onesit/actions/workflows/checks.yml)
[![Licence: MIT](https://img.shields.io/badge/Licence-MIT-C72535?labelColor=242327)](LICENSE)

[Open OneSIT](https://onesit.vercel.app) · [Contribute](CONTRIBUTING.md) · [Report an issue](https://github.com/holsoma/onesit/issues)

**Not affiliated with SIT.**

</div>

<div align="center">
<img src="docs/media/mobile-home.png" alt="OneSIT home with one countdown and favourite service icons" width="280" height="606" />
<img src="docs/media/mobile-coming-soon.png" alt="Coming-soon services with grey icons and status labels" width="280" height="606" />
</div>

- Shortcuts to IN4SIT, xSiTe, RBS, Campus Map, Student intranet, Academic calendar and ReadyTalent, with favourites on Home.
- The current academic week and one selectable countdown for Final assessment, Trimester break or Recess week, with personal date overrides.
- What’s Happening groups the newsletter into internal events, SITeQuests, external events and announcements, with buttons for registration and other source links. Select a poster to open the original image.
- Favourites, the countdown choice and personal dates are saved in this browser. OneSIT requires no account; school services handle their own sign-in.
- A separate newsletter tool reads `.msg` files and embedded images locally, then exports event summaries for review. Catalogue publication is a separate manual step.

Cates, Wholesome, Punggol transport, MediHub, campus facilities and useful links are listed as coming soon. Android packaging is planned.

The catalogue includes 19 reviewed entries and their posters. Raw newsletters, email metadata and local review files are excluded from the public repository.

## Development

Built with Preact, Vite and TypeScript. Pages are generated as static HTML at build time.

Use Node.js 22.12 or later:

```sh
npm ci
npm run dev
```

Run `npm run check` for type checking, linting, logic tests and a production build. Build output is written to `dist/`. Pushes to `main` deploy to Vercel.

[Setup and browser tests](docs/SETUP.md) · [Architecture](docs/ARCHITECTURE.md) · [Newsletter maintenance](docs/NEWSLETTERS.md) · [Design](DESIGN.md) · [Brand](docs/BRAND.md) · [Validation](docs/VALIDATION.md)

OneSIT is an open-source, student-led app piloted by a member of SIT Vanguard. Its wordmark pays homage to SIT Vanguard. Service icons are original category illustrations.

Application code and original assets use the [MIT licence](LICENSE). Third-party names and material retain their respective rights.
