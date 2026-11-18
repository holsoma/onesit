# Contributing to OneSIT

OneSIT welcomes fixes to links, accessibility, mobile behaviour and public event information. Check existing issues before opening a new one.

## Development

Use Node.js 22.12 or later, run `npm ci`, then `npm run dev`. Before submitting a pull request, run `npm run check`. For an interaction change, build the production app, start `node scripts/serve.mjs`, then run `npx playwright test`.

## Standards

- Use UK English. Keep copy concrete and avoid em and en dashes.
- Keep coming-soon services visible, greyed out and clearly labelled. Do not add a working link until the feature is available.
- Keep all everyday controls usable on touch and keyboard. Check 390px and 320px widths, reduced motion and enlarged text.
- Preserve the initial JavaScript and CSS budgets. Do not add external requests or large libraries to the home screen without evidence that they are needed.
- Keep raw newsletters, email metadata, credentials and student information out of commits and issue reports.
- Verify event information against public sources. See the newsletter guide.

Describe the problem, resulting behaviour and checks in the pull request. Include screenshots for layout changes. No account, analytics or calendar integration is planned for the first release.
