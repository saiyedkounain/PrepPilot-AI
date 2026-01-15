import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  useTheme,
} from '@mui/material'
import { validateEmail } from '../../utils/helper.js'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATHS } from '../../utils/apiPaths.js'
import { useUser } from '../../context/UserContext.jsx'

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { login } = useUser()
  const theme = useTheme()

  //handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    //login api call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      })

      const userData = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        profileImageUrl: response.data.profileImageUrl,
      }

      login(userData, response.data.token)
      setError(null)
      navigate('/dashboard')
    } catch (err) {
      console.error('Login failed', err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else if (err.request) {
        setError('Cannot reach the server. Make sure the backend is running on http://localhost:5000.')
      } else {
        setError('An unexpected error occurred. Please try again later.')
      }
    }
  }

  return (
    <Box
      sx={{
        width: { xs: '90vw', md: '400px' },
        p: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
        Welcome Back!
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Please enter your details to login to your account.
      </Typography>

      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Email Address"
          placeholder="saiyedk@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          required
        />

        <TextField
          fullWidth
          label="Password"
          placeholder="*********"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          required
          InputProps={{
            endAdornment: (
              <Button
                size="small"
                onClick={() => setShowPassword(!showPassword)}
                sx={{
                  minWidth: 'auto',
                  textTransform: 'none',
                  color: theme.palette.text.secondary,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            ),
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mb: 3,
            borderRadius: '12px',
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Login
        </Button>

        <Typography variant="body2" align="center" color="text.secondary">
          New User?{' '}
          <Link
            component="button"
            type="button"
            onClick={() => {
              setCurrentPage('signup')
            }}
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign Up
          </Link>
        </Typography>
      </form>
    </Box>
  )
}

export default Login
