# Magic Moments Photography

Next.js 16, React 19 and Motion for React, built with Node.js 22 or newer.

## Develop

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Edit `app/page.js` for content, gallery order, and interactions; edit `app/globals.css` for the design. The gallery data is at the top of `app/page.js`. Add original photographs to `public/assets/portfolio/` and add entries to that array.

## Build and publish to the existing GitHub Pages site

```sh
npm run pages
```

This builds a prerendered Next.js static export in `out/` and copies it to `docs/`. Commit the source and generated `docs/` together. Keep GitHub Pages configured to deploy from **main /docs**. The custom domain `mmphotographi.ca` is preserved by `public/CNAME`; `.nojekyll` allows Pages to serve Next.js `_next` files. Source changes alone do not update the published site: regenerate `docs/` before committing a release.

GitHub Pages serves the generated HTML, CSS and JavaScript. Node.js runs the development and build tools; a paid Node server is not required. If server-side submissions or a CMS are needed later, deploy this source to a compatible Node host and change the export configuration.

## Features

- Crossfading, gently zooming hero slideshow with manual controls and pause/play.
- Scroll progress, photo parallax and viewport reveals.
- Animated category filters covering all 23 original portfolio images.
- Native modal image viewer with arrow keys, Escape, focus restoration and background scroll locking.
- Image-first layout with the gallery directly after the hero, native photo proportions, a full-width film feature, compact about/FAQ sections and an inquiry form.
- Reduced-motion preferences, visible keyboard focus, skip link and labeled controls.
- Prerendered content, social metadata, local WebP assets and lazy gallery loading with reserved image dimensions.

## Inquiry form

The form validates the input and opens a draft addressed to `info@mmphotographi.ca`. The visitor must send it in their email app. There is no server-side delivery or submission database. To send directly from the website, connect a form service or a backend first.

## Release checks

Run `npm run pages`. In a browser, verify the slideshow controls, each gallery filter, view-all, lightbox arrows/Escape/focus, FAQ disclosure, mobile menu, and form validation. Check mobile widths and reduced-motion settings before publication. The previous plain HTML design remains in Git history for rollback.
