import { useNavigate } from 'react-router-dom'
import { BookMarked, MapPin, Calendar, Users, Trash2, Eye, LogIn, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function SavedPage() {
  const navigate = useNavigate()
  const { user, openSignIn, savedItineraries, deleteItinerary } = useApp()

  const loadItinerary = (entry) => {
    sessionStorage.setItem('itinerary', JSON.stringify(entry.itinerary))
    sessionStorage.setItem('tripForm', JSON.stringify(entry.tripForm))
    navigate('/itinerary')
  }

  const handleDelete = async (id, title) => {
    try {
      await deleteItinerary(id)
      toast.success(`"${title}" removed from saved trips`)
    } catch {
      toast.error('Failed to delete — please try again')
    }
  }

  if (!user) {
    return (
      <div className="page" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', textAlign:'center' }}>
        <div style={{ width:'72px', height:'72px', borderRadius:'20px', background:'var(--accent-glow)', border:'1px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem' }}>
          <BookMarked size={32} color="var(--accent)" />
        </div>
        <h2 style={{ fontSize:'1.8rem', marginBottom:'0.5rem' }}>Sign in to view your archive</h2>
        <p style={{ color:'var(--text2)', marginBottom:'2rem', maxWidth:'360px' }}>
          Create a free account to save, revisit, and share your AI-generated travel missions.
        </p>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button className="btn btn-primary" onClick={openSignIn}>
            <LogIn size={17}/> Sign In
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/plan')}>
            <Plus size={17}/> Plan a Trip First
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.35rem' }}>
            <BookMarked size={24} color="var(--accent)" />
            <h1>Mission Archive</h1>
          </div>
          <p>
            {savedItineraries.length === 0
              ? 'No saved itineraries yet — plan your first trip!'
              : `${savedItineraries.length} itiner${savedItineraries.length === 1 ? 'y' : 'aries'} saved`}
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/plan')}>
          <Plus size={16}/> New Trip
        </button>
      </div>

      {savedItineraries.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'4rem 2rem' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🗺️</div>
          <h3 style={{ marginBottom:'0.5rem' }}>No trips saved yet</h3>
          <p style={{ color:'var(--text2)', marginBottom:'1.5rem' }}>Generate an itinerary and click "Save Trip" to keep it here.</p>
          <button className="btn btn-primary" onClick={() => navigate('/plan')}>
            Start Planning
          </button>
        </div>
      ) : (
        <div className="grid-2" style={{ gap:'1rem' }}>
          {savedItineraries.map((entry) => (
            <div key={entry.id} className="card" style={{ transition:'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow-sm)' }}
            >
              {/* Card header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
                <div style={{ flex:1, marginRight:'0.75rem' }}>
                  <h3 style={{ fontSize:'1rem', marginBottom:'0.25rem', lineHeight:1.3 }}>{entry.title}</h3>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.35rem', color:'var(--text2)', fontSize:'0.82rem' }}>
                    <MapPin size={13}/> {entry.destination}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id, entry.title)}
                  className="btn-icon"
                  style={{ width:'32px', height:'32px', borderRadius:'8px', flexShrink:0 }}
                  title="Remove"
                >
                  <Trash2 size={14} color="var(--coral)" />
                </button>
              </div>

              {/* Metadata */}
              <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap', marginBottom:'1rem' }}>
                <span className="tag tag-accent" style={{ fontSize:'0.72rem' }}>
                  <Calendar size={11}/> {entry.dates}
                </span>
                <span className="tag tag-teal" style={{ fontSize:'0.72rem' }}>
                  <Users size={11}/> {entry.travelers} traveler{entry.travelers > 1 ? 's' : ''}
                </span>
                <span className="tag tag-amber" style={{ fontSize:'0.72rem', textTransform:'capitalize' }}>
                  {entry.budget}
                </span>
              </div>

              {/* Highlights preview */}
              {entry.itinerary?.trip_summary?.highlights && (
                <div style={{ marginBottom:'1rem' }}>
                  <p style={{ fontSize:'0.72rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.4rem' }}>Highlights</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem' }}>
                    {entry.itinerary.trip_summary.highlights.slice(0, 3).map((h, i) => (
                      <span key={i} style={{ fontSize:'0.78rem', color:'var(--text2)', background:'var(--bg2)', padding:'0.2rem 0.6rem', borderRadius:'50px', border:'1px solid var(--border)' }}>
                        ✦ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'0.75rem', borderTop:'1px solid var(--border)' }}>
                <span style={{ fontSize:'0.72rem', color:'var(--text3)' }}>
                  Saved {new Date(entry.savedAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => loadItinerary(entry)}>
                  <Eye size={14}/> View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
