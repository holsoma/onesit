# Maintaining What’s Happening

## Review locally

Open `/tools/newsletter` on the local app or deployed website. Choose an Outlook `.msg` file, no larger than 50 MiB. The parser runs on your device. The tool does not upload the file, fetch remote images or execute email HTML.

The source panel contains extracted text, web links and embedded image previews. Images larger than 10 MiB and non-image attachments are omitted. There is no OCR. Read the poster when a date or venue is only present in an image.

The event form exports dated summaries in `events.json` format. Its initial entries are two previously reviewed examples. Load your working file before editing. This export does not replace the public catalogue or include its section groups and posters.

## Publish the catalogue

Home and Events use `src/data/catalogue.json`. The current issue contains 19 entries in the source order: 10 internal events, one SITeQuest, seven external events and one announcement. Past entries, surveys and announcements remain visible.

1. Review each title, organiser, summary, date, venue and poster against the newsletter. Preserve incomplete dates rather than inventing a year or time. The current catalogue uses the display text approved in the local review.
2. Edit the appropriate section in `src/data/catalogue.json`. Keep entry IDs unique. Leave absent dates or venues empty. Do not include review notes, email metadata or recipient information.
3. Store selected original posters and smaller WebP previews under `public/newsletters/`. Set `poster` to the original and `preview` to the smaller image. Supply the preview's pixel `width` and `height`. A poster click opens the original; there is no separate poster link or review commentary.
4. Run `npm run check` and the production browser checks. Confirm all sections, images and poster links work on a phone, then review and commit the changes. Vercel rebuilds from `main`.

The site is public. Publish only material selected for public inclusion. Keep raw `.msg` files, extracted email bodies, recipient information and local review files out of commits. Posters and other third-party material retain their owners' rights and are not covered by OneSIT's MIT licence.
