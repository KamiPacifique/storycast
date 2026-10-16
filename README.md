# StoryCast

An accessible 3-page microsite for audio and video storytelling. Built with semantic HTML5, Sass and a little vanilla JavaScript. No frameworks.

- **Design:** see the Figma board (sitemap, content hierarchy, wireframes, high-fidelity mockups).
- **Pages:** Home, Story (detail, 4 story files from one template), About / Access.

---

## Project structure

```
storycast/
├── index.html                 Home
├── about.html                 About / Access
├── story/                     One file per story (same template)
│   ├── the-net-mender.html
│   ├── night-frequencies.html
│   ├── wedding-photograph.html
│   └── terraces-at-first-light.html
├── sass/
│   ├── main.scss              Entry point: declares @layer order, loads partials
│   ├── abstracts/             Tokens (no CSS output on their own)
│   │   ├── _colors.scss       Colour tokens + contrast ratios
│   │   ├── _typography.scss   Font stacks + fluid type scale
│   │   ├── _spacing.scss      4px spacing scale, radii, content width
│   │   ├── _breakpoints.scss  sm 640px, lg 1024px
│   │   ├── _mixins.scss       up()/down(), visually-hidden, focus-ring
│   │   ├── _tokens.scss       Emits tokens as CSS custom properties
│   │   └── _index.scss        Forwards all of the above
│   ├── base/                  _reset, _base, _focus
│   ├── layout/                _container, _grid, _header, _footer
│   ├── components/            _button, _chip, _media-card, _player, _transcript, ...
│   ├── pages/                 _home, _story, _about
│   └── utilities/             .visually-hidden, .skip-link
├── css/main.css               Compiled output (committed so the site runs without a build)
├── js/main.js                 Menu, library filter, transcript sync (progressive enhancement)
├── assets/
│   ├── media/                 Placeholder 30s audio/video (replace with real media)
│   ├── captions/              WebVTT captions (.vtt), one per story
│   └── transcripts/           Plain-text transcripts (.txt), one per story
└── package.json               Sass build scripts
```

### CSS architecture

- **Cascade layers:** `@layer reset, tokens, base, layout, components, pages, utilities;` declared once in `main.scss`. Later layers always win, so specificity battles don't happen.
- **BEM naming:** `block__element--modifier`, e.g. `.media-card`, `.media-card__thumb`, `.media-card--plain`, `.transcript__cue`, `.site-nav__link`. No IDs are used for styling.
- **Tokens:** Sass variables are the single source of truth; `_tokens.scss` also emits them as CSS custom properties.
- **Container query:** `.media-card-wrap` is the container. `.media-card` is a two-column row, and switches to a stacked layout when its container is under 480px. The same component sits in the 3-up weekly grid (stacked), the 2-up library (row) and on mobile (stacked).
- **Responsive layout:** CSS Grid for page and card layouts, Flexbox for header, meta rows and controls. Mobile-first with two breakpoints.

---

## Running locally

The compiled CSS is committed, so you can open the site straight away:

```bash
# from the project folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

Serve over HTTP (not `file://`) so captions (`.vtt`) load correctly.

To edit the Sass:

```bash
npm install          # installs Sass
npm run build        # compile sass/main.scss → css/main.css
npm run watch        # recompile on save
```

---

## Placeholder content

- `assets/media/*` are silent-ish 30-second placeholders so the players work. Replace them with real files using the same names (or update the `<source>` paths).
- Transcript and caption cues are spaced 5 seconds apart to match the 30s placeholders. When you swap in real media, update `data-start` / `data-seek` in each story's transcript and the timestamps in the matching `.vtt` file.
- Story thumbnails are CSS gradients with descriptive `aria-label`s. Swap in `<img>` elements with `alt` text when you have photography.

---

## Accessibility checklist (WCAG 2.1 AA)

| Requirement | How it is met |
|---|---|
| **Captions for video** | Both video stories use `<video controls>` with `<track kind="captions" srclang="en" default>` pointing to a `.vtt` file. |
| **Captions for audio** | Audio stories include a `<track kind="captions">`; `main.js` reads the cues and shows them as live captions above the player. |
| **Transcripts for all media** | Every story page has a full on-page transcript (speaker labels + timestamps) and a downloadable `.txt`. Timestamps are buttons that jump to that moment. |
| **Semantic structure** | `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<figure>` / `<figcaption>`, `<footer>`, `<ol>`, `<dl>`, `<time>` used where they fit. |
| **Heading hierarchy** | One `<h1>` per page; `<h2>` for sections; `<h3>` for items inside them; no skipped levels. |
| **Landmarks labelled** | Multiple `<nav>`s and sections are named with `aria-label` / `aria-labelledby` ("Primary", "Breadcrumb", "Explore", each section's heading). |
| **Skip link** | First focusable element on every page: "Skip to main content" → `#main`. |
| **Keyboard navigation** | Everything is reachable and operable by keyboard. Native media controls, real `<button>`s for filters, menu and timestamps. Escape closes the mobile menu. |
| **Visible focus** | One 3px high-contrast `:focus-visible` ring on every interactive element; a lighter ring on dark backgrounds. |
| **Colour contrast** | All text/background pairs ≥ 4.5:1 (see `_colors.scss`, ratios listed beside each token). Chip, button and link colours checked in every state. |
| **Not colour alone** | Current page is marked with an underline and bold weight, not only colour; filter state uses fill plus `aria-pressed`. |
| **ARIA only where needed** | `aria-current` (nav, breadcrumb, active transcript cue), `aria-expanded` / `aria-controls` (menu), `aria-pressed` (filter), `role="status"` (filter count), `role="img"` + `aria-label` on gradient thumbnails. Decorative play icons are `aria-hidden`. |
| **Touch targets** | Buttons, filters and timestamps are at least 44px tall. |
| **Responsive and reflow** | No horizontal scrolling at 390px; layouts reflow at 640px and 1024px; text uses `rem` and scales with browser zoom. |
| **Reduced motion** | `prefers-reduced-motion` disables animation and smooth scrolling; the site uses almost no motion. |
| **Progressive enhancement** | Pages work without JavaScript: the filter is hidden, the menu is always visible, and transcript timestamps are simply text. |
| **Language** | `<html lang="en">` on every page. |

**Automated check:** all six pages pass axe-core (WCAG 2.1 A + AA and best-practice rules) with 0 violations at 1440px and 390px.

**Manual testing suggested before launch:** a screen reader pass (VoiceOver or NVDA), keyboard-only walkthrough, and 200% / 400% zoom.
