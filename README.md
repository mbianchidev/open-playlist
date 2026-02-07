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

The full OpenAPI specification is available at [`openapi/open-playlist.yaml`](openapi/open-playlist.yaml).

### Core Data Model

#### Playlist Object

| Field         | Type                | Description                          |
|---------------|---------------------|--------------------------------------|
| `id`          | string (UUID)       | Provider-agnostic playlist identifier|
| `name`        | string              | Playlist name                        |
| `description` | string              | Playlist description                 |
| `photo`       | string (URI)        | Cover image URI                      |
| `tracks`      | array of Track      | Ordered list of tracks               |
| `owner_id`    | string              | User/owner identifier                |
| `created_at`  | string (date-time)  | Creation timestamp                   |
| `updated_at`  | string (date-time)  | Last update timestamp                |

#### Track Object

| Field            | Type              | Description                                      |
|------------------|-------------------|--------------------------------------------------|
| `id`             | string (UUID)     | Universal track identifier                       |
| `title`          | string            | Track title                                      |
| `artist`         | string            | Primary artist name                              |
| `album`          | string            | Album name                                       |
| `duration`       | integer           | Duration in seconds                              |
| `isrc`           | string            | International Standard Recording Code            |
| `artwork_uri`    | string (URI)      | Track/album artwork URI                          |
| `provider_uris`  | object            | Map of provider names to their track URIs        |
| `metadata`       | object            | Extensible key-value metadata                    |

### Key Endpoints

| Method | Path                             | Description                                          |
|--------|----------------------------------|------------------------------------------------------|
| GET    | `/open-playlists/{userId}`       | Returns a user's playlists in Open Playlist format   |
| GET    | `/open-playlists/{playlistId}`   | Retrieve a single playlist in universal format       |
| POST   | `/open-playlists/import`         | Import from a provider into the universal format     |
| POST   | `/open-playlists/export`         | Export a playlist to a specified provider             |

## Getting Started

- See the [OpenAPI Specification](openapi/open-playlist.yaml) for the full API contract.
- See the [Provider Onboarding Guide](docs/onboarding.md) for integration resources, sample requests, reference adapters, and mapping notes.

## Contributing

Contributions are welcome! Please open an issue or pull request to discuss changes.

## License

This project is open source. See [LICENSE](LICENSE) for details.
