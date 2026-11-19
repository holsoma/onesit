# Maintaining What’s Happening

## Review locally

Open `/tools/newsletter` on the local app or deployed website. Choose an Outlook `.msg` file, no larger than 50 MiB. The parser runs on your device. The tool does not upload the file, fetch remote images or execute email HTML.

The source panel contains extracted text, web links and embedded image previews. Images larger than 10 MiB and non-image attachments are omitted. There is no OCR. Read the poster when a date or venue is only present in an image.

The event form exports dated summaries in `events.json` format. Its initial entries are two previously reviewed examples. Load your working file before editing. This export does not replace the public catalogue or include its section groups and posters.

## Publish the catalogue

Home and Events use `src/data/catalogue.json`. The 19 November 2026 update contains seven entries: two internal items, two external events and three announcements. The owner requested removal of older events, including HackRift. The previous sustainability report remains with the two new promotions.

1. Review each title, organiser, summary, date, venue and poster against the newsletter. Check linked registration pages for deadlines and explicit closure notices without submitting forms. Preserve incomplete dates rather than inventing a year or time. Remove passed events and closed registrations. A future event date does not mean registration is still open.
2. Edit the appropriate section in `src/data/catalogue.json`. Keep entry IDs unique. Record `addedOn` as the date added to OneSIT. Leave absent display dates or venues empty. Retain registration links in `actions` as `{ "label": "Registration form", "url": "https://…" }`. Extract links from the email and decode any QR codes from the original posters. Match each link to its item and check redirects. Use survey, report or organiser labels for destinations that are not registration forms. An offer without a source link may use an empty actions array; its poster still opens. Do not invent registration links or include review notes, email metadata or recipient information.
3. Store selected original posters and smaller WebP previews under `public/newsletters/`. Set `poster` to the original and `preview` to the smaller image. Supply the preview's pixel `width` and `height`. A poster click opens the original; there is no separate poster link or review commentary.
4. Use optional `registrationCloses` and `endDate` fields in `YYYY-MM-DD` format. Dates are inclusive in Singapore time. If a source explicitly says “before 30 November”, use 29 November as the final available date. An individual action can use `closesOn`, allowing a merchandise order to expire without removing a feedback form. Do not assign a closing date to a form when no deadline is stated.
5. Announcements retains the newest three entries by `addedOn`. Put newer additions first when dates are tied. Adding a fourth hides the oldest, and expired offers are filtered before applying the limit. Empty sections and their navigation links are omitted.
6. Run `npm run check` and the production browser checks. Confirm counts, deadline boundaries, images and poster links work on a phone, then review and commit the changes. Remove unused public poster files from the current deployment. Vercel rebuilds from `main`.

The site is public. Publish only material selected for public inclusion. Keep raw `.msg` files, extracted email bodies, recipient information and local review files out of commits. Posters and other third-party material retain their owners' rights and are not covered by OneSIT's MIT licence.

The static HTML reflects the build date. The browser refreshes date filtering every 30 seconds and on return to the tab. Undated forms and capacity-based closures require manual review.

## Current source checks

Checked on 19 November 2026. Seven items have eight action links. The Sushi-GO offer has no source link and uses its clickable poster. Four QR codes were decoded from the new posters. QR decoding is a maintenance step and adds no browser dependency.

| Item | Date or availability evidence |
| --- | --- |
| SIT Beach Clean-Up | The embedded poster gives 25 November 2026, 3.45pm to 6pm. The email's TinyURL resolves to the current [Qualtrics form](https://sit.au1.qualtrics.com/jfe/form/SV_eniq5z6aRsJzvb8). No registration deadline was stated. The event end date is used as the final fallback. |
| art;SITry | Both QR codes match the email's feedback and merchandise forms. The [pre-order form](https://sit.au1.qualtrics.com/jfe/form/SV_3OsZC0qB4Ah11Ua) says to order before 30 November 2026. Only that action expires after 29 November. The feedback form has no stated closing date. |
| Grandparents' Day | [OnePA](https://www.onepa.gov.sg/events/grandparents-day-2026-one-punggol-e48686298) gives 21 November 2026 as the registration closing date. The email and poster say registration may close earlier when tickets are taken. Live vacancies require sign-in and were not verified. |
| YMUN Singapore IV | [The organiser](https://ymuns.org/register) lists regular registration closing on 31 January 2027, after the early deadline of 15 November 2026. The conference runs from 12 to 14 March 2027. Its FAQ lists secondary school and junior college delegate eligibility, which is included in the summary. |
| Kin Teck Tong | Its poster QR resolves to the [organiser's Linktree](https://linktr.ee/kintecktong), with service, branch and appointment links. No expiry is stated. |
| Sushi-GO | The email and poster give a weekday dine-in offer at Punggol Coast Mall, excluding public holidays. No expiry or registration URL is stated. |
| SIT Sustainability Report | Retained as the oldest of the three announcements, with its original poster and report link. |
