import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATHS } from '../../utils/apiPaths.js'
import { useUser } from '../../context/UserContext.jsx'

const Dashboard = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, logout } = useUser()

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.SESSIONS.MY_SESSIONS)
        setSessions(res.data || [])
      } catch (err) {
        setError('Failed to load sessions')
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const handleStartNew = () => {
    navigate('/interview-prep/new')
  }

  const handleOpenSession = (id) => {
    navigate(`/interview-prep/${id}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Please log in</h2>
        <p className="text-sm text-slate-700">You need to log in to view your sessions.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Welcome back, {user.name}</h2>
        <div className="flex items-center gap-2">
          <button onClick={handleStartNew} className="btn-primary">
            Start New Session
          </button>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-full border border-slate-300 text-slate-800 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-700">Loading your sessions...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !sessions.length && !error && (
        <p className="text-sm text-slate-700">No sessions yet. Click "Start New Session" to begin.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="bg-white rounded-lg shadow-sm border border-amber-100 p-4 cursor-pointer hover:shadow-md"
            onClick={() => handleOpenSession(session._id)}
          >
            <h3 className="font-semibold mb-1">{session.role}</h3>
            <p className="text-xs text-slate-600 mb-1">Experience: {session.experience}</p>
            <p className="text-xs text-slate-600 mb-1">Topics: {session.topicsToFocus}</p>
            <p className="text-[11px] text-slate-500">
              {session.createdAt && new Date(session.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
