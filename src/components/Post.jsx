import { Link } from 'react-router-dom'
import './Post.css'

/**
 * Single post row in the message feed.
 * props:
 *   post: { id, user, avatar, title, time, content, image, likes }
 *   channelId: string  // for linking to the post's detail page
 *   liked: boolean
 *   showAvatar: boolean  // collapse consecutive posts from the same user
 *   onToggleLike: () => void
 */
export default function Post({ post, channelId, liked, showAvatar, onToggleLike }) {
  return (
    <div className={`post ${showAvatar ? '' : 'post--grouped'}`}>
      <div className="post__gutter">
        {showAvatar ? (
          <div className="post__avatar">{post.avatar}</div>
        ) : (
          <span className="post__time post__time--hover">{post.time}</span>
        )}
      </div>

      <div className="post__body">
        {showAvatar && (
          <div className="post__header">
            <span className="post__user">{post.user}</span>
            <span className="post__time">{post.time}</span>
          </div>
        )}

        <Link className="post__title" to={`/channels/${channelId}/posts/${post.id}`}>
          {post.title}
        </Link>

        {post.content && <p className="post__content">{post.content}</p>}

        {post.image && (
          <img className="post__image" src={post.image} alt="" />
        )}

        <div className="post__actions">
          {/* Like button with heart icon and like count */}
          <button
            type="button"
            className={`post__action ${liked ? 'post__action--liked' : ''}`}
            onClick={onToggleLike}
          >
            <span className="post__action-icon">{liked ? '♥' : '♡'}</span>
            <span>{post.likes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
