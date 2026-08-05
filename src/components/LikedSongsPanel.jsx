import './LikedSongsPanel.css'

/**
 * Right-side "liked songs" playlist for Bronify.
 * props:
 *   tracks: array of { id, title, artist, duration }  // tracks the current user has liked
 *   onToggleLike: (trackId) => void
 */
export default function LikedSongsPanel({ tracks, onToggleLike }) {
  return (
    <div className="liked-songs-panel">
      <h2>Liked Songs</h2>

      {tracks.length === 0 ? (
        <p className="liked-songs-panel__empty">Songs you like will show up here.</p>
      ) : (
        <ul className="liked-songs-list">
          {tracks.map((track) => (
            <li key={track.id} className="liked-song">
              <div className="liked-song__info">
                <a
                  className="liked-song__title"
                  href={track.audio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {track.title}
                </a>
                <span className="liked-song__artist">{track.artist}</span>
              </div>
              {track.duration && <span className="liked-song__duration">{track.duration}</span>}
              <button
                type="button"
                className="liked-song__unlike"
                onClick={() => onToggleLike(track.id)}
                aria-label={`Unlike ${track.title}`}
              >
                ♥
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}