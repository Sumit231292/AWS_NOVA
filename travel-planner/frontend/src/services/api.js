import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'
import { COGNITO_ENABLED } from '../config/amplify'

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 minutes — AI responses can take time
  headers: { 'Content-Type': 'application/json' }
})

// ── Inject Cognito JWT on every request ──────────────────────────────────────
api.interceptors.request.use(async (config) => {
  if (COGNITO_ENABLED) {
    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch { /* not signed in — continue without token */ }
  }
  return config
})

api.interceptors.response.use(
  res => res.data,
  err => {
    const message = err.response?.data?.detail || err.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export const travelAPI = {
  /** Generate full multi-day itinerary */
  generateItinerary: (tripData) => api.post('/plan/full', tripData),

  /** Generate packing list */
  getPackingList: (data) => api.post('/plan/packing-list', data),

  /** Get budget estimate */
  getBudget: (data) => api.post('/plan/budget', data),

  /** Chat with AI travel assistant */
  chat: (messages, tripContext = null) =>
    api.post('/chat', { messages, trip_context: tripContext }),

  /** Get quick tips */
  getQuickTips: (destination, category = 'general') =>
    api.post(`/plan/quick-tips?destination=${encodeURIComponent(destination)}&category=${category}`),

  /** Health check */
  health: () => api.get('/health'),

  // ── Saved Itineraries (DynamoDB-backed, auth-required) ───────────────────
  listItineraries:  ()     => api.get('/itineraries'),
  saveItinerary:    (data) => api.post('/itineraries', data),
  deleteItinerary:  (id)   => api.delete(`/itineraries/${id}`),
}

export default api
