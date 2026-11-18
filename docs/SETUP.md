# Setup and deployment

## Local development

Install Node.js 22.12 or later. Run `npm ci` and `npm run dev`. The website works without credentials. Use `npm run check` for TypeScript, ESLint, logic tests, prerendering and bundle budgets.

`npm run build` writes the static site to `dist`. `node scripts/serve.mjs` serves these files on port 4400, including production security headers and real 404 responses. Set the `PORT` environment variable to choose another port.

## Vercel

Import the public GitHub repository, select Vite, use `npm run build` and publish `dist`. Production follows `main`. Use preview deployments for pull requests.

The live website is https://onesit.vercel.app, connected to the GitHub repository for deployments from `main`. Preview deployments are handled by Vercel for pull requests.

Set `VITE_SITE_URL` to a different production origin before building a fork, so canonical links, social metadata and the sitemap match its deployment. This is a public value, not a secret. The checked-in default is `https://onesit.vercel.app`.

`vercel.json` sets caching and restrictive security headers. Hashed assets have a one-year immutable browser cache. Pages use the platform's normal static-file handling. The newsletter tool needs same-origin workers and local blob images, not a remote upload endpoint.

Bus estimates use the public ArriveLah endpoint. No API key is required. The content security policy permits connections to `https://arrivelah2.busrouter.sg`; see [Transport data](TRANSPORT.md) for refresh behaviour and source limitations.

## Testing

```sh
npx playwright install chromium
npm run build
node scripts/serve.mjs
# In a second terminal:
npx playwright test
```

The private newsletter integration test is skipped by default. To run it locally, set `ONESIT_PRIVATE_MSG_DIR` to the directory containing your downloaded .msg file. The file is read directly and is not copied into the project.

Set `PLAYWRIGHT_BASE_URL` when testing a preview on a different port. Transport browser tests intercept the bus API with synthetic responses; CI does not depend on live transport data.

## Android later

Use Capacitor with `webDir: 'dist'` after the web release is stable. Package the static files, keep external school logins in the system browser, and test the Android back button, safe-area padding and local preferences. No Android project, signing keys or APK is included in the first web release.
