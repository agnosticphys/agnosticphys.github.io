# me.pwzhao.com — P. W. Zhao academic website

This folder is the shared local project. New chats should start with `AGENTS.md` and `PROJECT_STATUS.md`, and work on these files directly.

The permanent working directory is `/Users/pwzhao/AgnosticOne/06-Dev/pwzhao-site`, registered in the app as **me.pwzhao.com · 个人学术网站**.

A custom Astro prototype for a personal academic website. This version is local only and has not been deployed or connected to the domain.

The displayed name is **P. W. ZHAO**. The raven-and-orbit logo is based on the owner's supplied avatar, generated with the built-in image tool. Its transparent PNG is in `public/brand/raven-orbit.png`; the complete generation prompt and usage record are in `brand-design.json`. The original supplied avatar was not modified.

## Preview

```sh
npm install
npm run dev
```

Open http://127.0.0.1:4321. For a production build, run `npm run build` and then `npm run preview`.

## Design

Sun-faded peach, mint graph paper, warm paper, dark ink, checkerboard trims, and early-desktop window details. Electric blue is retained in the personal wordmark and raven; the animated main illustration has a metallic surface with a calculated Chern-band texture. The displayed field is calculated from a standard Harper–Hofstadter Hamiltonian; its toroidal embedding and lighting are artistic choices. No third-party artwork or runtime CDN requests are used. Open-source fonts are self-hosted with the site.

## Content status

Public information was verified on 2026-10-26 against the owner's Google Scholar and ORCID profiles, arXiv records, and publisher sources. The website contains 7 journal articles and 3 preprints, with author order, journal metadata, DOI, arXiv and PDF links. Research themes are short original summaries of these works. The kagome paper is correctly listed as a 2025 SciPost article, and arXiv:2509.16555 uses its revised October 2026 title.

The profile states the currently listed HKUST Department of Physics affiliation and public ORCID-verified email. Academic rank, education history, and a CV are not asserted. Bibliographic provenance and exclusions are recorded in `content-sources.json`. Search indexing remains disabled for local review; remove the noindex metadata only when preparing a public release.

## Interactions

- Research tabs support pointer and keyboard navigation.
- Torus animation can be paused and respects reduced-motion preferences.
- Animation pauses when outside the viewport or in a hidden tab.
- Publications can be filtered by journal article or preprint.
- DOI, arXiv, PDF, Google Scholar and ORCID links are live; contact uses the verified email address.
- The BibTeX download is generated from the same data as the visible paper list.
- Layout adapts to mobile screens.

## Files

- `src/pages/index.astro`: page structure and draft content
- `src/styles/global.css`: visual design and responsive layout
- `public/artwork.js`: original canvas illustration
- `public/interactions.js`: research tabs and publication filters
- `src/data/publications.ts`: verified bibliography and profile
- `src/pages/publications.bib.ts`: static BibTeX export

Code and deployment changes are handled by the assistant; the site owner only needs to provide content and visual feedback.

## Research illustrations

The three images in `public/research/` are original SVG concept diagrams, using the site's warm paper, sage ink, terracotta accents, perspective geometry, and print-like scanlines.

- `topology-disorder.svg`: a qualitative wavefunction-intensity envelope over a bipartite lattice with random nearest-neighbor hopping strengths; a separate phase-winding inset. It is not a fitted or simulated wavefunction.
- `quantum-spin-liquids.svg`: corner-sharing-triangle kagome connectivity, alternative bond configurations around a hexagon, and schematic electric (spinon) / magnetic (vison) excitations. The two bond styles denote resonance alternatives, not a static ordered dimer pattern.
- `correlated-matter.svg`: a frustrated spin lattice with reference positions and small sublattice displacements. It illustrates spin–lattice coupling, not a calculated topological polarization or boundary spectrum.

The imagery is grounded in the linked research themes. All three have accessible descriptions and visible conceptual-schematic captions.

The current visual layer is `src/styles/retro-theme.css`, with a fixed geometric wallpaper in `public/texture/vapor-wallpaper.svg`. Decorative patterns are kept faint behind reading areas. All assets and generators needed for the current website are contained in this project.

