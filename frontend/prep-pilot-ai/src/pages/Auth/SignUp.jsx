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
  Avatar,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Person as PersonIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { validateEmail } from '../../utils/helper.js'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATHS } from '../../utils/apiPaths.js'
import { uploadProfileImage } from '../../utils/uploadImage.js'
import { useUser } from '../../context/UserContext.jsx'

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = React.useState(null)
  const [profilePreview, setProfilePreview] = React.useState(null)
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = React.useState(null)

  const navigate = useNavigate()
  const { login } = useUser()
  const theme = useTheme()
  const fileInputRef = React.useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePic(file)
      const preview = URL.createObjectURL(file)
      setProfilePreview(preview)
    }
  }

  const handleRemoveImage = () => {
    setProfilePic(null)
    setProfilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // lets handle sign up form submission
  const handleSignUp = async (e) => {
    e.preventDefault()

    let profilePicUrl = ''
    if (!fullName || fullName.length < 3) {
      setError('Full name must be at least 3 characters long.')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setError('')

    try {
      let profileImageUrl = ''
      if (profilePic) {
        profileImageUrl = await uploadProfileImage(profilePic)
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      })

      const userData = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        profileImageUrl: response.data.profileImageUrl,
      }

      login(userData, response.data.token)
      navigate('/dashboard')
    } catch (err) {
      console.error('Sign up failed', err)
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
        Create an account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Get started today by entering your details below!
      </Typography>

      <form onSubmit={handleSignUp}>
        {/* Profile Photo Selector */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profilePreview}
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.secondary.main,
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            {profilePreview ? (
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  bgcolor: theme.palette.error.main,
                  color: 'white',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    bgcolor: theme.palette.error.dark,
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  bgcolor: theme.palette.secondary.main,
                  color: 'white',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark,
                  },
                }}
              >
                <CloudUploadIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Full Name"
          placeholder="e.g. Sanjana"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          sx={{ mb: 3 }}
          required
        />

        <TextField
          fullWidth
          label="Email Address"
          placeholder="saiyedk@gmail.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          required
        />

        <TextField
          fullWidth
          label="Password"
          placeholder="Min. 8 characters"
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
          Sign Up
        </Button>

        <Typography variant="body2" align="center" color="text.secondary">
          Already have an account?{' '}
          <Link
            component="button"
            type="button"
            onClick={() => {
              setCurrentPage('login')
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
            Login
          </Link>
        </Typography>
      </form>
    </Box>
  )
}

export default SignUp
