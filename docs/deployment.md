# GitHub Pages deployment

The [Pages workflow](../.github/workflows/deploy-pages.yml) copies `site/` into
`_site/`, downloads the canonical OpenAPI specification as
`_site/open-playlist.yaml`, and uploads the Pages artifact in a `build` job. A
separate `deploy` job (`needs: build`) then deploys that artifact. Deploying in the
same job as the upload can miss the just-finalized artifact and fail with
`No artifacts named "github-pages" were found for this workflow run`
([actions/deploy-pages#451](https://github.com/actions/deploy-pages/issues/451)).
There is no package installation or compilation step.

## Triggers

- Pushes to `main` that change `site/**` or the Pages workflow.
- A daily schedule at 04:20 UTC, which picks up specification changes from
  `open-playlist-engine` without a change in this repository.
- Manual runs from **Actions > Deploy GitHub Pages > Run workflow**, selecting
  `main`.

Pull requests do not trigger this deployment workflow. The `deploy` job uses the
`github-pages` environment, its deployment URL, and the environment's `main`-only
deployment policy. The workflow defaults to `contents: read`; only the `deploy` job
gets `pages: write` and `id-token: write`. A single `pages` concurrency group
cancels in-progress runs when a newer one starts.

## Specification access and retries

The specification is public. If it becomes private, configure the optional
`OPEN_PLAYLIST_ENGINE_TOKEN` repository secret with access to it. A failed download
fails the `build` job before artifact upload, so nothing is deployed.

**Re-run failed jobs** on a run whose `deploy` job failed redeploys the artifact
already uploaded by `build`. To fetch the current canonical specification again,
start a new run from **Run workflow** instead.

## Brand assets

The logos, favicons, touch icon, social card and color tokens in `site/` come
unmodified from the Open Playlist kit in
[synctune-io/branding](https://github.com/synctune-io/branding)
(`brands/open-playlist/`). `logo-on-dark.svg` and `logo-on-light.svg` are the
compact lockups and switch with the site theme. Surface colors in
`site/styles.css` are tints of the kit's Deep blue; text pairs follow the kit's
approved contrast pairs. `assets/projects/open-playlist-engine.svg` is Open
Playlist Engine's own mark from `docs/assets/mark.svg` in
[open-playlist-engine](https://github.com/mbianchidev/open-playlist-engine).
