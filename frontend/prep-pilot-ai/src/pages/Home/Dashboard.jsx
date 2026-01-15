import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATHS } from '../../utils/apiPaths.js'
import { useUser } from '../../context/UserContext.jsx'

const Dashboard = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, logout } = useUser()
  const theme = useTheme()

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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          <Typography variant="h6" sx={{ mb: 1 }}>
            Please log in
          </Typography>
          <Typography variant="body2">
            You need to log in to view your sessions.
          </Typography>
        </Alert>
      </Container>
    )
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleStartNew}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Start New Session
            </Button>
            <IconButton
              onClick={handleLogout}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {user.profileImageUrl ? (
              <Avatar
                src={user.profileImageUrl}
                alt={user.name}
                sx={{ width: 56, height: 56 }}
              />
            ) : (
              <Avatar sx={{ width: 56, height: 56, bgcolor: theme.palette.primary.main }}>
                <PersonIcon />
              </Avatar>
            )}
            <Box>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                Welcome back, {user.name}!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Continue your interview preparation journey
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && !sessions.length && !error && (
          <Card
            sx={{
              textAlign: 'center',
              py: 6,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <CardContent>
              <WorkIcon sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                No sessions yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Click "Start New Session" to begin your interview preparation
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleStartNew}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Create Your First Session
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Sessions Grid */}
        {!loading && sessions.length > 0 && (
          <Grid container spacing={3}>
            {sessions.map((session) => (
              <Grid item xs={12} sm={6} md={4} key={session._id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  onClick={() => handleOpenSession(session._id)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {session.role}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WorkIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary">
                          {session.experience} years experience
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mb: 0.5 }}
                        >
                          Topics:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {session.topicsToFocus}
                        </Typography>
                      </Box>

                      {session.createdAt && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(session.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default Dashboard
