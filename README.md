# Hot Meal Ba — VibeUI Challenge 2026

A competition-ready **plain HTML/CSS/JavaScript** UI for:

- Frozen dumpling ordering
- Full cart and checkout flow
- Delivery tracking
- Student seller application
- Seller order-management dashboard
- 240 simulated order records
- Mobile, tablet, and desktop layouts
- Offline-friendly SVG brand assets

## Fastest setup

1. Extract this whole folder.
2. Double-click **`INSTALL_AND_OPEN_ADMIN.cmd`**.
3. Tap **Yes** on the Windows Administrator prompt.
4. The project is copied to:

```text
C:\a_fiyandha\VibeUI-Competition-2026
```

5. Double-click **`START_PREVIEW.cmd`** from that folder.
6. Preview opens at:

```text
http://127.0.0.1:5500
```

## Important on competition day

Replace:

```text
assets\sponsor\sponsor-placeholder.svg
```

with the official sponsor asset, or update the `<img>` path in `index.html`.

Do not remove the starter pack navigation file if the organiser supplies one. Merge this UI into their required structure.

## Codex opening prompt

```text
Inspect this plain HTML, CSS, and JavaScript competition project.

Do not introduce React, Vue, npm packages, a backend, or a build system.
Preserve all existing working features.

First:
1. explain the current structure,
2. identify the navigation, cart, checkout, tracking, seller form, and dashboard logic,
3. list any bugs or responsive risks,
4. propose the smallest safe edit plan.

Do not modify files until the plan is approved.
```

## Test demo order

```text
HMB-260615-1008
```

## Core demo flow

1. Home → Quick reorder
2. Order → Add products
3. Cart → Delivery address
4. Payment → Confirmation
5. Track new order
6. Student seller application
7. Dashboard → search/filter/pagination/export CSV
8. Resize to mobile and tablet

## GitHub setup

After creating an empty GitHub repository:

```powershell
cd C:\a_fiyandha\VibeUI-Competition-2026
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

Invite the second team member from the GitHub repository's collaborator settings.

## Files

```text
index.html                 UI structure
styles.css                 responsive design system
data.js                    products + 240 simulated records
app.js                     navigation and interactions
assets/                    local SVG visuals
tools/server.mjs           zero-dependency preview server
START_PREVIEW.cmd          run local preview
INSTALL_AND_OPEN_ADMIN.cmd install/check environment
COMPETITION_TEST_CHECKLIST.md manual QA checklist
```


## Official Hot Meal Ba assets added

The v2 build integrates organiser/team-supplied Hot Meal Ba assets:

- Official illustrated Hot Meal Ba logo
- Official signature noodle photo
- Beijing Noodles poster
- Fried Noodles with Beef Dingding poster
- Mee Tarik Beef Soup poster

These appear in the header, hero badge, official identity strip, and brand-story gallery.
The frozen dumpling ordering flow remains the primary competition product.


## Neon City v3 theme

This build adds an original neon-city visual system inspired by vibrant supernatural
urban-night aesthetics:

- Midnight navy and indigo surfaces
- Electric cyan, violet, and hot-pink highlights
- Glass-like navigation and panels
- Neon gradient calls-to-action
- Subtle city-grid and skyline atmosphere
- Glowing timeline, badges, product cards, and mobile navigation

No third-party game art, characters, logos, screenshots, or copied UI assets are included.
Hot Meal Ba remains the only visible brand identity.


## Tomato Reverie v4

This visual direction adapts a cozy tomato-daydream mood into an original Hot Meal Ba UI:

- warm tomato red accents
- olive leaf green
- lamp-gold highlights
- cream paper surfaces
- black/white contrast
- glassy cards and soft shadows
- playful tomato details
- softer editorial composition

The website does not include third-party game artwork, logos, or characters.


## Final menu image/name patch
- Replaced dumpling/karipap emoji placeholders with the supplied food photos from the PDF.
- Renamed every catalogue item so its name matches the displayed dish.
- Forced the RM 320+ amount to a readable gold colour after theme styles load.

### Final earnings-card readability patch (V4)
- Fixed the heading and disclaimer text inside the monthly earnings card.
- The card now uses explicit light text colours in both dark and light themes.
- Kept `RM 320+` in high-contrast gold.


### Earnings readability patch (V5)
- White heading and disclaimer now sit on dark translucent backplates.
- Added `-webkit-text-fill-color`, high-specificity CSS, and a runtime style lock.
- Added cache-busting query strings to CSS and JavaScript links.
- Verify the patch using `data-patch-version="V5"` in `index.html`.
