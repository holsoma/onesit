# Maintaining What's Happening

## Review locally

Open `/tools/newsletter` on the local app or deployed website. Choose an Outlook `.msg` file, no larger than 50 MiB. The parser runs on your device. The tool does not upload the file, fetch images from the email or execute email HTML.

The source panel contains extracted text, public web links and embedded image previews. Images larger than 10 MiB and non-image attachments are omitted. There is no OCR. Read the poster when a date or venue is only present in an image.

Add each event through the form. Times are entered in Singapore time and exported with `+08:00`. Check the source, dates, venue and public suitability. An event can still be upcoming when its registration has closed; enter a registration deadline when known.

The export list begins with the current feed. Load a newer event file before editing when the deployed site is behind your checkout. Edit or remove entries deliberately, and avoid replacing unrelated events. Adding the same title at the same starting time updates the existing entry.

## Publish

1. Export `events.json`. Only the event schema is included, not the email, recipients or posters.
2. Replace `src/data/events.json` in the checkout with the exported file.
3. Review the diff, run `npm run check` and commit the change. Vercel rebuilds from `main`.

The site is public. Summarise only details suitable for public publication and use a public organiser page as the source. Never commit the original newsletter. The supplied sample is marked SIT Internal and is deliberately excluded.

The initial public feed contains Clean & Green Quest 2026 and the main Singapore Comic Con 2026 programme, verified on the organisers' websites on 18 November 2026. It does not reproduce private student volunteer arrangements or internal registration links.
