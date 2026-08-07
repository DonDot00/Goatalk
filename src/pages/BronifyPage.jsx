import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import './BronifyPage.css'

// Main Bronify view: search bar, add-track form, track list.
export default function BronifyPage() {
  const { tracks, likedTrackIds, addTrack, toggleLike } = useOutletContext()
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredTracks = tracks.filter((track) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query)
    )
  })

  return (
    <div className="bronify-page">
      <h2>Bronify</h2>
      <div className="bronify-page__toolbar">
        <input
          type="text"
          className="bronify-page__search"
          placeholder="Search by title or artist"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          className="bronify-page__add-toggle"
          onClick={() => setShowAddForm((v) => !v)}
        >
          {showAddForm ? 'Cancel' : 'Add Track'}
        </button>
      </div>

      {showAddForm && (
        <AddTrackForm
          onAdd={(track) => {
            addTrack(track)
            setShowAddForm(false)
          }}
        />
      )}

      <ul className="track-list">
        {filteredTracks.map((track) => (
          <li key={track.id} className="track-row">
            <div className="track-row__info">
              <a
                className="track-row__title"
                href={track.audio_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {track.title}
              </a>
              <span className="track-row__artist">{track.artist}</span>
            </div>
            {track.duration && <span className="track-row__duration">{track.duration}</span>}
            <button
              type="button"
              className={`track-row__like ${likedTrackIds.has(track.id) ? 'track-row__like--liked' : ''}`}
              onClick={() => toggleLike(track.id)}
              aria-label={likedTrackIds.has(track.id) ? `Unlike ${track.title}` : `Like ${track.title}`}
            >
              {likedTrackIds.has(track.id) ? '♥' : '♡'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AddTrackForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [duration, setDuration] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !artist.trim() || !audioUrl.trim()) return
    onAdd({ title: title.trim(), artist: artist.trim(), audioUrl: audioUrl.trim(), duration: duration.trim() })
  }

  return (
    <form className="add-track-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        required
      />
      <input
        type="url"
        placeholder="Audio file URL"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Duration (e.g. 3:24)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  )
}
