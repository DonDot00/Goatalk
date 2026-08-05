import { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import LikedSongsPanel from '../components/LikedSongsPanel'
import './BronifyLayout.css'

// Spotify-style shell for the Bronify section: track list renders in the
// middle via <Outlet />, liked-songs panel pinned to the right. Track +
// like state lives here since both the track list and the liked panel need it.
export default function BronifyLayout() {
  const { user } = useAuth()
  const [tracks, setTracks] = useState([])
  const [likedTrackIds, setLikedTrackIds] = useState(new Set())

  const fetchTracks = useCallback(async () => {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load tracks:', error.message)
      return
    }
    setTracks(data)
  }, [])

  const fetchLikes = useCallback(async () => {
    const { data, error } = await supabase
      .from('track_likes')
      .select('track_id')
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to load liked tracks:', error.message)
      return
    }
    setLikedTrackIds(new Set(data.map((row) => row.track_id)))
  }, [user.id])

  useEffect(() => {
    fetchTracks()
    fetchLikes()
  }, [fetchTracks, fetchLikes])

  async function addTrack({ title, artist, audioUrl, coverUrl, duration }) {
    const { error } = await supabase.from('tracks').insert({
      title,
      artist,
      audio_url: audioUrl,
      cover_url: coverUrl || null,
      duration: duration || null,
    })

    if (error) {
      console.error('Failed to add track:', error.message)
      return
    }
    fetchTracks()
  }

  async function toggleLike(trackId) {
    if (likedTrackIds.has(trackId)) {
      await supabase.from('track_likes').delete().eq('track_id', trackId).eq('user_id', user.id)
    } else {
      await supabase.from('track_likes').insert({ track_id: trackId, user_id: user.id })
    }
    fetchLikes()
  }

  const likedTracks = tracks.filter((track) => likedTrackIds.has(track.id))

  return (
    <div className="bronify-layout">
      <div className="bronify-layout__main">
        <Outlet context={{ tracks, likedTrackIds, addTrack, toggleLike }} />
      </div>
      <LikedSongsPanel tracks={likedTracks} onToggleLike={toggleLike} />
    </div>
  )
}