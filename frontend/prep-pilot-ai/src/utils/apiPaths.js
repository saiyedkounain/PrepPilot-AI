export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const API_PATHS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    UPLOAD_IMAGE: '/auth/upload-image',
  },
  AI: {
    GENERATE_QUESTIONS: '/ai/generate-questions',
    GENERATE_EXPLANATION: '/ai/generate-explanation',
  },
  SESSIONS: {
    ROOT: '/sessions',
    CREATE: '/sessions/create',
    MY_SESSIONS: '/sessions/my-sessions',
    BY_ID: (id) => `/sessions/${id}`,
  },
  QUESTIONS: {
    ADD: '/questions/add',
    PIN: (id) => `/questions/${id}/pin`,
    NOTE: (id) => `/questions/${id}/note`,
  },
};