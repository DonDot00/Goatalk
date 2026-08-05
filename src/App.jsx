import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import AuthPage from './pages/AuthPage'
import RootLayout from './layouts/RootLayout'
import ChannelsLayout from './layouts/ChannelsLayout'
import ChannelPage from './pages/ChannelPage'
import PostPage from './pages/PostPage'
import BronifyLayout from './layouts/BronifyLayout'
import BronifyPage from './pages/BronifyPage'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

function AppRoutes() {
  const { session, loading } = useAuth()

  if (loading) return null
  if (!session) return <AuthPage />

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<ChannelsLayout />}>
          <Route index element={<Navigate to="/channels/general" replace />} />
          <Route path="channels/:channelId" element={<ChannelPage />} />
          <Route path="channels/:channelId/posts/:postId" element={<PostPage />} />
        </Route>
        <Route path="/bronify" element={<BronifyLayout />}>
          <Route index element={<BronifyPage />} />
        </Route>
      </Route>
    </Routes>
  )
}