# GitHub Pages deployment

The [Pages workflow](../.github/workflows/deploy-pages.yml) copies `site/` into
`_site/`, downloads the canonical OpenAPI specification as
`_site/open-playlist.yaml`, uploads the Pages artifact, and deploys it. These steps
run in one `deploy` job to avoid provisioning a second runner and waiting for an
inter-job handoff. There is no package installation or compilation step.

## Triggers

- Pushes to `main` that change `site/**` or the Pages workflow.
- A daily schedule at 04:20 UTC, which picks up specification changes from
  `open-playlist-engine` without a change in this repository.
- Manual runs from **Actions > Deploy GitHub Pages > Run workflow**, selecting
  `main`.

Pull requests do not trigger this deployment workflow. The job retains the
`github-pages` environment, its deployment URL, and the environment's existing
`main`-only deployment policy. Workflow permissions and concurrency are unchanged.

## Specification access and retries

The specification is public. If it becomes private, configure the optional
`OPEN_PLAYLIST_ENGINE_TOKEN` repository secret with access to it. A failed download
fails the job before artifact upload or deployment.

Retrying the job reruns assembly and fetches the current canonical specification
again before uploading and deploying. There is no separate deployment-only job
to retry against an earlier artifact.
