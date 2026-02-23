import { Routes, Route } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import PlannerPage from './pages/PlannerPage'
import ItineraryPage from './pages/ItineraryPage'
import PackingPage from './pages/PackingPage'
import BudgetPage from './pages/BudgetPage'
import ChatPage from './pages/ChatPage'
import SavedPage from './pages/SavedPage'

export default function App() {
  const { showAuthModal } = useApp()
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      {showAuthModal && <AuthModal />}
      <main style={{ flex:1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plan" element={<PlannerPage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/packing" element={<PackingPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/saved" element={<SavedPage />} />
        </Routes>
      </main>
    </div>
  )
}
