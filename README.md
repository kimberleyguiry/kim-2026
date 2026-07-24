# kim-2026

NationBuilder theme for Kimberley Guiry's 2026 Langford City Council campaign, built from a Figma design. See `CLAUDE.md` for full project conventions (file structure, Liquid rules, deploy workflow).

## Status

### Done

- **Base theme seeded** from the downloaded NationBuilder theme (`downloaded-from-nb/` is the read-only reference; `templates/`, `stylesheets/`, `javascripts/` hold the working copies).
- **Homepage header + hero banner** implemented from the Figma design (`templates/_homepage.html`, custom CSS appended to `stylesheets/theme.scss`):
  - Custom nav header with the "Re-Elect Kimberley Guiry" logo, page links pulled dynamically from `site.root_nav_pages` (with dropdown support for children), and a Donate button.
  - Mobile hamburger menu + slide-out panel, wired up via `javascripts/km-nav.js`.
  - Hero banner: headline, intro copy, decorative colour stripes, and a rotated "polaroid" photo collage with handwritten-style captions, all positioned with percentage-based CSS to stay responsive.
  - Section background uses the light grain texture (`files/grain-for-light-bks.png`) per the design.
  - `templates/layout.html` updated to route the homepage (`page.is_homepage? and page.type_slug == 'basic'`) to `_homepage.html`, matching the layered routing pattern used in the sibling `keith-2026`/`colby-2026` projects. Non-blocking Google Fonts (Inter, La Belle Aurore) and a Cal Sans `@font-face` (via jsdelivr CDN, since Cal Sans isn't on Google Fonts) were added to `<head>`.
- **Assets pulled from Figma and committed**: 5 hero photos (downloaded from the Figma desktop asset server, converted PNG → JPEG to shrink file size) in `files/hero-photo-{1-5}.jpg`. The logo assets (`kim-logo-dark-2x.png`, `kim-logo-light-2x.png`) and grain textures were already present in `files/`.
- Verified visually with a local static HTML/CSS mockup (compiled `theme.scss` + swapped-in sample data) screenshotted at desktop, tablet, and mobile widths via headless Chrome — not a substitute for checking the live NationBuilder render, but confirms the layout and responsive breakpoints behave as intended before deploying.
- Committed and pushed (`ea705d2`) — the GitHub Action should have deployed this to the NationBuilder theme automatically.
- **Homepage "Doing the work that I promised" intro/progress section** implemented from the Figma `intro-section` node (`templates/_homepage.html`, CSS appended to `stylesheets/theme.scss`):
  - Intro heading + two-column lead paragraphs, with vertical purple/red/orange stripe band running the full height of the section (`.km-intro__stripes`).
  - Three-photo "showcase" row (safe sidewalks / tree planting / family doctors) with rounded, purple-tinted photo overlays matching the hero polaroid treatment.
  - "Bringing Langford to the regional table" block: paragraph + two-column checklist (Font Awesome `circle-check` icons) + portrait photo.
  - Five-box stat counter row (`.km-counters`) and a "See more progress" CTA button reusing the existing `.km-btn--donate` styling (identical color spec in Figma).
  - Responsive behavior added for tablet/laptop (`<1279px`, showcase/progress stack into a single column) and mobile (`<767px`, stripes go horizontal, counters stack).
  - 4 new photos downloaded from the Figma asset server and converted PNG → JPEG, committed to `files/intro-photo-{sidewalks,tree,clinic,kimberley}.jpg`.
  - Not yet verified against the live NationBuilder render or in a browser — visual QA is being done directly by the user rather than via local mockups going forward.
- **Homepage "What I'm fighting for" section** implemented from the Figma `content-container` node (`templates/_homepage.html`, CSS appended to `stylesheets/theme.scss`):
  - Dark navy full-bleed section with the dark grain texture (`files/grain-for-dark-bks.png`) behind the text column, matching the `.km-page--light` treatment used elsewhere but inverted for dark sections.
  - Three priority groups (orange/red/purple left-border accent bars), each with a Cal Sans heading and a Font Awesome `circle-check` checklist.
  - Email signup block (name + email fields, "Stay informed" button) wired as a real NationBuilder `/forms/signups` POST per the `CLAUDE.md` form conventions — `page_id` is a placeholder (`999`) pending a real NB signup page.
  - Responsive stacking for tablet/laptop and mobile, mirroring the pattern used in the intro section.
  - **Right-column photo** — the Figma MCP tool could not export the bus-stop/tree photo fill on the `right-50` frame programmatically (every `get_design_context`/`get_metadata` call returned it as an empty node, despite the screenshot clearly showing a photo); the user exported it manually from Figma and it's committed as `files/fighting-photo-bus-stop.jpg`.

### Next steps

1. **Verify the live render.** Log into the NationBuilder admin and check the homepage actually renders as expected — Liquid tags (`site.root_nav_pages`, `theme[...]`, etc.) can only be fully verified against real site data.
2. **Confirm nav pages exist in NationBuilder** matching the design (About, Issues, Progress, Get Involved [with children for a dropdown], Contact) and that a donation page is set up so the Donate button links correctly.
3. **"See more progress" button target** — currently links to `/progress`, a guessed slug. Confirm the real Progress page exists in NB admin and update the href if it differs.
4. **"Stay informed" signup page_id** — currently a placeholder (`999`). Create the real NB signup page for this form and update `fighting_signup_page_id` in `_homepage.html`.
5. **Footer** — `_homepage.html` currently includes the stock NationBuilder `_footer.html` unstyled. It needs a custom footer matching the campaign brand once that part of the Figma design is reviewed.
6. **Dropdown menu content** — the "Get Involved" nav item renders a dropdown shell (`.km-nav__dropdown-menu`) driven by `child.nav_children`; it needs actual NationBuilder child pages under "Get Involved" to populate it.
7. **Cal Sans licensing/hosting** — currently loaded from the `cal-sans` npm package via jsdelivr CDN. Confirm this is acceptable for production (uptime/licensing) or self-host the font files in `files/` instead.
8. **Non-homepage pages** (About, Issues, Contact, etc.) still render through the stock NationBuilder header/footer/content flow — only the homepage has custom styling so far.
9. **Remaining homepage sections below "What I'm fighting for"** (if any further sections exist in Figma) still need to be scoped and implemented.
