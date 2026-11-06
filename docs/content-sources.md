# Verified content and assets

## Personal information

Professional history, education, training, languages, technical projects, repository URLs and skills are sourced from the supplied `Mohamed_Azzam_Master_CV_2026.pdf` and `Mohamed_Azzam_Content_Creation_CV.pdf`. The downloadable PDFs are unchanged copies of those files. The portrait is the supplied `IMG_20220302_164600.jpg`, converted to WebP for delivery. The WhatsApp URL comes directly from the user's brief.

No extra professional roles, certifications, software proficiency, achievements or client claims have been introduced. Project summary wording has been shortened for the website. Technical project screenshots and two repository URLs remain explicitly labeled as missing. No fabricated technical screenshots are displayed.

Adobe Premiere Pro and CapCut are labeled as previously used. No video project or empty video category is displayed. AI image generation is listed as a verified skill; no generated replacement artwork has been created for this website.

## Canva projects

Inspected with Playwright on 6 November 2026. These seven unique URLs were supplied by the user; the final URL appeared three times and is represented by one project.

| Exact supplied URL                 | Canva title                         | Display title              | Pages |
| ---------------------------------- | ----------------------------------- | -------------------------- | ----: |
| https://canva.link/m5w252v1tow3y1x | روتين                               | Daily Routine Guide        |     6 |
| https://canva.link/2ghqgvclhwmbl2a | Transforme1                         | Transform Your Body & Mind |     3 |
| https://canva.link/re1u3357wsjhgso | Untitled design                     | Change Your Life           |     3 |
| https://canva.link/qqkeiug2wwykrvc | MUSCLE POWER                        | Muscle Power               |     1 |
| https://canva.link/7gacm9kgxl7lgvs | Full-Training-PDF                   | Push / Pull / Legs         |     6 |
| https://canva.link/tb0hrvee56vuo2i | Heading - Instagram Post (4:5)      | Teacher → Student Models   |     1 |
| https://canva.link/56b505f7sihrnrx | AI for Everyone.pptx - Presentation | AI for Everyone            |    24 |

All 44 pages are represented. The Daily Routine Guide's third and sixth pages are identical in the original and are preserved as separate pages.

The first five projects open Canva's public presentation viewer. Its Share menu provides a link, and its More menu provides viewer settings; a direct PNG/PDF export was not offered. Designs were captured from the rendered page container after hiding Canva's controls.

The two remaining supplied links initially redirected to editor URLs with Canva's temporary “We’ll have you designing again soon” challenge. The standard `/view` URLs for those same designs loaded successfully in anonymous viewing mode. Their built-in full-screen presentation controls exposed the actual page canvas for clean captures. No sign-in, access restriction, watermark or license control was bypassed. Presentation controls and letterboxing lie outside the captured page containers.

Page counters were checked during navigation before captures. Original design content, watermarks, sample phone numbers and branding remain unchanged. Locally stored high-quality WebP pages are paired with smaller WebP thumbnails. Public files contain no signed Canva media URLs or temporary paths.

Website display titles for untitled or generic filenames are descriptive labels derived from visible artwork; original Canva titles remain available in gallery details. Captures and project descriptions do not imply real client relationships, fitness outcomes or professional achievements based on promotional sample copy.

The presentation contains AI imagery, but the precise creation tools for each illustration have not been independently verified. Its portfolio category therefore remains Presentations / Educational Content rather than attributing individual images to an invented tool or workflow.

## Maintenance

To recapture authorized designs with the same tools:

```sh
python scripts/inspect_canva.py
python scripts/capture_canva.py
python scripts/prepare_assets.py
```

Inspect the generated contact sheets and original page counters before replacing public assets. Never bypass authentication or licensing restrictions. `audit/` is excluded from Git.