## Typography

The display face is Bodoni Moda (regular, italic, and semibold), with IBM Plex Sans for reading text and IBM Plex Mono for navigation, metadata, and small labels. The Latin font files are bundled locally through Fontsource, so visitors do not contact an external font service. Original SIL Open Font License notices are included in `public/fonts/licenses/`. Styling lives in `src/styles/typography.css`.

## Main illustration: Harper–Hofstadter Berry curvature

The current main image represents the lowest band of the square-lattice Harper–Hofstadter model at flux 2/5, with equal hopping amplitudes. The two torus coordinates are u=5kx and v=ky. Both normal displacement and surface color encode Berry-curvature magnitude, with a monotone asinh mapping from pale mint/silver to peach, coral, and copper red. All computed curvature is negative in the stated convention; these colors do not indicate opposite signs. Height uses tube radius 0.46 + 0.40*s^1.2, where s is the shared normalized asinh curvature magnitude. The maximum radius remains below the major radius 1.35, preserving the hole. Lighting follows the displaced surface normals. Reflective lighting, height scale, and the 3D embedding are artistic choices. There are no pseudospin arrows or extra tutorial controls.

The q×q Hamiltonian uses a uniform-phase orbital-position Bloch basis, including the correct magnetic sewing matrix at the Brillouin-zone boundary. `scripts/generate-hofstadter.py` diagonalizes it on a 256×256 grid and computes analytic-derivative Kubo curvature. Independent gauge-invariant lattice links and grid convergence both verify C=-2 (the image shows |C|=2). The selected band is isolated with a minimum direct gap about 0.15718 in hopping units.

- `public/hofstadter/field.bin`: local precomputed energy and curvature arrays (float32)
- `public/hofstadter-band.js`: periodic interpolation and color mapping
- `hofstadter-verification.json`: convergence and serialization checks
- `scripts/generate-hofstadter.py`: reproducible generation with NumPy; --scan compares example fluxes/bands

The texture is a standard illustrative model, not an original result attributed to the website owner. Data are loaded locally; no remote calculation or API is needed at runtime. Model construction follows the [HofstadterTools reference](https://hofstadter.tools/theory/band_structure.html).

## GitHub Pages deployment

Planned repository: `agnosticphys/agnosticphys.github.io` (user-site root).
Final URL: `https://me.pwzhao.com`.

The local source is prepared, but repository creation, upload, Pages activation, and DNS binding have not been performed. Put the contents of this project at the repository root. The workflow in `.github/workflows/deploy.yml` builds with Node 24 and the committed npm lockfile, then publishes only the static `dist/` artifact. The HH data are precomputed and committed, so CI needs no Python runtime or scientific computation.

1. Give the intended GitHub connection access to the `agnosticphys` repository. Choose repository visibility; GitHub Free supports Pages from public repositories, while private source requires an eligible plan.
2. In the repository's Pages settings, select GitHub Actions as the publishing source. The workflow runs on pushes to `main` or on manual dispatch.
3. Verify the initial website at `https://agnosticphys.github.io`. `SITE_URL` defaults to this address in the workflow. The workflow currently keeps indexing disabled until the release is finalized; this does not make the URL private.
4. Set the custom domain to `me.pwzhao.com` in GitHub Pages before changing DNS. Verify domain ownership as appropriate. Add a DNS CNAME record with name `me` and target `agnosticphys.github.io` (no scheme or path).
5. Set the repository Actions variable `SITE_URL` to `https://me.pwzhao.com`. For the final public release, set `SITE_INDEXABLE` to `true` and rebuild. Enable Enforce HTTPS when GitHub's certificate is ready.

This configuration serves at `/` both before and after custom-domain binding. A project repository such as `agnosticphys/website` would need subpath handling and is not the prepared target. With a custom Actions publishing workflow, GitHub's current documentation does not require a CNAME file in the build artifact; domain binding is configured in Pages settings.

References: [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/), [GitHub custom-domain configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
