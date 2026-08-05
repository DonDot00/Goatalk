import { Link, useLocation } from 'react-router-dom'
import './Rail.css'

const NAV_ITEMS = [
  // I want to make lediscord the default page when the user logs in.
  { to: '/', match: (path) => path === '/' || path.startsWith('/channels'), alt: 'LeDiscord', icon: '/LeLogo.png' },
  { to: '/bronify', match: (path) => path.startsWith('/bronify'), alt: 'Bronify', icon: '/LebronRAIL.png' },
]

// Far-left icon rail: switches between the app's top-level sections
// (LeDiscord chat, Bronify music) plus a settings icon at the bottom.
export default function Rail() {
  const { pathname } = useLocation()

  return (
    <div className="rail">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`rail__item ${item.match(pathname) ? 'rail__item--active' : ''}`}
        >
          <img src={item.icon} alt={item.alt} />
        </Link>
      ))}

      <div className="rail__spacer" />

      <div className="rail__settings">
        <img src="/settings.png" alt="Settings" />
      </div>
    </div>
  )
}
