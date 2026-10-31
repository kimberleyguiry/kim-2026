# AGENTS.md — Kimberley Guiry — Langford City Council 2026

Read this first. It is written for a person or coding agent picking this repo up again, possibly years later (the next BC municipal general election is expected in **October 2030**).

## Status (as of 2026-10-26)

- The site **used to run on NationBuilder** (NB). NB is being **deprecated entirely**; the site is moving to a static host.
- **`site/` is the source of truth.** It is a plain static website (HTML/CSS/JS, no build step). Edit it directly.
- Everything else (`templates/`, `stylesheets/`, `javascripts/`, `files/`, `downloaded-from-nb/`, `deploy.sh`, `commit.sh`, `upload-to-nb/`) is the **archived NationBuilder theme**, kept for reference only. Nothing reads it any more.
- The NationBuilder deploy GitHub Action is **disabled**: it was moved from `.github/workflows/` to `.github/disabled-workflows/deploy-nationbuilder.yml`, so it never runs. Do not move it back unless you are deliberately reviving NationBuilder.
- **Hosting is not set up yet.** As of this date the domain still pointed at NationBuilder's proxy. See [Hosting](#hosting).
- **Forms do not submit anywhere.** See [Forms](#forms).
- 2026 campaign context: election day was **October 17, 2026**. Sibling sites built the same way: `colby-2026` (www.colbyharder.ca) and `keith-2026` (www.keithyacucha.ca).

## Quick start

```bash
npx serve@14.2.4 site        # preview at http://localhost:3000 (clean URLs + 404.html)
```

Commit with plain `git` (`git add … && git commit`). `commit.sh` only matters for the NationBuilder flow; using it is harmless but unnecessary.

## Repository layout

```
site/                       THE WEBSITE — deploy this folder as the web root
  index.html                homepage
  <slug>/index.html         every other page (clean URLs: /about → about/index.html)
  404.html                  not-found page
  assets/theme/             theme CSS (compiled theme.css), JS, images, fonts
  assets/content/           images that had been uploaded through the NB admin (page/meta images)
  assets/nb/                a few NB platform images referenced by theme.css (payment icons etc.)
  assets/static/            hand-written glue for running without NB:
    nb-shim.js              stubs the NB JS globals the theme scripts expect
    static-forms.js         makes every form inert (see Forms)
tools/nb-to-static.py       the one-off NB → static mirroring script (needs a live NB site; see below)
tools/toggle-forms.py       comments the forms out / restores them (see Forms)
docs/nationbuilder-theme.md archived NB-era developer guide (Liquid conventions, Figma tokens, components)
.github/disabled-workflows/ archived NB deploy Action
templates/ stylesheets/ javascripts/ files/ downloaded-from-nb/   archived NB theme source
```

## How the static site was made

On 2026-10-26 `tools/nb-to-static.py https://www.kimberleyguiry.ca` crawled the live NB site and:

- saved every internal page reachable from the homepage/sitemap (21 pages + `404.html`);
- removed the NB runtime: NB JS bundles, CSRF tokens, login button + sign-in modal, Facebook/Twitter SDKs, reCAPTCHA, Stripe, Cloudflare scripts;
- replaced NB's bundled jQuery with jQuery 3.7.1 from cdnjs plus `assets/static/nb-shim.js`;
- downloaded all theme and content assets into `site/assets/` and rewrote URLs to root-relative `/assets/...`;
- decoded Cloudflare-obfuscated email links back to plain `mailto:`;
- rewrote every `<form>` to `action="#" data-static-form` and appended `static-forms.js` to every page.

Verified at the time: every page loaded in headless Chrome with no JS errors, no failed requests and no requests to NationBuilder, and page heights matched the live NB site (except `/donate`, which lacks the Stripe card element).

**The script cannot be re-run once the NB site is gone**, and re-running it while NB is up overwrites any hand edits to `site/**/*.html`. Treat it as historical documentation of the transformation.

### What did NOT carry over

- **Supporter data** (people, sign-ups, donations, survey responses, volunteer lists, email lists) lives in the NationBuilder database, not in this repo. It must be exported from NB before the account is closed; nothing here can recover it.
- **Unpublished theme edits**: anything committed to `templates/`/`stylesheets/` but never deployed to NB is not in `site/`. The mirror reflects what was live. Check [Site-specific notes](#site-specific-notes) for known undeployed work.
- **Logins, donations/payments, petitions, event RSVPs** — anything that needed NB's backend.

## Editing the site

- Content is plain HTML in `site/**/index.html`. The header/nav and footer are **duplicated in every page** (there is no templating). To change the nav, footer, or anything sitewide, edit all pages, e.g. with a script or `sed` across `site/**/*.html`, and check with `git diff`.
- Styles: edit `site/assets/theme/theme.css` directly (it is NB's compiled output of `stylesheets/theme.scss`; URLs inside it were rewritten to `/assets/...`). `stylesheets/theme.scss` still compiles with `npx sass@1.77.8 --load-path=stylesheets stylesheets/theme.scss`, but its asset URLs are NB-style bare filenames, so recompiling into `site/` needs those URLs fixed — prefer editing the CSS.
- New page: copy an existing `site/<slug>/index.html` into a new folder, update `<title>`, meta/OG tags, canonical URL and body content, and add it to the nav on every page.
- Images: put new files in `site/assets/content/` (or `assets/theme/`) and reference them root-relatively (`/assets/...`).
- Absolute URLs: `<link rel="canonical">`, `og:url`, `og:image` use `https://www.kimberleyguiry.ca`. Update them if the domain changes.

### Things that will be stale in 2030

Search before relaunching:

- Election date and year: `grep -rn "October 17\|2026" site --include='*.html'` (titles, hero copy, donate page, footer, calendar `.ics` data URI).
- Elections BC disclosure text ("Authorized by … Financial Agent") in the footer of every page.
- Third-party embeds and links (news articles, Instagram/Facebook embeds) may have rotted.
- Google Analytics property `G-JYJ90ZPXXQ` (gtag snippet in every page `<head>`): confirm it still exists/is wanted, or remove/replace it.
- CDN dependencies (pinned versions; confirm they still resolve, or vendor them into `site/assets/`):
  - `https://cdn.jsdelivr.net/npm/cal-sans@1.0.1/…`
  - `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css`
  - `https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js`
  - Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`)

## Forms

**As of 2026-10-31 the forms are commented out.** `python3 tools/toggle-forms.py disable` wrapped every submission form in an HTML comment (`<!--FORM-DISABLED ... FORM-DISABLED-->`) and put a `<p class="static-form-email">` with a `mailto:` link in its place. Where the visible UI lived outside the `<form>` (a scripted multi-step widget), the whole wrapper was commented out instead. `python3 tools/toggle-forms.py enable` restores the exact original markup (verified byte-for-byte). Inside a disabled block, `-->` is stored as `--&gt;`; do not hand-edit those blocks. The email lines get small contrast fixes at the end of `site/assets/theme/theme.css` (search for `static-form-email`), which can stay or go once the forms are back. Intro copy that pointed at a form ("fill out the form below", "sign up below") was reworded to point at email in the commit "Reword page copy that referred to the forms"; revert those copy edits when the forms come back.

The rest of this section describes the forms as they behave when enabled.

Nothing is submitted anywhere. `site/assets/static/static-forms.js`:

- blocks ordinary form submits and shows a notice ("Online forms are being moved … please email us");
- intercepts scripted `fetch()` POSTs to `#` or `/forms/...` and returns a **fake 200**, so multi-step/scripted forms show their normal success message. **That success message is a lie until a backend exists** — fix this before real visitors use the site.

To connect a backend: give each `<form>` a real `action` (or change the scripts' `fetch` target), then delete or narrow `static-forms.js`. Field names are NationBuilder-style (`signup[email]`, `feedback[content]`, …); a new backend can accept them or the forms can be renamed.

`/donate` cannot take payments (the Stripe element was NB-hosted, and NB's JS also injected the Province field). Either link to an external donation processor, remove the page, or rebuild the form against a new payment provider.

Form inventory at mirror time (hidden/system fields such as `page_id`, `return_to`, honeypots omitted):

- **donation** on `/donate`: `donation[amount_option]`, `donation[amount]`, `donation[donation_occurrence]`, `donation[first_name]`, `donation[last_name]`, `donation[email]`, `donation[billing_address_attributes][phone_number]`, `donation[billing_address_attributes][country_code]`, `donation[billing_address_attributes][address1]`, `donation[billing_address_attributes][address2]`, `donation[billing_address_attributes][address3]`, `donation[billing_address_attributes][city]`, `donation[billing_address_attributes][state]`, `donation[billing_address_attributes][zip]` …
- **feedback** on `/contact`, `/get_a_lawn_sign`, `/give_feedback`: `feedback[content]`, `feedback[first_name]`, `feedback[last_name]`, `feedback[email]`, `feedback[mobile_number]`, `feedback[email_opt_in]`, `feedback[mobile_opt_in]`, `feedback[submitted_address]`
- **km-fighting__form** on `/`, `/progress`: `signup[first_name]`, `signup[email]`
- **signup** on `/`, `/get_involved`, `/signup_form`, `/tags/featured` +4 more: `signup[email]`
- **signup** on `/signup_form`: `signup[first_name]`, `signup[last_name]`, `signup[email]`, `signup[mobile_number]`, `signup[email_opt_in]`, `signup[mobile_opt_in]`, `signup[activity_is_private]`, `signup[recruiter_id]`, `signup[author_id]`
- **volunteer_signup** on `/volunteer`: `volunteer_signup[volunteer_type_ids][]`, `volunteer_signup[first_name]`, `volunteer_signup[last_name]`, `volunteer_signup[email]`, `volunteer_signup[mobile_number]`, `volunteer_signup[email_opt_in]`, `volunteer_signup[mobile_opt_in]`, `volunteer_signup[phone_number]`, `volunteer_signup[phone_time]`, `volunteer_signup[submitted_address]`, `volunteer_signup[availability]`, `volunteer_signup[content]`

### Known dead links (NationBuilder-only features)

These pointed at NB account/RSS features that no static host provides. Remove them, or the surrounding "sign in"/"subscribe" UI, when convenient:

- `/login` (on 8 pages, e.g. `/`)
- `/news.rss` (on 5 pages, e.g. `/campaign_aims_at_making_post_childbirth_care_more_accessible_for_b_c_moms`)

## Hosting

Requirements for any static host:

- Serve `site/` as the **domain root** (paths are root-relative `/assets/...`; a sub-path such as `user.github.io/repo/` breaks them unless rewritten).
- Directory index (`/about` → `/about/index.html`, with or without trailing slash) and `404.html` as the not-found page. GitHub Pages, Netlify, Cloudflare Pages and `npx serve` all do this by default.
- GitHub Pages notes: it cannot publish from `site/` directly (only `/` or `/docs`), so use a Pages Actions workflow that uploads `site/`; private repos need a paid plan; add `site/CNAME` containing `www.kimberleyguiry.ca`.
- DNS (as of 2026-10-26): `www.kimberleyguiry.ca` was a CNAME to a NationBuilder proxy. Repoint it (and the apex domain) to the new host before NB is shut off, or the site goes down.

## NationBuilder reference (archived)

| | |
|---|---|
| Public domain | `https://www.kimberleyguiry.ca` |
| NB host | `kimguiry-langford2026electioncampaign.nationbuilder.com` (same nation as Colby, `langford2026electioncampaign`) |
| NB site id / theme id | `100` / `6a61495296e98f3c61a49839` |
| Admin | `https://<NB host>/admin/sites/100/themes/6a61495296e98f3c61a49839` |
| Deploy | `.github/disabled-workflows/deploy-nationbuilder.yml` ran `deploy.sh --upload` with the `NB_COOKIES` repo secret (an NB admin session cookie). That secret is now useless and can be deleted. |

`docs/nationbuilder-theme.md` is the full NB-era guide (Liquid rules, upload paths, Figma workflow). `downloaded-from-nb/` is the pristine theme as downloaded from NB.

To **revive** NationBuilder (unlikely): restore the workflow file to `.github/workflows/`, refresh the `NB_COOKIES` secret, and follow `docs/nationbuilder-theme.md`. Note that `site/` would then be out of sync with NB.

## Site-specific notes

- **`site/` does not contain the custom Platform page.** Commits `f59775c` and `c95208e` (2026-09-23) failed to deploy to NB (expired session cookie) and the deploy was then disabled, so `site/platform/index.html` is the older live NB page. Undeployed files: `templates/_platform_page.html` (new page), `templates/layout.html` (slug routing), `javascripts/km-accordion.js`, `files/platform-sidebar-kimberley.webp`, ~216 lines of `stylesheets/theme.scss`. See `git diff 5b940c9 HEAD -- templates stylesheets javascripts files`. To recover it, port by hand: render the Liquid partial's HTML into `site/platform/index.html` (replace `{{ theme['x'] }}` with `/assets/theme/x`, drop Liquid tags), copy the JS/image into `site/assets/theme/`, and compile the new SCSS rules (`npx sass@1.77.8`) and append them to `site/assets/theme/theme.css`.
- The "What I'm fighting for" sign-up (`.km-fighting__form`, on `/` and `/progress`) is submitted by `site/assets/theme/km-signup-forms.js` via `fetch()`. `static-forms.js` fakes a success response, so it shows the normal thank-you message **without saving anything**.
- The Cal Sans font is loaded from `cdn.jsdelivr.net/npm/cal-sans@1.0.1` inside `site/assets/theme/theme.css`.
- `README.md` is the original build log from the NationBuilder era (historical).
