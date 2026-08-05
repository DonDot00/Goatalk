import './ChannelSidebar.css'

/**
 * Channel list + current user footer.
 * props:
 *   channels: array of { id, name, icon, unread }
 *   activeChannelId: id of the currently selected channel
 *   onSelectChannel: (id) => void
 */
export default function ChannelSidebar({ channels, activeChannelId, onSelectChannel }) {
  return (
    <div className="sidebar">
      <h2>GOATalk</h2>
      <h3>Channels</h3>
      <ul className="channel-list">
        {channels.map((channel) => (
          <li
            key={channel.id}
            className={`channel-item ${activeChannelId === channel.id ? 'active' : ''}`}
            onClick={() => onSelectChannel(channel.id)}
          >
            <span className="channel-icon">{channel.icon}</span>
            <span className="channel-name">{channel.name}</span>
            {channel.unread > 0 && (
              <span className="unread-count">{channel.unread}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}