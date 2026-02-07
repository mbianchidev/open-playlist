# Provider Onboarding Guide

Welcome! This guide helps music platform providers integrate with the Open Playlist standard. Whether you're Spotify, Apple Music, a new startup, or a community project, the steps below will get you started.

## Overview

The Open Playlist API defines a universal, interoperable playlist format. Providers integrate by implementing **adapters** that translate between their proprietary format and the Open Playlist format.

Key resources:

- [OpenAPI Specification](../openapi/open-playlist.yaml) — full API contract
- [README](../README.md) — vision, mission, and data model overview

## Integration Steps

1. **Review the OpenAPI spec** — understand the Playlist and Track schemas, required fields, and endpoints.
2. **Build an adapter** — write code that maps your internal playlist/track data to the Open Playlist format (and vice versa).
3. **Expose the endpoints** — implement the four core endpoints (`GET /open-playlists/{userId}`, `GET /open-playlists/{playlistId}`, `POST /open-playlists/import`, `POST /open-playlists/export`).
4. **Test** — validate your adapter using the sample requests below.

## Sample Requests

### List a user's playlists

```http
GET /open-playlists/user-42 HTTP/1.1
Host: api.example.com
Accept: application/json
```

**Response:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Summer Vibes 2026",
    "description": "Upbeat tracks for sunny days.",
    "photo": "https://images.example.com/playlists/summer-vibes.jpg",
    "tracks": [],
    "owner_id": "user-42",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-02-01T14:00:00Z"
  }
]
```

### Get a single playlist

```http
GET /open-playlists/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: api.example.com
Accept: application/json
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Summer Vibes 2026",
  "description": "Upbeat tracks for sunny days.",
  "photo": "https://images.example.com/playlists/summer-vibes.jpg",
  "tracks": [
    {
      "id": "6fa459ea-ee8a-3ca4-894e-db77e160355e",
      "title": "Blinding Lights",
      "artist": "The Weeknd",
      "album": "After Hours",
      "duration": 200,
      "isrc": "USUG12000497",
      "artwork_uri": "https://images.example.com/tracks/blinding-lights.jpg",
      "provider_uris": {
        "spotify": "spotify:track:0VjIjW4GlUZAMYd2vXMi3b",
        "apple_music": "https://music.apple.com/us/album/blinding-lights/1499378108?i=1499378612",
        "youtube_music": "https://music.youtube.com/watch?v=4NRXx6U8ABQ",
        "tidal": "https://tidal.com/browse/track/123456789",
        "deezer": "https://www.deezer.com/track/908604462"
      },
      "metadata": {
        "genre": "Synth-pop",
        "bpm": 171
      }
    }
  ],
  "owner_id": "user-42",
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-02-01T14:00:00Z"
}
```

### Import a playlist from Spotify

```http
POST /open-playlists/import HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "source_provider": "spotify",
  "provider_data": {
    "playlist_url": "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
  }
}
```

**Response (201 Created):**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Today's Top Hits",
  "description": "The biggest songs right now.",
  "tracks": [ "..." ],
  "owner_id": "user-42",
  "created_at": "2026-02-07T11:00:00Z",
  "updated_at": "2026-02-07T11:00:00Z"
}
```

### Export a playlist to Apple Music

```http
POST /open-playlists/export HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "playlist_id": "550e8400-e29b-41d4-a716-446655440000",
  "target_provider": "apple_music"
}
```

**Response:**

```json
{
  "provider": "apple_music",
  "provider_playlist_url": "https://music.apple.com/us/playlist/summer-vibes-2026/pl.abc123",
  "status": "success",
  "tracks_matched": 18,
  "tracks_unmatched": 2
}
```

## Reference Adapter Architecture

A provider adapter translates between the Open Playlist format and a provider's proprietary API. Below is a high-level architecture:

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Open Playlist  │────▶│  Provider Adapter │────▶│  Provider API    │
│  API            │◀────│  (mapping layer)  │◀────│  (e.g. Spotify)  │
└─────────────────┘     └──────────────────┘     └──────────────────┘
```

Each adapter must implement two core translations:

| Direction        | Description                                          |
|------------------|------------------------------------------------------|
| **Import**       | Provider format → Open Playlist format               |
| **Export**       | Open Playlist format → Provider format               |

### Adapter Responsibilities

1. **Track matching** — Match tracks across providers using ISRC codes, title/artist fuzzy matching, or provider URI lookups.
2. **Metadata mapping** — Map provider-specific fields into the extensible `metadata` object.
3. **Authentication** — Handle OAuth or API-key flows for the provider's API.
4. **Error handling** — Gracefully handle unmatched tracks, rate limits, and API failures.

## Track Mapping Notes

Reliable cross-platform track matching is the hardest part of playlist interoperability. Recommended strategies in order of reliability:

1. **ISRC (International Standard Recording Code)** — The most reliable identifier. Most major platforms expose ISRC for each track. Use this as the primary matching key.
2. **Provider URI lookup** — If the source track already has a `provider_uris` entry for the target platform, use it directly.
3. **Title + Artist + Album fuzzy match** — Fallback when ISRC is unavailable. Use normalized, case-insensitive comparison. Consider edit-distance or phonetic matching for robustness.
4. **Duration cross-check** — As a secondary validation, compare track durations (within a tolerance of ±5 seconds) to reduce false positives.

## FAQ

**Q: What fields are required in a Playlist?**
A: `id`, `name`, `tracks`, `owner_id`, `created_at`, and `updated_at`. See the [OpenAPI spec](../openapi/open-playlist.yaml) for details.

**Q: What fields are required in a Track?**
A: `id`, `title`, and `artist`. All other fields are optional but recommended for better cross-platform matching.

**Q: How should I handle tracks that can't be matched on a target provider?**
A: The export response includes `tracks_unmatched`. Your adapter should log unmatched tracks and, ideally, return them in the response so the user can resolve them manually.

**Q: What about authentication and user privacy?**
A: Implementations should use OAuth 2.0 for user-facing operations and follow GDPR best practices. Never store or transmit user credentials in plain text. Only access playlists with explicit user consent.

**Q: Can I add custom fields to the Track or Playlist objects?**
A: Yes. Use the `metadata` field on Track objects for provider-specific data. The format is intentionally extensible.

**Q: Is there a reference implementation?**
A: Not yet — contributions are welcome! See the [README](../README.md) for how to contribute.
