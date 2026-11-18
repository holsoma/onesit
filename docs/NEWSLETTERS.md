# Maintaining What’s Happening

## Review locally

Open `/tools/newsletter` on the local app or deployed website. Choose an Outlook `.msg` file, no larger than 50 MiB. The parser runs on your device. The tool does not upload the file, fetch remote images or execute email HTML.

The source panel contains extracted text, web links and embedded image previews. Images larger than 10 MiB and non-image attachments are omitted. There is no OCR. Read the poster when a date or venue is only present in an image.

The event form exports dated summaries in `events.json` format. Its initial entries are two previously reviewed examples. Load your working file before editing. This export does not replace the public catalogue or include its section groups and posters.

## Publish the catalogue

Home and Events use `src/data/catalogue.json`. The current issue contains 19 entries in the source order: 10 internal events, one SITeQuest, seven external events and one announcement. Past entries, surveys and announcements remain visible.

1. Review each title, organiser, summary, date, venue and poster against the newsletter. Preserve incomplete dates rather than inventing a year or time. The current catalogue uses the display text approved in the local review.
2. Edit the appropriate section in `src/data/catalogue.json`. Keep entry IDs unique. Leave absent dates or venues empty. Retain registration links in `actions` as `{ "label": "Registration form", "url": "https://…" }`. Extract links from the email and decode any QR codes from the original posters. Match each link to the correct item and check redirects. Use survey, report or organiser labels for destinations that are not registration forms. Label known expired links clearly. Do not include review notes, email metadata or recipient information.
3. Store selected original posters and smaller WebP previews under `public/newsletters/`. Set `poster` to the original and `preview` to the smaller image. Supply the preview's pixel `width` and `height`. A poster click opens the original; there is no separate poster link or review commentary.
4. Run `npm run check` and the production browser checks. Confirm all sections, images and poster links work on a phone, then review and commit the changes. Vercel rebuilds from `main`.

The site is public. Publish only material selected for public inclusion. Keep raw `.msg` files, extracted email bodies, recipient information and local review files out of commits. Posters and other third-party material retain their owners' rights and are not covered by OneSIT's MIT licence.

## Current source links

The 19 items contain 20 action links, including the Clean & Green Quest rules. Ten poster QR codes were decoded locally and compared with the email links. QR decoding is a maintenance step and adds no browser dependency.

- The Deepfakes webinar uses the QR code's Google Forms `viewform` URL, rather than the email's submission endpoint.
- The Comic Con email link resolves to the same form ID as its poster QR code.
- The SITeQuest button uses the student IN4SIT portal and retains activity code `0000004686` in the item text. Its poster QR points to the staff portal.
- The SkillsFuture URL was plain text in the email rather than an HTML link.
- The career survey's email URL returns HTTP 410. It is retained with the label `Expired survey link`.
- World Radiography Day provides an organiser updates link; the sustainability announcement links to its report. Neither is labelled as registration.
