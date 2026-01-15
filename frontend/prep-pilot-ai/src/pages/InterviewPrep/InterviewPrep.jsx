import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  AppBar,
  Toolbar,
  TextareaAutosize,
  useTheme,
  alpha,
  Paper,
  Divider,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  AutoAwesome as AutoAwesomeIcon,
  PushPin as PushPinIcon,
  PushPinOutlined as PushPinOutlinedIcon,
  EditNote as EditNoteIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATHS } from '../../utils/apiPaths.js'
import { useUser } from '../../context/UserContext.jsx'

const InterviewPrep = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()
  const theme = useTheme()

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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          <Typography variant="h6" sx={{ mb: 1 }}>
            Please log in
          </Typography>
          <Typography variant="body2">
            You need to log in to use Interview Prep.
          </Typography>
        </Alert>
      </Container>
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
      console.error('Generate questions failed', err)
      if (err.response && err.response.data) {
        const data = err.response.data
        setError(data.error || data.message || 'Failed to generate questions. Please try again.')
      } else if (err.request) {
        setError('Cannot reach the server. Make sure the backend is running on http://localhost:8000.')
      } else {
        setError('Failed to generate questions. Please try again.')
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
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Prep Pilot AI
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              textTransform: 'none',
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Form Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Session Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role"
                placeholder="e.g. Frontend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={sessionId !== 'new'}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience (years)"
                placeholder="e.g. 2"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                disabled={sessionId !== 'new'}
                type="number"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Topics to focus on"
                placeholder="e.g. React, JavaScript, System Design"
                value={topicsToFocus}
                onChange={(e) => setTopicsToFocus(e.target.value)}
                disabled={sessionId !== 'new'}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (optional)"
                placeholder="Anything specific about this interview set"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={sessionId !== 'new'}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {sessionId === 'new' && (
            <Button
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
              onClick={handleGenerate}
              disabled={loading}
              sx={{
                mt: 2,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
              }}
            >
              {loading ? 'Generating with AI...' : 'Generate Questions with AI'}
            </Button>
          )}
        </Paper>

        {/* Questions Section */}
        {questions.length > 0 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Questions ({questions.length})
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {questions.map((q) => (
                <Card
                  key={q._id || q.question}
                  sx={{
                    border: `2px solid ${
                      q.isPinned
                        ? theme.palette.warning.main
                        : alpha(theme.palette.divider, 0.1)
                    }`,
                    backgroundColor: q.isPinned
                      ? alpha(theme.palette.warning.main, 0.05)
                      : theme.palette.background.paper,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {q.isPinned && (
                            <Chip
                              icon={<PushPinIcon />}
                              label="Pinned"
                              size="small"
                              color="warning"
                              sx={{ mb: 1 }}
                            />
                          )}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 2,
                          }}
                        >
                          {q.question}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={
                            answerLoadingId === (q._id || q.question) ? (
                              <CircularProgress size={16} />
                            ) : (
                              <SendIcon />
                            )
                          }
                          onClick={() => handleAnswerQuestion(q._id || q.question, q.question)}
                          disabled={answerLoadingId === (q._id || q.question)}
                          sx={{
                            textTransform: 'none',
                            borderRadius: '8px',
                          }}
                        >
                          {answerLoadingId === (q._id || q.question)
                            ? 'Answering...'
                            : q.answer
                            ? 'Re-answer'
                            : 'Get Answer'}
                        </Button>
                        {q._id && (
                          <IconButton
                            onClick={() => handleTogglePin(q._id)}
                            sx={{
                              color: q.isPinned
                                ? theme.palette.warning.main
                                : theme.palette.text.secondary,
                            }}
                          >
                            {q.isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
                          </IconButton>
                        )}
                      </Box>
                    </Box>

                    {q.answer && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: '8px',
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: 'pre-line',
                              lineHeight: 1.8,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {q.answer}
                          </Typography>
                        </Box>
                      </>
                    )}

                    {q._id && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <EditNoteIcon
                            sx={{
                              fontSize: 20,
                              color: theme.palette.text.secondary,
                              mt: 0.5,
                            }}
                          />
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Your notes..."
                            defaultValue={q.note}
                            onBlur={(e) => handleSaveNote(q._id, e.target.value)}
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                              },
                            }}
                          />
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default InterviewPrep
