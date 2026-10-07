# Cleaning Cheats website

A fast, static website for Cleaning Cheats. It uses plain HTML, CSS and JavaScript with no frameworks and no build step, so it can be hosted almost anywhere for free.

```
cleaning-cheats/
├── index.html      Home
├── services.html   Residential, Commercial, Vacation Rentals
├── areas.html      Idaho Falls, Rigby, Rexburg, Island Park
├── about.html      Meet the owner, culture, "Your Cheat Sheet"
├── quote.html      4-step free quote form
├── assets/css/styles.css
├── assets/js/main.js
├── assets/img/     logo.png, logo-mark.png, logo-wordmark.png, logo-original.jpg, owner.webp
├── robots.txt, sitemap.xml
```

## Brand system
| Role | Color | Use |
|---|---|---|
| Logo blue | `#1673BC` | Buttons, links, brand accents (white text passes contrast) |
| Deep navy | `#0B2545` | Headings and important text |
| Sky / pale blue | `#EAF6FD`, `#D9EFFC`, `#BFE3F8` | Backgrounds and organic circles |
| Logo lime | `#93C91E` | Small accents only: check marks, highlighter swipes, one arc. Never use it as text on white |
| Lime (dark) | `#4F7F0A` | Lime-family text or icons when needed |

Fonts are Nunito for headings, Nunito Sans for body text and Caveat for the handwritten notes, all from Google Fonts.

## Before launch checklist

### 1. Confirm the email address
The site uses **cleanercoach@outlook.com** from the earlier brief. If Cleaning Cheats has a different email, search and replace it in all `.html` files and in `assets/js/main.js`.

### 2. Make the quote form deliver to your inbox (5 minutes)
Create a free form at https://formspree.io and paste its URL into `formEndpoint: ''` at the top of `assets/js/main.js`. Until then, a submitted quote opens the visitor's email app.

### 3. Set your domain
Search and replace `https://cleaningcheats.com` in every file if your domain is different.

### 4. Logo files
The logo PNGs are transparent cutouts of the high-res logo (`logo-original.jpg`):
- `assets/img/logo-mark.png`: the circle icon (header, favicon)
- `assets/img/logo-wordmark.png`: "CLEANING CHEATS" text (header)
- `assets/img/logo.png`: the full stacked logo (footer)

If your designer can provide an **SVG** version, it will be even sharper and smaller.

### 5. Add more photos
The owner's photo is on the About page (`assets/img/owner.webp`). Other spots marked with `PHOTO SLOT` comments:
- **Home hero:** a bright photo of a clean room works best.
- **Services:** one photo per service.

Use square `.webp` files about 1000×1000, under ~200 KB each, with a short `alt` description.

### 6. Make the About page yours
Look for `EDIT` comments in `about.html`: add the owner's name (also to the photo's alt text) and story. Remove the "Love a good clean and a great team?" box if you aren't hiring.

### 7. Confirm the copy matches how you work
Edit anything that isn't true:
- "Proudly local to East Idaho"
- "We bring our own supplies and equipment" (FAQ)
- "Let us in with a door code, lockbox or key" (FAQ)
- Rental turnovers: beds made, towels staged, dishes done, a heads-up about damage or low supplies
- Commercial: after-hours cleaning and daily frequency
- "Baseboards dusted" on the living-areas Cheat Sheet
- "2 min to request a quote" stat

### 8. Reviews
A reviews section is built into `index.html` but stays **hidden** until you have real reviews. Remove its `hidden` attribute and paste in real Google reviews. Never publish made-up reviews.

### 9. Also recommended
Create or claim a **Google Business Profile** that uses the same name, phone number and service area.

## Hosting (free options)
- **Netlify** or **Cloudflare Pages:** drag and drop the `cleaning-cheats` folder.
- **GitHub Pages:** push the folder to a repo and turn on Pages.

## Preview locally
```bash
npx http-server cleaning-cheats -p 5173
```

## What's built in
- A mobile-first layout, checked from a 375px phone up to large desktops, with no sideways scrolling.
- A sticky "Call / Free quote" bar on phones and tap-to-call and tap-to-text links throughout.
- Animations that only use transform and opacity, so they stay smooth on low-end phones. Looping animations pause when they're off-screen. All motion turns off when a visitor has turned on "reduce motion".
- Accessibility: skip link, keyboard-friendly menu and tabs, visible focus rings, labeled form fields with specific error messages, and color contrast that meets WCAG AA.
- Local SEO: unique titles and descriptions per page, LocalBusiness structured data with the logo, and a sitemap.
