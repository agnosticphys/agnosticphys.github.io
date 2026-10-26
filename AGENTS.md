# P. W. Zhao academic website

This is the shared source directory for the user's personal academic website, intended for **https://me.pwzhao.com**. Use this directory as the project’s primary folder. Do not create another copy of the website for each chat.

## Start here

- Read `PROJECT_STATUS.md` for the current state and next task.
- Read `README.md` for commands, files, scientific visualization, and deployment details.
- Inspect `git status` before editing. Other chats may be working in the same directory; preserve their changes and avoid overlapping edits without coordination.
- The user does not write or maintain code. Handle implementation, verification, and deployment configuration, and communicate outcomes in plain Chinese.
- Keep scratch files in `work/` (ignored by Git). Keep durable project knowledge in these project documents rather than relying on a previous chat's transcript.

## Design decisions already approved

- Name: **P. W. ZHAO**; public full name Pengwei Zhao / 赵鹏威.
- Personal emblem: electric-blue raven with a pale orbital ring, based on the user's own avatar. Asset: `public/brand/raven-orbit.png`.
- Style: retro vaporwave / early computer graphics and printed academic folio; sun-faded peach, mint graph paper, warm paper, dark ink, checkerboard details, restrained metallic surfaces. Avoid reverting to a generic blue-purple-gradient design.
- Typography: locally bundled Bodoni Moda for display headings, IBM Plex Sans for body text, IBM Plex Mono for navigation and labels.
- Research illustrations have concrete physics content, not abstract decorative symbols.
- The hero is a Harper–Hofstadter Berry-curvature surface, with **color AND outward relief height** encoding curvature magnitude. Flux 2/5, lowest band, |C|=2. Preserve its physical meaning and the approved visual style.
- The user rejected extra tutorial controls/explanatory panels around the hero. They want the physical content in the image itself. Pseudospin arrows were removed at their request. Keep only the original motion toggle.
- Maintain readable publication titles and responsive layouts on desktop and mobile.

## Content and scientific integrity

- `src/data/publications.ts` is the shared bibliography/profile source. As last verified it contains 7 journal articles and 3 preprints. The BibTeX endpoint uses the same data.
- Public identity is anchored to Scholar `Ab7DeeQAAAAJ` and ORCID `0009-0007-0862-5960`. Other researchers named Pengwei Zhao exist; do not mix their work or biography into this site.
- Current confirmed affiliation is HKUST Department of Physics, and the public email is `pwzhao@ust.hk`. The user's exact academic rank and degree history have not been provided. Keep the biography brief; do not invent them.
- `content-sources.json` records bibliographic provenance and corrections to outdated Scholar records.
- HH data are generated from a q×q Hamiltonian on a 256×256 grid. `hofstadter-verification.json` records independent Kubo and FHS checks and convergence. Do not replace these observables with fabricated artistic patterns while calling them calculated Berry curvature.
- Surface height and metallic lighting are visualization choices; the Chern number comes from the momentum-space calculation, not the 3D shape.

## Implementation and verification

- Astro 7 static output; the committed npm lockfile is authoritative.
- `ASTRO_TELEMETRY_DISABLED=1 npm run dev`: local preview on 127.0.0.1:4321. Check whether a preview is already running before starting another.
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: production build to `dist/`.
- `python3 scripts/generate-hofstadter.py`: regenerate the HH assets and verification report; requires NumPy. Routine website publishing does not need this calculation.
- `python3 scripts/generate-research-art.py`: regenerate the original research-section SVG schematics; Python standard library only.
- Do relevant build, browser, and scientific checks for changed behavior. Avoid broad repeated testing when no relevant code has changed.
- Front-end assets and font licenses live in `public/`; do not depend on assets in a prior chat's temporary directory.

## Planned deployment

- Intended repository: `agnosticphys/agnosticphys.github.io`; GitHub Pages serves at `/`.
- Final custom domain: `me.pwzhao.com`; the domain is managed on Cloudflare.
- The local Actions workflow is prepared. Remote repository access, upload, Pages activation, and DNS binding are **not yet confirmed complete**. Verify actual state before claiming completion or taking the next step.
- `SITE_URL` selects the canonical URL. `PUBLIC_SITE_INDEXABLE` controls indexing; local review defaults to noindex. The workflow reads repository variables `SITE_URL` and `SITE_INDEXABLE`.
- Recheck the GitHub connection identity and target-repository access. The user has connected agnosticphys in the app UI, but the older chat's tools continued to return ZipWin. Do not assume the user failed to connect the account or keep asking them to reconnect without evidence.
- Do not modify unrelated accounts, repositories, domain records, or mailbox settings.
