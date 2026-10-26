# Project handoff — 2026-10-26

## Purpose and primary folder

Personal academic website for **P. W. ZHAO**, with final URL **me.pwzhao.com**.

Primary source folder:

`/Users/pwzhao/AgnosticOne/06-Dev/pwzhao-site`

Use this same folder across chats. It contains the website, assets, bibliography, scientific model data, generators, deployment workflow, and handoff documents. The owner moved it to this permanent working directory on 2026-10-26. Treat this folder as the sole active source; do not resume work from the former chat-output directory.

Registered app project: **me.pwzhao.com · 个人学术网站**. Project ID: `2f5860d6-57e8-4db1-8dc3-f7f180b0ebf9`. Its primary folder is the path above, verified through the app project list on 2026-10-26.

## Completed

- Astro static website implemented and reviewed locally at `http://127.0.0.1:4321/`.
- Approved visual direction: peach/mint retro vaporwave, paper textures, checkerboards, old graphics-workstation details, Bodoni/IBM Plex typography.
- The user's raven avatar was adapted into the blue raven-and-orbit emblem.
- Real publications, research descriptions, current institutional affiliation, email, Scholar and ORCID links populated.
- Publication filtering and BibTeX download implemented and verified; 7 journal articles + 3 preprints.
- Research-section figures replaced with original physics-informed SVG diagrams.
- Main visual changed from a decorative torus to a calculated Harper–Hofstadter band texture: flux 2/5, lowest band, C=-2 in the documented convention.
- Color and outward surface height both encode the same curvature magnitude. No pseudospin arrows or tutorial widgets remain. The original motion toggle remains.
- Numerical curvature integral and an independent FHS link calculation agree, with grid convergence and serialization checks.
- Surface relief and lighting were updated together; projection was checked at 72 viewing angles for desktop/mobile dimensions to avoid clipping.
- GitHub Pages workflow prepared at `.github/workflows/deploy.yml`, using the user-site root and a configurable canonical URL/indexing flag. Local build verification passed for both the GitHub URL and the final custom-domain URL.

## Next task: connect repository and publish

Target account: **agnosticphys**.

Target repository: **agnosticphys/agnosticphys.github.io**.

The old chat repeatedly received the ZipWin profile from the GitHub connector, and a 404 for the target repository. The user then supplied screenshots confirming BOTH GitHub connections are present in app settings: Lock.Bird (ZipWin) and agnosticphys@gmail.com. The account menu offers rename, reconnect, and disconnect; it does not offer a default-account selector.

Official multi-account plugin documentation says the model selects the connected account during calls. The old chat's tool interface did not expose an account selector and continued to use the older account. The user wants a local project so a new chat can share these files and retry with the new connection. A 404 under the old connection does **not** establish whether the target repository exists.

Begin the next chat with a read-only check of the connection identity and target repository access. Do not repeatedly request reconnecting an account that the screenshots already show as connected. If routing remains unavailable, explain the concrete limitation and use a suitable supported alternative.

No repository creation, code upload, remote Pages activation, or DNS change has been performed by this work. Repository visibility is not yet explicitly decided; public source is the suggested free-Pages route. Confirm destination and appropriate access before remote writes.

## Domain plan

The user owns **pwzhao.com**, managed on **Cloudflare**. They chose **me.pwzhao.com**, not the apex domain.

1. Publish and verify the site on `https://agnosticphys.github.io`.
2. Configure `me.pwzhao.com` in GitHub Pages settings.
3. Add the Cloudflare DNS CNAME `me` → `agnosticphys.github.io`.
4. Update the repository variable `SITE_URL` to `https://me.pwzhao.com`, finalize the indexing setting, rebuild, and verify HTTPS.

Keep the existing apex domain and unrelated DNS/email records intact. No CNAME file is required by GitHub's current custom-Actions deployment workflow; Pages settings own the binding.

## Content boundaries

The exact academic rank and education history are not confirmed. The user asked to prioritize papers and keep the biography brief. Current content states only the verified HKUST Physics affiliation and research interests.

Scholar's older title for arXiv:2509.16555 was updated to the October 2026 title. The kagome dipolar paper arXiv:2412.21112 is counted once as its 2025 SciPost journal article. Three conference-abstract records are not counted as papers.

## Navigation

- `AGENTS.md`: persistent project guidance
- `README.md`: build/deployment details
- `src/pages/index.astro`: page structure and copy
- `src/data/publications.ts`: bibliography and profile
- `src/styles/retro-theme.css`, `typography.css`: current visual layers
- `public/artwork.js`, `public/hofstadter-band.js`: hero rendering and data sampling
- `public/hofstadter/`: precomputed model assets
- `scripts/`: reproducible scientific and SVG generators
- `content-sources.json`, `hofstadter-verification.json`: source and calculation records

App project registration is complete. Start subsequent chats in **me.pwzhao.com · 个人学术网站** to work on this shared directory. The local Git baseline commit is `dc41206`; remote deployment remains pending as described above.
