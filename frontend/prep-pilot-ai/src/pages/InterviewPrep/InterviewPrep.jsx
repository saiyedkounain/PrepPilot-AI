import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATHS } from '../../utils/apiPaths.js'
import { useUser } from '../../context/UserContext.jsx'

const InterviewPrep = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()

  const [role, setRole] = useState('')
  const [experience, setExperience] = useState('')
  const [topicsToFocus, setTopicsToFocus] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [answerLoadingId, setAnswerLoadingId] = useState(null)

  useEffect(() => {
    if (sessionId && sessionId !== 'new') {
      const fetchSession = async () => {
        try {
          const res = await axiosInstance.get(API_PATHS.SESSIONS.BY_ID(sessionId))
          const s = res.data.session || res.data
          setRole(s.role || '')
          setExperience(s.experience || '')
          setTopicsToFocus(s.topicsToFocus || '')
          setDescription(s.description || '')
          setQuestions(s.questions || [])
        } catch (err) {
          setError('Failed to load session')
        }
      }
      fetchSession()
    }
  }, [sessionId])

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Please log in</h2>
        <p className="text-sm text-slate-700">You need to log in to use Interview Prep.</p>
      </div>
    )
  }

  const handleGenerate = async () => {
    if (!role || !experience || !topicsToFocus) {
      setError('Please fill role, experience and topics')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const aiRes = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role,
        experience,
        topicsToFocus,
        numberOfQuestions: 5,
      })

      const generatedQuestions = aiRes.data.questions || aiRes.data || []
      const normalized = generatedQuestions.map((q, idx) => ({
        question: q.question || `Question ${idx + 1}`,
        answer: q.answer || '',
      }))

      const sessionRes = await axiosInstance.post(API_PATHS.SESSIONS.CREATE, {
        role,
        experience,
        topicsToFocus,
        description,
        questions: normalized,
      })

      const newSessionId = sessionRes.data.session?._id || sessionRes.data._id
      if (newSessionId) {
        navigate(`/interview-prep/${newSessionId}`)
      }
    } catch (err) {
      console.error('Generate questions failed', err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        setError(data.error || data.message || 'Failed to generate questions. Please try again.');
      } else if (err.request) {
        setError('Cannot reach the server. Make sure the backend is running on http://localhost:8000.');
      } else {
        setError('Failed to generate questions. Please try again.');
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePin = async (id) => {
    try {
      const res = await axiosInstance.post(API_PATHS.QUESTIONS.PIN(id))
      const updated = res.data.question
      setQuestions((prev) => {
        const mapped = prev.map((q) => (q._id === updated._id ? updated : q))
        return mapped
          .slice()
          .sort((a, b) => {
            if (a.isPinned === b.isPinned) {
              const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
              const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
              return da - db
            }
            return b.isPinned - a.isPinned
          })
      })
    } catch (err) {
      // ignore for now
    }
  }

  const handleAnswerQuestion = async (idOrKey, questionText) => {
    setAnswerLoadingId(idOrKey)
    try {
      const res = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        question: questionText,
      })
      const explanation = res.data.explanation || res.data.answer || ''
      setQuestions((prev) =>
        prev.map((q) =>
          (q._id || q.question) === idOrKey ? { ...q, answer: explanation } : q
        )
      )
    } catch (err) {
      console.error('Get answer failed', err)
      if (err.response && err.response.data) {
        const data = err.response.data
        setError(data.error || data.message || 'Failed to get answer. Please try again.')
      } else if (err.request) {
        setError('Cannot reach the server. Make sure the backend is running on http://localhost:8000.')
      } else {
        setError('Failed to get answer. Please try again.')
      }
    } finally {
      setAnswerLoadingId(null)
    }
  }

  const handleSaveNote = async (id, note) => {
    try {
      const res = await axiosInstance.post(API_PATHS.QUESTIONS.NOTE(id), { note })
      const updated = res.data.question
      setQuestions((prev) => prev.map((q) => (q._id === updated._id ? updated : q)))
    } catch (err) {
      // ignore for now
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Prep Pilot AI</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm px-4 py-2 rounded-full border border-slate-300 text-slate-800 hover:bg-slate-100"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-medium text-slate-700">Role</label>
          <input
            className="w-full border rounded-md px-3 py-2 text-sm mt-1"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Frontend Engineer"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700">Experience (years)</label>
          <input
            className="w-full border rounded-md px-3 py-2 text-sm mt-1"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-slate-700">Topics to focus on</label>
          <input
            className="w-full border rounded-md px-3 py-2 text-sm mt-1"
            value={topicsToFocus}
            onChange={(e) => setTopicsToFocus(e.target.value)}
            placeholder="e.g. React, JavaScript, System Design"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-slate-700">Description (optional)</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm mt-1"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Anything specific about this interview set"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <button className="btn-primary mb-6" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating with AI...' : 'Generate Questions with AI'}
      </button>

      <div className="mt-4 space-y-4">
        {questions.map((q) => (
          <div
            key={q._id || q.question}
            className={`border rounded-lg p-4 ${q.isPinned ? 'border-amber-400 bg-amber-50' : 'border-slate-200'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm mr-4">{q.question}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAnswerQuestion(q._id || q.question, q.question)}
                  className="text-xs px-2 py-1 rounded-full border border-slate-300 text-slate-800"
                  disabled={answerLoadingId === (q._id || q.question)}
                >
                  {answerLoadingId === (q._id || q.question)
                    ? 'Answering...'
                    : q.answer
                    ? 'Re-answer'
                    : 'Answer'}
                </button>
                {q._id && (
                  <button
                    onClick={() => handleTogglePin(q._id)}
                    className="text-xs px-2 py-1 rounded-full border border-amber-400 text-amber-700"
                  >
                    {q.isPinned ? 'Unpin' : 'Pin'}
                  </button>
                )}
              </div>
            </div>
            {q.answer && <p className="text-xs text-slate-700 mb-2 whitespace-pre-line">{q.answer}</p>}
            {q._id && (
              <textarea
                className="w-full border rounded-md px-2 py-1 text-xs"
                rows={2}
                defaultValue={q.note}
                placeholder="Your notes..."
                onBlur={(e) => handleSaveNote(q._id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default InterviewPrep
