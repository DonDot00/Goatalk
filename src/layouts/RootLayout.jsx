import { Outlet } from 'react-router-dom'
import Rail from '../components/Rail'
import './RootLayout.css'

// Wraps every route. Rail lives here so it stays on screen no matter which
// section (LeDiscord, Bronify, ...) is active; that section's own layout
// renders in the middle via <Outlet />.
export default function RootLayout() {
  return (
    <div className="root-layout">
      <Rail />
      <Outlet />
    </div>
  )
}
