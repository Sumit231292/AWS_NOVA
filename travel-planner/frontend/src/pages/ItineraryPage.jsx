import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Utensils, Bed, Car, ChevronDown, ChevronUp, RefreshCw, Lightbulb, Bookmark, BookmarkCheck, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import { useApp } from '../context/AppContext'
import DestinationPhotos from '../components/DestinationPhotos'

const categoryColors = {
  sightseeing: '#c9a96e',
  food: '#e05a5a',
  adventure: '#4caf7a',
  culture: '#4a90d9',
  shopping: '#9b59b6',
  relaxation: '#e8c98a',
}

function ActivityCard({ activity }) {
  const color = categoryColors[activity.category] || '#c9a96e'
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      borderRadius: '10px',
      background: 'var(--activity-bg)',
      border: '1px solid var(--activity-border)',
      marginBottom: '0.75rem',
    }}>
      <div style={{
        width: '52px',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: '0.75rem', color: color, fontWeight: 600, marginBottom: '0.25rem' }}>
          {activity.time}
        </div>
        <div style={{
          width: '2px',
          height: '100%',
          background: `${color}40`,
          margin: '0 auto',
          minHeight: '20px',
        }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--text)' }}>{activity.name}</h4>
          <span style={{
            padding: '0.15rem 0.6rem',
            borderRadius: '50px',
            fontSize: '0.7rem',
            background: `${color}20`,
            color,
            border: `1px solid ${color}40`,
          }}>{activity.category}</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
          {activity.description}
        </p>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#c9a96e', flexWrap: 'wrap' }}>
          <span><Clock size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{activity.duration}</span>
          <span><DollarSign size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{activity.cost_estimate}</span>
          {activity.tips && (
            <span style={{ color: 'var(--text2)' }}>
              <Lightbulb size={12} style={{ display: 'inline', marginRight: '0.25rem', color: '#e8c98a' }} />
              {activity.tips}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function DayCard({ day }) {
  const [open, setOpen] = useState(day.day === 1)

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          background: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(201,169,110,0.3), rgba(232,201,138,0.1))',
            border: '1px solid rgba(201,169,110,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '0.6rem', color: '#c9a96e', textTransform: 'uppercase' }}>Day</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e8c98a', lineHeight: 1 }}>{day.day}</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text)' }}>{day.title}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{day.date} · {day.theme}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#c9a96e' }}>{day.daily_budget_estimate}</span>
          {open ? <ChevronUp size={20} color="#c9a96e" /> : <ChevronDown size={20} color="#c9a96e" />}
        </div>
      </button>

      {open && (
        <div style={{ marginTop: '1.5rem' }}>
          <hr className="gold-divider" />

          {/* Activities */}
          <h4 style={{ color: '#c9a96e', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            Activities
          </h4>
          {day.activities?.map((act, i) => <ActivityCard key={i} activity={act} />)}

          {/* Meals */}
          {day.meals && (
            <>
              <h4 style={{ color: '#c9a96e', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', marginTop: '1.5rem' }}>
                <Utensils size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />Meals
              </h4>
              <div className="grid-3" style={{ gap: '0.75rem' }}>
                {Object.entries(day.meals).map(([meal, info]) => (
                  <div key={meal} style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: 'var(--activity-bg)',
                    border: '1px solid var(--activity-border)',
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#c9a96e', textTransform: 'capitalize', marginBottom: '0.25rem' }}>{meal}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{info?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{info?.price_range}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Logistics */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {day.accommodation && (
              <div style={{ flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', background: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#4a90d9', marginBottom: '0.25rem' }}>
                  <Bed size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />Accommodation
                </div>
                <div style={{ fontSize: '0.9rem' }}>{day.accommodation.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{day.accommodation.price_range}</div>
              </div>
            )}
            {day.transportation && (
              <div style={{ flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', background: 'rgba(76,175,122,0.08)', border: '1px solid rgba(76,175,122,0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#4caf7a', marginBottom: '0.25rem' }}>
                  <Car size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />Getting Around
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.4 }}>{day.transportation}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ItineraryPage() {
  const navigate = useNavigate()
  const { user, saveItinerary, openSignIn } = useApp()
  const [itinerary, setItinerary] = useState(null)
  const [tripForm, setTripForm] = useState(null)
  const [activeTab, setActiveTab] = useState('itinerary')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!user) { openSignIn(); return }
    saveItinerary(itinerary, tripForm)
    setSaved(true)
    toast.success('Itinerary saved! View in Saved Trips.')
  }

  useEffect(() => {
    const stored = sessionStorage.getItem('itinerary')
    const form = sessionStorage.getItem('tripForm')
    if (stored) setItinerary(JSON.parse(stored))
    if (form) setTripForm(JSON.parse(form))
    else navigate('/plan')
  }, [])

  if (!itinerary) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text2)' }}>Loading your itinerary...</p>
      </div>
    )
  }

  const { trip_summary, daily_itinerary, practical_info, budget_breakdown } = itinerary

  const tabs = [
    { id: 'itinerary', label: '📅 Day-by-Day' },
    { id: 'practical', label: '📋 Practical Info' },
    { id: 'budget', label: '💰 Budget' },
  ]

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{trip_summary?.title}</h1>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className="tag tag-gold">
                <MapPin size={12} />{trip_summary?.destination}
              </span>
              <span className="tag tag-gold">📅 {trip_summary?.duration} days</span>
              {tripForm?.travelers && (
                <span className="tag tag-gold">👥 {tripForm.travelers} travelers</span>
              )}
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.6rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/plan')}>
              <RefreshCw size={15}/> New Trip
            </button>
            <button
              className="btn btn-sm"
              onClick={handleSave}
              style={{ background: saved ? 'var(--green2)' : 'var(--accent)', color: saved ? 'var(--green)' : '#fff', border: saved ? '1px solid var(--green)' : 'none' }}
            >
              {saved ? <><BookmarkCheck size={15}/> Saved!</> : <><Bookmark size={15}/> {user ? 'Save Trip' : 'Sign in to Save'}</>}
            </button>
          </div>
        </div>

        {/* Highlights */}
        {trip_summary?.highlights && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'rgba(201,169,110,0.06)',
            border: '1px solid rgba(201,169,110,0.2)',
          }}>
            <p style={{ fontSize: '0.8rem', color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              Trip Highlights
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {trip_summary.highlights.map((h, i) => (
                <span key={i} className="tag tag-gold">✨ {h}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Destination Photos */}
      <DestinationPhotos destination={tripForm?.destination || trip_summary?.destination} />

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.25rem',
        padding: '0.35rem',
        background: 'var(--card)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        marginBottom: '2rem',
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              background: activeTab === t.id ? 'rgba(201,169,110,0.15)' : 'transparent',
              color: activeTab === t.id ? '#c9a96e' : '#d4c5ae',
              fontWeight: activeTab === t.id ? 600 : 400,
              fontSize: '0.9rem',
              border: activeTab === t.id ? '1px solid rgba(201,169,110,0.3)' : '1px solid transparent',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'itinerary' && (
        <div>
          {daily_itinerary?.map(day => <DayCard key={day.day} day={day} />)}
        </div>
      )}

      {activeTab === 'practical' && practical_info && (
        <div className="grid-2">
          {Object.entries(practical_info).map(([key, val]) => (
            <div key={key} className="card">
              <h3 style={{ fontSize: '0.85rem', color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                {key.replace(/_/g, ' ')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.6 }}>{val}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'budget' && budget_breakdown && (
        <div>
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            {Object.entries(budget_breakdown)
              .filter(([k]) => !k.includes('total'))
              .map(([key, val]) => (
                <div key={key} className="card">
                  <h3 style={{ fontSize: '0.85rem', color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    {key.replace(/_/g, ' ')}
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>{val}</p>
                </div>
              ))}
          </div>
          {budget_breakdown.grand_total_per_person && (
            <div className="card" style={{
              textAlign: 'center',
              background: 'rgba(201,169,110,0.08)',
              border: '1px solid rgba(201,169,110,0.3)',
            }}>
              <p style={{ fontSize: '0.85rem', color: '#c9a96e', marginBottom: '0.5rem' }}>ESTIMATED TOTAL PER PERSON</p>
              <p style={{ fontSize: '3rem', fontFamily: 'Playfair Display, serif', color: '#e8c98a' }}>
                {budget_breakdown.grand_total_per_person}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
