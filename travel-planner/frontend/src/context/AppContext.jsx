import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { COGNITO_ENABLED } from '../config/amplify'
import {
  signIn as cognitoSignIn,
  signUp as cognitoSignUp,
  confirmSignUp as cognitoConfirmSignUp,
  signOut as cognitoSignOut,
  getCurrentUser,
  fetchUserAttributes,
  signInWithRedirect,
} from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { travelAPI } from '../services/api'
import toast from 'react-hot-toast'

const AppContext = createContext()

export function AppProvider({ children }) {
  // ── Theme ──────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('roamly-theme') || 'dark')

  // ── User state ─────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    if (COGNITO_ENABLED) return null   // Will be set after session check
    try { return JSON.parse(localStorage.getItem('roamly-user')) } catch { return null }
  })
  const [userLoading, setUserLoading] = useState(COGNITO_ENABLED) // true while checking Cognito session

  // ── Saved itineraries ──────────────────────────────────────────────────────
  const [savedItineraries, setSavedItineraries] = useState(() => {
    if (COGNITO_ENABLED) return []
    try { return JSON.parse(localStorage.getItem('roamly-itineraries')) || [] } catch { return [] }
  })

  // ── Auth modal state ───────────────────────────────────────────────────────
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin') // 'signin' | 'signup' | 'confirm'
  const pendingConfirmEmail = useRef('')

  // ── Theme toggle ───────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('roamly-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  // ── Build user object from Cognito session ─────────────────────────────────
  const buildUserFromCognito = async () => {
    try {
      const { username, userId } = await getCurrentUser()
      const attrs = await fetchUserAttributes()
      return {
        id: userId,
        email: attrs.email || username,
        name: attrs.name || attrs.email?.split('@')[0] || username,
        avatar: (attrs.name || attrs.email || username)[0].toUpperCase(),
        provider: 'cognito',
      }
    } catch {
      return null
    }
  }

  // ── Load Cognito session on mount ──────────────────────────────────────────
  useEffect(() => {
    if (!COGNITO_ENABLED) return
    ;(async () => {
      const u = await buildUserFromCognito()
      if (u) setUser(u)
      setUserLoading(false)
    })()
  }, [])

  // ── Hub listener for social OAuth redirects ────────────────────────────────
  useEffect(() => {
    if (!COGNITO_ENABLED) return
    const unsubscribe = Hub.listen('auth', async ({ payload }) => {
      if (payload.event === 'signInWithRedirect') {
        const u = await buildUserFromCognito()
        if (u) {
          setUser(u)
          setShowAuthModal(false)
          toast.success(`Welcome, ${u.name}!`)
        }
      }
      if (payload.event === 'signedOut') {
        setUser(null)
        setSavedItineraries([])
      }
    })
    return unsubscribe
  }, [])

  // ── Load saved itineraries when user changes ───────────────────────────────
  useEffect(() => {
    if (!user) { setSavedItineraries([]); return }
    if (!COGNITO_ENABLED) return  // localStorage already loaded in initial state
    travelAPI.listItineraries()
      .then(res => setSavedItineraries(res.data || []))
      .catch(() => {})
  }, [user])

  // ── Auth: Sign In ──────────────────────────────────────────────────────────
  const signIn = async (email, password) => {
    if (!COGNITO_ENABLED) {
      const u = { email, name: email.split('@')[0], avatar: email[0].toUpperCase(), joinedAt: new Date().toISOString() }
      setUser(u)
      localStorage.setItem('roamly-user', JSON.stringify(u))
      setShowAuthModal(false)
      return { success: true }
    }
    const result = await cognitoSignIn({ username: email, password })
    if (result.isSignedIn) {
      const u = await buildUserFromCognito()
      setUser(u)
      setShowAuthModal(false)
      toast.success(`Welcome back, ${u?.name}!`)
      return { success: true }
    }
    return { success: false, nextStep: result.nextStep }
  }

  // ── Auth: Sign Up ──────────────────────────────────────────────────────────
  const signUp = async (email, password, name) => {
    if (!COGNITO_ENABLED) {
      const u = { email, name, avatar: name[0].toUpperCase(), joinedAt: new Date().toISOString() }
      setUser(u)
      localStorage.setItem('roamly-user', JSON.stringify(u))
      setShowAuthModal(false)
      return { success: true, confirmed: true }
    }
    const result = await cognitoSignUp({
      username: email,
      password,
      options: { userAttributes: { email, name } },
    })
    if (result.isSignUpComplete) {
      return { success: true, confirmed: true }
    }
    pendingConfirmEmail.current = email
    return { success: true, confirmed: false, nextStep: result.nextStep }
  }

  // ── Auth: Confirm Sign Up (verification code) ─────────────────────────────
  const confirmSignUp = async (email, code) => {
    const result = await cognitoConfirmSignUp({ username: email, confirmationCode: code })
    return { success: result.isSignUpComplete }
  }

  // ── Auth: Social Sign In (Google / GitHub) ─────────────────────────────────
  const socialSignIn = async (provider) => {
    if (!COGNITO_ENABLED) {
      const u = { email: `demo@${provider.toLowerCase()}.com`, name: `${provider} User`, avatar: provider[0].toUpperCase(), provider: provider.toLowerCase() }
      setUser(u)
      localStorage.setItem('roamly-user', JSON.stringify(u))
      setShowAuthModal(false)
      return
    }
    if (provider === 'Google') {
      await signInWithRedirect({ provider: 'Google' })
    } else if (provider === 'GitHub') {
      await signInWithRedirect({ provider: { custom: 'GitHub' } })
    }
  }

  // ── Auth: Sign Out ─────────────────────────────────────────────────────────
  const signOut = async () => {
    if (COGNITO_ENABLED) {
      try { await cognitoSignOut() } catch {}
    }
    setUser(null)
    setSavedItineraries([])
    localStorage.removeItem('roamly-user')
    localStorage.removeItem('roamly-itineraries')
  }

  // ── Itinerary: Save ────────────────────────────────────────────────────────
  const saveItinerary = async (itinerary, tripForm) => {
    const entry = {
      destination: tripForm.destination,
      dates: `${tripForm.start_date} → ${tripForm.end_date}`,
      travelers: tripForm.travelers,
      budget: tripForm.budget,
      title: itinerary.trip_summary?.title || tripForm.destination,
      itinerary,
      tripForm,
    }

    if (COGNITO_ENABLED && user) {
      const res = await travelAPI.saveItinerary(entry)
      const saved = res.data
      setSavedItineraries(prev => [saved, ...prev].slice(0, 50))
      return saved.id
    }

    // localStorage fallback
    const local = { id: Date.now().toString(), savedAt: new Date().toISOString(), ...entry }
    const updated = [local, ...savedItineraries].slice(0, 20)
    setSavedItineraries(updated)
    localStorage.setItem('roamly-itineraries', JSON.stringify(updated))
    return local.id
  }

  // ── Itinerary: Delete ──────────────────────────────────────────────────────
  const deleteItinerary = async (id) => {
    if (COGNITO_ENABLED && user) {
      await travelAPI.deleteItinerary(id)
      setSavedItineraries(prev => prev.filter(i => i.id !== id))
      return
    }
    const updated = savedItineraries.filter(i => i.id !== id)
    setSavedItineraries(updated)
    localStorage.setItem('roamly-itineraries', JSON.stringify(updated))
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const openSignIn = () => { setAuthMode('signin'); setShowAuthModal(true) }
  const openSignUp = () => { setAuthMode('signup'); setShowAuthModal(true) }

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      user, userLoading, signIn, signUp, confirmSignUp, socialSignIn, signOut,
      savedItineraries, saveItinerary, deleteItinerary,
      showAuthModal, setShowAuthModal,
      authMode, setAuthMode,
      openSignIn, openSignUp,
      pendingConfirmEmail: pendingConfirmEmail.current,
      COGNITO_ENABLED,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
