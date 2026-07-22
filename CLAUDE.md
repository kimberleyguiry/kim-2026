# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository holds theme assets for a **NationBuilder website** built from a **Figma design**. Use the Figma MCP server (`mcp__figma-desktop__*` tools) to read design context, extract component specs, variables, and screenshots directly from Figma.

## Workflow

Design lives in Figma. Code artifacts (HTML, CSS, Liquid templates) live here and are deployed to NationBuilder.

1. Use Figma MCP tools to inspect designs before writing any code.
2. Extract design tokens (colors, typography, spacing) from Figma variables (`mcp__figma-desktop__get_variable_defs`).
3. Implement as NationBuilder-compatible Liquid templates + CSS.

## NationBuilder Theme Structure

NationBuilder themes use **Liquid** templating (similar to Shopify). Key conventions:
- Templates live in `templates/` and use `.html` extension with Liquid syntax.
- Stylesheets go in `stylesheets/`.
- JavaScript goes in `javascripts/`.
- Static assets (images, fonts) go in `files/`.
- `theme.json` defines theme metadata.

NationBuilder Liquid exposes site/page variables like `{{ site.name }}`, `{{ page.headline }}`, `{{ request.current_user }}`.

## Stylesheet Architecture

Custom styles are appended directly to the bottom of `stylesheets/theme.scss`, after the NB base styles. There is no separate tokens/base/components split — all campaign CSS goes into `theme.scss` as a single appended block.

## Breakpoints

- Mobile: `< 767px`
- Tablet: `768–1279px`
- Laptop: `1280–1920px`
- Desktop: `> 1920px`

## Source file organisation

```
downloaded-from-nb/   READ-ONLY reference — the original theme as downloaded from NationBuilder
templates/            Modified HTML/Liquid templates (partials use _ prefix)
stylesheets/          theme.scss (NB base styles + campaign CSS appended at bottom)
javascripts/          JS files
files/                Images, fonts, SVGs
upload-to-nb/         Deploy target — populated by deploy.sh
```

Do not edit files in `downloaded-from-nb/`. Copy the file you want to change into the appropriate source directory, edit it there, then run `deploy.sh`.

### Layout template partial strategy

`layout.html` is the single entry point for every page render. It uses a layered routing pattern:

#### 1. Homepage bypass
```liquid
{% if page.is_homepage? and page.type_slug == 'basic' %}
  {% include "homepage" %}   {# → _homepage.html, owns everything: nav, hero, footer #}
{% else %}
  ... normal flow ...
{% endif %}
```
The homepage partial is self-contained — it renders its own nav and footer so NB's `_header.html` / `_footer.html` are never included for it.

#### 2. Slug-based custom page routing
For pages that need a fully custom layout (not just content), match on `page.slug` inside the `{% else %}` branch:
```liquid
{% if page.slug == 'about' %}
  <main id="content" role="main">{% include "about" %}</main>
{% else %}
  ... standard NB content flow ...
{% endif %}
```
This bypasses NB's `_content.html` wrapper and lets each partial control its own markup entirely.

#### 3. Conditional script and asset loading
Scripts that are only needed on specific page types are loaded conditionally:
```liquid
{% if page.is_homepage? and page.type_slug == 'basic' %}
  <script src="accordion.js"></script>
{% endif %}
```

#### 4. Non-blocking font loading
Fonts loaded with `media="print" onload` so they never block render:
```html
<link href="https://fonts.googleapis.com/..." rel="stylesheet"
      media="print" onload="this.media='all'" />
<noscript><link href="https://fonts.googleapis.com/..." rel="stylesheet" /></noscript>
```

### Key templates

| File | Role |
|---|---|
| `templates/layout.html` | Master layout — routes homepage to `_homepage.html`; slug-based routing for custom pages; standard NB flow for everything else |
| `templates/_homepage.html` | **Full custom homepage** — owns everything: nav, hero, footer |
| `templates/_header.html` | NB site header (used on non-homepage, non-custom pages) |
| `templates/_footer.html` | NB site footer (used on non-homepage pages) |

Homepage detection: `{% if page.is_homepage? and page.type_slug == 'basic' %}`

## Deploying to NationBuilder

NationBuilder admin: `https://KIM_NB_SLUG.nationbuilder.com/admin/themes`

### Deploy workflow

**After every change: commit and push.** A GitHub Action runs automatically on push and uploads all changed files to NationBuilder — no manual drag-and-drop or template editor steps required.

```bash
git add <files>
bash commit.sh "your commit message"
git push
```

`commit.sh` commits, writes the new hash to `.last-deploy-sha`, and clears `upload-to-nb/`. `git add -u` is called automatically inside it; manually `git add` any new untracked files first.

Before the GitHub Action will work, add the `NB_COOKIES` secret in the GitHub repo settings (Settings → Secrets → Actions). Copy the full Cookie header value from NationBuilder DevTools while logged into admin.

### File reference rules (NationBuilder Liquid)

- CSS in `<link>`: `href="theme.scss"` (bare filename — NB rewrites to CDN URL)
- JS in `<script>`: bare filename — e.g. `src="nav.js"`
- Images in templates: `{{ theme['filename.ext'] }}` — e.g. `{{ theme['hero-background.png'] }}`
- Do **not** use `| asset_url`, `| theme_stylesheet_url`, or `| theme_javascript_url` — not valid NB filters
- Do **not** use `{% extends %}` / `{% block %}` — Django/Jinja2 syntax, invalid in NB Liquid

### Form submissions

NationBuilder form endpoint: `POST /forms/signups`

Required fields:
- `authenticity_token` — use `{{ authenticity_token }}`
- `page_id` — the NB page ID of the signup page (find in NB admin URL)
- `signup[first_name]`, `signup[email]`, etc.

```liquid
{% assign signup_page_id = 999 %}  {# replace with actual page ID from NB admin #}
<form method="post" action="/forms/signups">
  <input type="hidden" name="authenticity_token" value="{{ authenticity_token }}" />
  <input type="hidden" name="page_id" value="{{ signup_page_id }}" />
  ...
</form>
```

## Figma MCP Usage

Use these tools to read the design before implementing anything:
- `mcp__figma-desktop__get_design_context` — full design context for a node
- `mcp__figma-desktop__get_variable_defs` — design tokens (colors, spacing, type)
- `mcp__figma-desktop__get_screenshot` — visual reference for a component or frame
- `mcp__figma-desktop__get_metadata` — file/node metadata
