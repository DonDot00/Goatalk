import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CHANNELS } from '../data/channels'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import Post from '../components/Post'
import MessageInput from '../components/MessageInput'
import './ChannelPage.css'

// Main channel view: header bar, welcome banner, post feed, message composer.
export default function ChannelPage() {
  const { channelId } = useParams()
  const { user } = useAuth()
  const channel = CHANNELS.find((c) => c.id === channelId)

  const [posts, setPosts] = useState([])
  const [likedPostIds, setLikedPostIds] = useState(new Set())
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('time')

  const fetchPosts = useCallback(async () => {
    const { data: postsData, error } = await supabase
      .from('posts')
      .select('id, title, content, image_url, created_at, user_id, profiles!posts_user_id_fkey(username)')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Failed to load posts:', error.message)
      return
    }

    const postIds = postsData.map((p) => p.id)
    // map of postId -> number of likes, and a set of postIds that the current user has liked
    const likesByPost = {}
    const myLikes = new Set()

    if (postIds.length > 0) {
      const { data: likesData } = await supabase
        .from('post_likes')
        .select('post_id, user_id')
        .in('post_id', postIds)

      for (const like of likesData ?? []) {
        likesByPost[like.post_id] = (likesByPost[like.post_id] ?? 0) + 1
        if (like.user_id === user.id) myLikes.add(like.post_id)
      }
    }

    setPosts(
      postsData.map((p) => ({
        id: p.id,
        userId: p.user_id,
        user: p.profiles?.username ?? 'Unknown',
        avatar: (p.profiles?.username ?? '?').slice(0, 2).toUpperCase(),
        title: p.title,
        time: new Date(p.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        createdAt: p.created_at,
        content: p.content,
        image: p.image_url,
        likes: likesByPost[p.id] ?? 0,
      })),
    )
    setLikedPostIds(myLikes)
  }, [channelId, user.id])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  async function handleSend({ title, content, imageUrl }) {
    const { error } = await supabase.from('posts').insert({
      channel_id: channelId,
      user_id: user.id,
      title,
      content: content || '',
      image_url: imageUrl || null,
    })

    if (error) {
      console.error('Failed to send post:', error.message)
      return
    }
    fetchPosts()
  }

  async function toggleLike(postId) {
    if (likedPostIds.has(postId)) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id })
    }
    fetchPosts()
  }

  const visiblePosts = posts
    .filter((post) => post.title.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'likes') return b.likes - a.likes
      return new Date(a.createdAt) - new Date(b.createdAt)
    })

  return (
    <div className="channel-page">
      <div className="channel-page__toolbar">
        <input
          type="text"
          className="channel-page__search"
          placeholder="Search posts by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="channel-page__sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="time">Newest</option>
          <option value="likes">Most Upvoted</option>
        </select>
      </div>

      <div className="channel-page__feed">
        {visiblePosts.map((post, i) => (
          <Post
            key={post.id}
            post={post}
            channelId={channelId}
            liked={likedPostIds.has(post.id)}
            showAvatar={i === 0 || visiblePosts[i - 1].userId !== post.userId}
            onToggleLike={() => toggleLike(post.id)}
          />
        ))}
      </div>
      <MessageInput channelName={channel?.name} onSend={handleSend} />
    </div>
  )
}