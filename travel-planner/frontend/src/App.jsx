import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import PlannerPage from './pages/PlannerPage'
import ItineraryPage from './pages/ItineraryPage'
import PackingPage from './pages/PackingPage'
import BudgetPage from './pages/BudgetPage'
import ChatPage from './pages/ChatPage'
import SavedPage from './pages/SavedPage'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

export default function App() {
  const { showAuthModal } = useApp()
  const location = useLocation()
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      {showAuthModal && <AuthModal />}
      <main style={{ flex:1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/plan" element={<PageWrapper><PlannerPage /></PageWrapper>} />
            <Route path="/itinerary" element={<PageWrapper><ItineraryPage /></PageWrapper>} />
            <Route path="/packing" element={<PageWrapper><PackingPage /></PageWrapper>} />
            <Route path="/budget" element={<PageWrapper><BudgetPage /></PageWrapper>} />
            <Route path="/chat" element={<PageWrapper><ChatPage /></PageWrapper>} />
            <Route path="/saved" element={<PageWrapper><SavedPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
