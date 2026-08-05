import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import './PostPage.css'

// Single-post detail view: full content, image, upvote, comments, and
// edit/delete controls for the original author.
export default function PostPage() {
  const { channelId, postId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const fetchPost = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, content, image_url, created_at, user_id, profiles!posts_user_id_fkey(username)')
      .eq('id', postId)
      .single()

    if (error) {
      console.error('Failed to load post:', error.message)
      return
    }

    const { data: likesData } = await supabase.from('post_likes').select('user_id').eq('post_id', postId)
    setLiked((likesData ?? []).some((row) => row.user_id === user.id))

    setPost({
      id: data.id,
      userId: data.user_id,
      user: data.profiles?.username ?? 'Unknown',
      title: data.title,
      content: data.content,
      image: data.image_url,
      time: new Date(data.created_at).toLocaleString(),
      likes: (likesData ?? []).length,
    })
    setEditTitle(data.title)
    setEditContent(data.content)
  }, [postId, user.id])

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('id, content, created_at, profiles!comments_user_id_fkey(username)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Failed to load comments:', error.message)
      return
    }

    setComments(
      data.map((c) => ({
        id: c.id,
        user: c.profiles?.username ?? 'Unknown',
        content: c.content,
        time: new Date(c.created_at).toLocaleString(),
      })),
    )
  }, [postId])

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [fetchPost, fetchComments])

  async function toggleLike() {
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id })
    }
    fetchPost()
  }

  async function handleAddComment(e) {
    e.preventDefault()
    const trimmed = commentText.trim()
    if (!trimmed) return

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content: trimmed,
    })

    if (error) {
      console.error('Failed to add comment:', error.message)
      return
    }
    setCommentText('')
    fetchComments()
  }

  async function handleSaveEdit(e) {
    e.preventDefault()
    if (!editTitle.trim()) return

    const { error } = await supabase
      .from('posts')
      .update({ title: editTitle.trim(), content: editContent.trim() })
      .eq('id', postId)

    if (error) {
      console.error('Failed to update post:', error.message)
      return
    }
    setIsEditing(false)
    fetchPost()
  }

  async function handleDelete() {
    const { error } = await supabase.from('posts').delete().eq('id', postId)
    if (error) {
      console.error('Failed to delete post:', error.message)
      return
    }
    navigate(`/channels/${channelId}`)
  }

  if (!post) return null

  const isOwner = post.userId === user.id

  return (
    <div className="post-page">
      <Link className="post-page__back" to={`/channels/${channelId}`}>
        ← Back to #{channelId}
      </Link>

      {isEditing ? (
        <form className="post-page__edit-form" onSubmit={handleSaveEdit}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
          />
          <div className="post-page__edit-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1 className="post-page__title">{post.title}</h1>
          <div className="post-page__meta">
            <span>{post.user}</span>
            <span>{post.time}</span>
          </div>

          {post.content && <p className="post-page__content">{post.content}</p>}
          {post.image && <img className="post-page__image" src={post.image} alt="" />}

          <div className="post-page__actions">
            <button
              type="button"
              className={`post-page__upvote ${liked ? 'post-page__upvote--liked' : ''}`}
              onClick={toggleLike}
            >
              {liked ? '♥' : '♡'} {post.likes}
            </button>

            {isOwner && (
              <>
                <button type="button" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
                <button type="button" onClick={handleDelete}>
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}

      <div className="post-page__comments">
        <h2>Comments</h2>
        <form className="post-page__comment-form" onSubmit={handleAddComment}>
          <input
            type="text"
            placeholder="Leave a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" disabled={!commentText.trim()}>
            Comment
          </button>
        </form>

        <ul className="post-page__comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="post-page__comment">
              <div className="post-page__comment-meta">
                <span className="post-page__comment-user">{comment.user}</span>
                <span className="post-page__comment-time">{comment.time}</span>
              </div>
              <p>{comment.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
