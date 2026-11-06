# Mohamed Azzam — Portfolio

A responsive, accessible portfolio built with React, Vite and Tailwind CSS. GitHub Actions builds and deploys the site to GitHub Pages on every push to `main`.

## Development

Requires Node.js 22.12+ (Node 24 used in deployment).

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The repository base path is `/MohamedAzzam-Portfolio/`. All dynamic asset URLs use Vite's `BASE_URL`. Project galleries use `#project/<id>` URLs so direct links and refreshes work on GitHub Pages without server rewrites.

## Update content

- `src/data/profile.js`: bio, contacts, CV paths, experience, education, skills and training.
- `src/data/projects.js`: technical projects, tags, GitHub links and explicitly labeled missing screenshots.
- `src/data/creative.json`: creative project metadata, exact original Canva URLs, thumbnails and each individual page.
- `public/assets/profile/`: supplied portrait, optimized to WebP.
- `public/assets/cv/`: original downloadable CVs.
- `public/assets/creative/<project-id>/`: locally stored original design captures and small thumbnails. No expiring Canva image URLs are used.

Put new real artwork in `public/assets/creative/<project-id>/` and add an entry to `creative.json`. Only categories with actual projects appear. A project can have multiple `categories`; its primary `category` is displayed on the card.

For a future real video sample, add an entry with `medium: "video"`, `videoSrc: "assets/creative/<id>/sample.mp4"`, a local poster in `pages[0]`, and its relevant category. The existing gallery will render native video controls. No video placeholder is currently displayed.

Technical project screenshots and the two missing repository URLs are explicitly marked in data. To replace a technical screenshot placeholder, set its `image` field to a local asset path. Social links, portrait and CVs are verified and supplied, so no placeholders are needed for those fields.

## Source fidelity

See `docs/content-sources.md`. Professional claims are based on the supplied CVs and user's brief. Creative descriptions identify visible design content; sample text within the original artwork is preserved and is not presented as a professional achievement or health recommendation. Original Canva designs are not modified.

## Deployment

`.github/workflows/deploy.yml` installs locked dependencies, builds `dist/`, uploads the Pages artifact and deploys it. GitHub repository Settings → Pages must use **GitHub Actions** as the source. The workflow needs `contents: read`, `pages: write`, and `id-token: write`.

## Verification

`scripts/verify_portfolio.py` runs browser integration checks with Python Playwright, against local preview by default or a URL supplied as an argument. It verifies desktop/mobile layouts, filters, dialogs, every gallery page, local assets, theme persistence, contact links and direct gallery loads.

Canva inspection/capture scripts require Python Playwright and Pillow, browser/network access, and the original user-authorized links. Captured metadata and temporary QA files live in ignored `audit/`. Do not commit temporary HTML, session state or credentials.

Artwork and personal materials belong to their respective owners. Bundled DM Sans is distributed under its included SIL Open Font License.
