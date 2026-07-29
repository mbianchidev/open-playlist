# Open Playlist

> A universal, open, and interoperable playlist format that any music service can adopt—allowing users to move, share, and enjoy their playlists without barriers, walled gardens, or vendor lock-in.

## Vision

To empower users with true ownership and portability over their musical experience, enabling seamless migration and playback of playlists across all major platforms—Spotify, Tidal, YouTube Music, Deezer, Apple Music, and beyond.

## Mission

Define a universal, open, and interoperable playlist format that any music service can adopt, allowing users to move, share, and enjoy their playlists without barriers, walled gardens, or vendor lock-in.

## Manifesto: Music Without Walls

Music is for everyone, everywhere. Playlists should not be prisoners of platforms. By establishing an open playlist standard, we defend the rights of listeners:

- **To control, migrate, and share** their playlists on their own terms.
- **To ensure music discovery is personal**, not restricted by proprietary formats.
- **To let innovation thrive**—opening the door for new services, insights, and creativity.

## The Open Playlist API Specification

The canonical OpenAPI specification is maintained in
[`open-playlist-engine`](https://github.com/mbianchidev/open-playlist-engine/blob/main/openapi/open-playlist.yaml).
The current contract uses **OpenAPI 3.0.3** and is versioned as **0.2.0**.

An interactive API reference and project landing page are published to GitHub Pages at **https://mbianchidev.github.io/open-playlist/** (deployed automatically from the [`site/`](site/) directory via [GitHub Actions](.github/workflows/deploy-pages.yml)). The Pages workflow fetches and publishes the latest canonical spec as [`open-playlist.yaml`](https://mbianchidev.github.io/open-playlist/open-playlist.yaml), including on a periodic schedule so spec-only changes in `open-playlist-engine` are picked up without code changes here.

### What's New in 0.2.0

- **Local playlist-file imports** validate bounded uploads locally, report parsing issues, and expose expiring normalized previews that can be retrieved or discarded.
- **Portable file exports** support CSV, TXT, M3U8, XSPF, and Open Playlist JSON. Multi-playlist exports use ZIP64 archives with a versioned manifest and warnings.
- **Bulk playlist organization** adds ownership-aware capability discovery, preflight checks, review-only duplicate detection, durable audit jobs, and failed-item retries.
- **Expanded portable models** represent playlist ownership and follow state, liked-track collections, track occurrence and migration details, and explicit album and artist entities.

### Core Data Model

Only `name` and `tracks` are required on a playlist. All other playlist fields
are optional.

#### Playlist Object

| Field           | Type                             | Description                                                   |
|-----------------|----------------------------------|---------------------------------------------------------------|
| `id`            | string                           | Provider-agnostic playlist identifier                         |
| `name`          | string                           | Playlist name                                                 |
| `description`   | string                           | Playlist description                                          |
| `photo`         | string (URI)                     | Cover image URI                                               |
| `tracks`        | array of Track                   | Ordered list of tracks                                        |
| `owner_id`      | string                           | Provider owner identifier                                     |
| `owner_name`    | string                           | Provider owner display name                                   |
| `is_owned`      | boolean                          | Whether the connected account owns the playlist               |
| `is_followed`   | boolean                          | Whether the playlist is followed rather than owned            |
| `collaborative` | boolean                          | Whether the connected account can collaborate on the playlist |
| `created_at`    | string (date-time)               | Creation timestamp                                            |
| `updated_at`    | string (date-time)               | Last update timestamp                                         |
| `snapshot_id`   | string                           | Provider snapshot or version identifier                       |
| `kind`          | `standard` or `liked_tracks`     | Playlist or provider-native liked/saved collection             |

#### Track Object

Only `title` and `artist` are required on a track. All other track fields are
optional.

| Field                         | Type                                                   | Description                                                   |
|-------------------------------|--------------------------------------------------------|---------------------------------------------------------------|
| `id`                          | string                                                 | Universal track identifier                                    |
| `title`                       | string                                                 | Track title                                                   |
| `artist`                      | string                                                 | Primary artist name                                           |
| `album`                       | string                                                 | Album name                                                    |
| `duration_s`                  | integer                                                | Duration in seconds                                           |
| `release_date`                | string (date)                                          | Full release date, when known                                 |
| `release_year`                | integer                                                | Year of publication                                           |
| `genre`                       | string                                                 | Primary genre                                                 |
| `track_number`                | integer                                                | Position within the album or disc                             |
| `disc_number`                 | integer                                                | Disc number for multi-disc albums                             |
| `explicit`                    | boolean                                                | Whether the track contains explicit content                   |
| `composer`                    | string                                                 | Composer or songwriter                                        |
| `credits`                     | array of Credit                                        | Structured contributor credits                               |
| `label`                       | string                                                 | Publishing record label                                       |
| `isrc`                        | string                                                 | International Standard Recording Code                         |
| `artwork_uri`                 | string (URI)                                           | Track or album artwork URI                                    |
| `provider_uris`               | object                                                 | Provider names mapped to track URIs                           |
| `metadata`                    | object                                                 | Extensible provider-specific metadata                         |
| `migration_status`            | string                                                 | Engine migration annotation                                   |
| `migrated_target_playlist_id` | string                                                 | Target playlist annotation                                    |
| `migrated_target_uri`         | string                                                 | Target item URI annotation                                    |
| `position`                    | integer                                                | Position in the provider source                               |
| `media_type`                  | `track`, `episode`, `video`, `local_file`, or `unknown` | Media type; defaults to `track`                               |
| `is_local`                    | boolean                                                | Whether the item is a local file; defaults to `false`         |
| `source_item_id`              | string                                                 | Provider occurrence or playlist-item identifier               |
| `added_at`                    | string (date-time)                                     | Time the item was added to the playlist                       |
| `unsupported_reason`          | string                                                 | Reason the item cannot be migrated or played                  |

#### Credit Object

Captures an individual contributor on a track, allowing rich credits beyond the
primary `artist` and `composer` fields—such as featured artists, producers,
lyricists, and engineers.

| Field        | Type         | Description                                                              |
|--------------|--------------|--------------------------------------------------------------------------|
| `role`       | string       | Contributor role (e.g. `featured_artist`, `producer`, `composer`, `lyricist`) |
| `name`       | string       | Name of the person or entity credited                                    |
| `instrument` | string       | Optional instrument or specialization for performer credits              |
| `uri`        | string (URI) | Optional URI identifying the contributor                                 |

#### Album Object

Albums are first-class music-library entities. `title`, `artists`, and
`provider_uris` are required.

| Field            | Type                | Description                                      |
|------------------|---------------------|--------------------------------------------------|
| `id`             | string              | Stable provider album identifier                 |
| `title`          | string              | Album title                                      |
| `artists`        | array of string     | Ordered album artist names                       |
| `upc`            | string              | UPC or provider-equivalent barcode               |
| `release_date`   | string (date)       | Full release date                                |
| `release_year`   | integer             | Release year when only partial precision exists  |
| `artwork_uri`    | string (URI)        | Album artwork URI                                |
| `provider_uris`  | object              | Provider names mapped to album URIs              |
| `metadata`       | object              | Extensible provider-specific metadata            |
| `source_item_id` | string              | Stable source-library item identifier            |
| `added_at`       | string (date-time)  | Time the album was saved                         |

#### Artist Object

Artists are first-class music-library entities. `name` and `provider_uris` are
required.

| Field            | Type                | Description                                      |
|------------------|---------------------|--------------------------------------------------|
| `id`             | string              | Stable provider artist identifier                |
| `name`           | string              | Artist name                                      |
| `artwork_uri`    | string (URI)        | Artist artwork URI                               |
| `provider_uris`  | object              | Provider names mapped to artist URIs             |
| `metadata`       | object              | Extensible provider-specific metadata            |
| `source_item_id` | string              | Stable source-library item identifier            |
| `added_at`       | string (date-time)  | Time the artist was saved or favorited           |

### Key Endpoints

| Method | Path                                  | Description                                                    |
|--------|---------------------------------------|----------------------------------------------------------------|
| GET    | `/open-playlists/{userId}`            | List a user's playlists in Open Playlist format                 |
| GET    | `/open-playlists/{playlistId}`        | Retrieve a playlist in Open Playlist format                     |
| POST   | `/open-playlists/import`              | Import a provider playlist into Open Playlist format            |
| POST   | `/open-playlists/export`              | Export an Open Playlist to a provider                            |
| POST   | `/api/imports/preview`                | Validate a local playlist file and create an expiring preview   |
| GET    | `/api/imports/{importId}`             | Retrieve an unexpired local import preview                      |
| DELETE | `/api/imports/{importId}`             | Discard an unused local import preview                          |
| POST   | `/open-playlists/export/file`         | Export selected playlists as portable files or a ZIP archive    |
| GET    | `/organizer/playlists`                | List playlists with ownership and organizer capabilities        |
| POST   | `/organizer/preflight`                | Preview organizer operations and confirmation requirements      |
| POST   | `/organizer/duplicates`               | Find explainable, review-only duplicate candidates              |
| GET    | `/organizer/jobs`                     | List recent organizer audit jobs                               |
| POST   | `/organizer/jobs`                     | Start a durable organizer job                                  |
| GET    | `/organizer/jobs/{jobId}`             | Retrieve an organizer job and its item results                  |
| POST   | `/organizer/jobs/{jobId}/retry`       | Retry only failed organizer items                              |

The interactive API reference contains the complete request, response, error,
import-limit, export-manifest, and organizer schemas.

## Getting Started

- See the [OpenAPI Specification](https://github.com/mbianchidev/open-playlist-engine/blob/main/openapi/open-playlist.yaml) for the full API contract.
- See the [Provider Onboarding Guide](docs/onboarding.md) for integration resources, sample requests, reference adapters, and mapping notes.

## Contributing

Contributions are welcome! Please open an issue or pull request to discuss changes.

## License

This project is open source. See [LICENSE](LICENSE) for details.
