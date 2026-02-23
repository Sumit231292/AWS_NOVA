import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('roamly-theme') || 'dark')
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('roamly-user')) } catch { return null }
  })
  const [savedItineraries, setSavedItineraries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('roamly-itineraries')) || [] } catch { return [] }
  })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin') // 'signin' | 'signup'

  useEffect(() => {
    localStorage.setItem('roamly-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const signIn = (email, name) => {
    const u = { email, name, avatar: name[0].toUpperCase(), joinedAt: new Date().toISOString() }
    setUser(u)
    localStorage.setItem('roamly-user', JSON.stringify(u))
    setShowAuthModal(false)
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('roamly-user')
  }

  const saveItinerary = (itinerary, tripForm) => {
    const entry = {
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      destination: tripForm.destination,
      dates: `${tripForm.start_date} → ${tripForm.end_date}`,
      travelers: tripForm.travelers,
      budget: tripForm.budget,
      title: itinerary.trip_summary?.title || tripForm.destination,
      itinerary,
      tripForm,
    }
    const updated = [entry, ...savedItineraries].slice(0, 20) // keep last 20
    setSavedItineraries(updated)
    localStorage.setItem('roamly-itineraries', JSON.stringify(updated))
    return entry.id
  }

  const deleteItinerary = (id) => {
    const updated = savedItineraries.filter(i => i.id !== id)
    setSavedItineraries(updated)
    localStorage.setItem('roamly-itineraries', JSON.stringify(updated))
  }

  const openSignIn = () => { setAuthMode('signin'); setShowAuthModal(true) }
  const openSignUp = () => { setAuthMode('signup'); setShowAuthModal(true) }

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      user, signIn, signOut,
      savedItineraries, saveItinerary, deleteItinerary,
      showAuthModal, setShowAuthModal,
      authMode, setAuthMode,
      openSignIn, openSignUp,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
