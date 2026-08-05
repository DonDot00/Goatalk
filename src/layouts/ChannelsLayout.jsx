import { Outlet, useNavigate, useParams } from 'react-router-dom'
import ChannelSidebar from '../components/ChannelSidebar'
import LebronPanel from '../components/LebronPanel'
import { CHANNELS } from '../data/channels'
import { CAREER_STATS, CAREER_TOTALS, ACCOLADES, RECORDS, MILESTONES, FUN_FACTS } from '../data/stats'
import './ChannelsLayout.css'

// Discord-style shell (sidebar + right panel). Rail is rendered one level up
// in RootLayout so it persists across sections. The active channel
// (see ChannelPage) renders in the middle via <Outlet />.
export default function ChannelsLayout() {
  const { channelId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="app-layout">
      <ChannelSidebar
        channels={CHANNELS}
        activeChannelId={channelId}
        onSelectChannel={(id) => navigate(`/channels/${id}`)}
      />
      <Outlet />
      <LebronPanel
        careerStats={CAREER_STATS}
        careerTotals={CAREER_TOTALS}
        accolades={ACCOLADES}
        records={RECORDS}
        milestones={MILESTONES}
        funFacts={FUN_FACTS}
      />
    </div>
  )
}