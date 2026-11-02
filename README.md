# Re-Elect Kimberley Guiry 2026

Campaign website for Kimberley Guiry, Langford City Council (BC municipal election, October 17, 2026).

- Live: https://kimberleyguiry.github.io/kim-2026/
- Domain: https://www.kimberleyguiry.ca (not yet pointed at GitHub Pages)

## The site

`site/` is the whole website: plain HTML, CSS and JavaScript with no build step.

```
site/
  index.html          homepage
  <page>/index.html   other pages (/about → about/index.html)
  404.html            not-found page
  assets/             styles, scripts, images and fonts
```

Preview it locally:

```bash
npx serve@14.2.4 site    # http://localhost:3000
```

## Editing

- Pages are plain HTML. The header, navigation and footer are repeated in every page, so sitewide changes must be made in every `site/**/index.html`.
- Styles live in `site/assets/theme/theme.css`.
- Put new images in `site/assets/content/` and reference them as `/assets/content/<file>`.
- Links and asset paths start at the site root (`/about`, `/assets/...`).

## Forms

The sign-up, contact, feedback, volunteer, lawn sign and donation forms are switched off. Each one shows an email link (vote@kimberleyguiry.ca) instead, except the donation form, which has no replacement. The original forms are kept as HTML comments.

```bash
python3 tools/toggle-forms.py enable    # restore the forms
python3 tools/toggle-forms.py disable   # switch them off again
```

The forms have no backend: they need a submission endpoint (and a payment provider for donations) before they are turned back on.

## Deployment

`.github/workflows/pages.yml` publishes `site/` to GitHub Pages on every push to `main` that changes it, or on demand from the Actions tab.

While the site is served from `kimberleyguiry.github.io/kim-2026/`, the workflow runs `tools/set-base-path.py` to prefix the site's root-relative links with `/kim-2026`. To move to the real domain:

1. Add `site/CNAME` containing `www.kimberleyguiry.ca`.
2. Set the custom domain under Settings → Pages.
3. Point the domain's DNS at GitHub Pages.

The workflow then publishes `site/` unchanged.

## Other folders

`templates/`, `stylesheets/`, `javascripts/`, `files/`, `downloaded-from-nb/` and `upload-to-nb/` hold the theme from the site's previous hosting platform. The website does not use them.
