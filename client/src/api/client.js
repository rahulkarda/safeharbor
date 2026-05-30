import axios from 'axios'
import useAppStore from '../store/appStore.js'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Try Zustand store first, then localStorage fallback
    const token =
      useAppStore.getState().token || localStorage.getItem('sh_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — log out and redirect
      useAppStore.getState().logout()
      window.location.href = '/login'
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.'

    return Promise.reject(new Error(message))
  }
)

export default apiClient
