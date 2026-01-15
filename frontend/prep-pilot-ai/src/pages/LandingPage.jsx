import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
} from '@mui/material'
import { AutoAwesome } from '@mui/icons-material'
import { LuSparkles } from 'react-icons/lu'

import HERO_IMG from '../assets/hero-img.png'
import { APP_FEATURES } from '../utils/data.js'
import Modal from '../components/Modal.jsx'
import Login from './Auth/Login.jsx'
import SignUp from './Auth/SignUp.jsx'

const LandingPage = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  const [openAuthModal, setOpenAuthModal] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState('login')

  const handleCTA = () => {
    setCurrentPage('signup')
    setOpenAuthModal(true)
  }

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '500px',
            height: '500px',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.2)} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <AppBar
            position="static"
            elevation={0}
            sx={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              py: 2,
            }}
          >
            <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
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
                variant="contained"
                color="secondary"
                onClick={() => setOpenAuthModal(true)}
                sx={{
                  borderRadius: '24px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Login/Sign Up
              </Button>
            </Toolbar>
          </AppBar>

          {/* Hero Content */}
          <Box sx={{ py: { xs: 4, md: 8 }, pb: { xs: 8, md: 20 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Chip
                  icon={<AutoAwesome />}
                  label="AI Powered"
                  sx={{
                    mb: 3,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.dark,
                    fontWeight: 600,
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                  }}
                />
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    lineHeight: 1.2,
                    color: theme.palette.text.primary,
                  }}
                >
                  Ace Interviews with{' '}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.warning.main} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundSize: '200% 200%',
                      animation: 'text-shine 3s ease-in-out infinite alternate',
                      '@keyframes text-shine': {
                        '0%': { backgroundPosition: '0% 50%' },
                        '100%': { backgroundPosition: '100% 50%' },
                      },
                    }}
                  >
                    AI-Powered
                  </Box>{' '}
                  Learning
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.125rem',
                    color: theme.palette.text.secondary,
                    mb: 4,
                    lineHeight: 1.8,
                  }}
                >
                  Get role-specific questions, expand when you need them, dive
                  deeper into concepts, make preparation much more easier. From
                  zero to hero with Prep Pilot AI. The ultimate interview prep
                  companion.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleCTA}
                  sx={{
                    borderRadius: '24px',
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  Get Started
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Hero Image Section */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: { xs: -8, md: -12 },
          mb: 8,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Box
          component="img"
          src={HERO_IMG}
          alt="Hero Image"
          sx={{
            width: { xs: '90vw', md: '80vw' },
            maxWidth: '1200px',
            borderRadius: 4,
            boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.15)}`,
          }}
        />
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          py: 10,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              fontWeight: 600,
              mb: 8,
              color: theme.palette.text.primary,
            }}
          >
            Features that make you Shine!
          </Typography>

          <Grid container spacing={4}>
            {/* First 3 cards */}
            {APP_FEATURES.slice(0, 3).map((feature) => (
              <Grid item xs={12} md={4} key={feature.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 40px ${alpha(theme.palette.secondary.main, 0.2)}`,
                    },
                  }}
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
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.7,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Remaining 2 cards */}
            {APP_FEATURES.slice(3).map((feature) => (
              <Grid item xs={12} md={6} key={feature.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 40px ${alpha(theme.palette.secondary.main, 0.2)}`,
                    },
                  }}
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
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.7,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.grey[100], 0.5),
          py: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Made with ❤️ by Saiyed Kounain and team.
        </Typography>
      </Box>

      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false)
          setCurrentPage('login')
        }}
        hideHeader
      >
        <div>
          {currentPage === 'login' && (
            <Login setCurrentPage={setCurrentPage} />
          )}
          {currentPage === 'signup' && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  )
}

export default LandingPage
