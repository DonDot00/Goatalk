import { useState } from 'react'
import './MessageInput.css'

/**
 * Create-post form pinned to the bottom of the channel view.
 * props:
 *   channelName: string  // used for the title placeholder text
 *   onSend: ({ title, content, imageUrl }) => void
 */
export default function MessageInput({ channelName, onSend }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    onSend({ title: trimmedTitle, content: content.trim(), imageUrl: imageUrl.trim() })
    setTitle('')
    setContent('')
    setImageUrl('')
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <div className="message-input__fields">
        <input
          type="text"
          className="message-input__field"
          placeholder={channelName ? `Title a post in #${channelName}` : 'Post title'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="message-input__field"
          placeholder="Content (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="url"
          className="message-input__field"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="message-input__send"
        disabled={!title.trim()}
      >
        Post
      </button>
    </form>
  )
}
