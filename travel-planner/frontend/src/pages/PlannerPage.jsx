import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plane, Calendar, Users, DollarSign, Heart, ChevronRight, Loader2 } from 'lucide-react'
import { travelAPI } from '../services/api'
import toast from 'react-hot-toast'

const interests = [
  { id: 'food', label: '🍜 Food & Cuisine' },
  { id: 'history', label: '🏛️ History & Culture' },
  { id: 'adventure', label: '🧗 Adventure Sports' },
  { id: 'nature', label: '🌿 Nature & Hiking' },
  { id: 'art', label: '🎨 Art & Museums' },
  { id: 'nightlife', label: '🎉 Nightlife' },
  { id: 'shopping', label: '🛍️ Shopping' },
  { id: 'wellness', label: '🧘 Wellness & Spa' },
  { id: 'photography', label: '📸 Photography' },
  { id: 'beaches', label: '🏖️ Beaches' },
]

const budgetOptions = [
  { value: 'budget', label: 'Budget', desc: 'Hostels, street food, free activities', icon: '💰' },
  { value: 'moderate', label: 'Moderate', desc: '3-star hotels, local restaurants', icon: '💳' },
  { value: 'luxury', label: 'Luxury', desc: '5-star hotels, fine dining, exclusive tours', icon: '💎' },
]

export default function PlannerPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    destination: searchParams.get('destination') || '',
    origin: '',
    start_date: '',
    end_date: '',
    budget: 'moderate',
    travelers: 2,
    interests: [],
    special_requirements: '',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleInterest = (id) => {
    set('interests', form.interests.includes(id)
      ? form.interests.filter(i => i !== id)
      : [...form.interests, id]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.destination || !form.origin || !form.start_date || !form.end_date) {
      toast.error('Please fill in all required fields')
      return
    }
    if (new Date(form.end_date) <= new Date(form.start_date)) {
      toast.error('End date must be after start date')
      return
    }

    setLoading(true)
    try {
      const result = await travelAPI.generateItinerary(form)
      if (result.success) {
        // Store in session storage and navigate
        sessionStorage.setItem('itinerary', JSON.stringify(result.data))
        sessionStorage.setItem('tripForm', JSON.stringify(form))
        navigate('/itinerary')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate itinerary. Check backend connection.')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Plan Your Trip</h1>
        <p style={{ color: 'var(--text2)' }}>
          Tell us about your dream trip and Amazon Nova will craft the perfect itinerary.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plane size={20} color="#c9a96e" /> Destination & Origin
          </h2>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Where are you going? *</label>
              <input
                className="form-input"
                placeholder="e.g. Tokyo, Japan"
                value={form.destination}
                onChange={e => set('destination', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Where are you flying from? *</label>
              <input
                className="form-input"
                placeholder="e.g. New York, USA"
                value={form.origin}
                onChange={e => set('origin', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Dates & Travelers */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="#c9a96e" /> Dates & Travelers
          </h2>
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                className="form-input"
                min={today}
                value={form.start_date}
                onChange={e => set('start_date', e.target.value)}
                required
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                className="form-input"
                min={form.start_date || today}
                value={form.end_date}
                onChange={e => set('end_date', e.target.value)}
                required
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Travelers</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => set('travelers', Math.max(1, form.travelers - 1))}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: 'var(--deep)', border: '1px solid var(--border)',
                    color: '#c9a96e', fontSize: '1.2rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >-</button>
                <span style={{ fontSize: '1.3rem', fontWeight: 600, minWidth: '30px', textAlign: 'center' }}>
                  {form.travelers}
                </span>
                <button
                  type="button"
                  onClick={() => set('travelers', Math.min(20, form.travelers + 1))}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: 'var(--deep)', border: '1px solid var(--border)',
                    color: '#c9a96e', fontSize: '1.2rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} color="#c9a96e" /> Budget Level
          </h2>
          <div className="grid-3">
            {budgetOptions.map(({ value, label, desc, icon }) => (
              <div
                key={value}
                onClick={() => set('budget', value)}
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: `2px solid ${form.budget === value ? '#c9a96e' : 'rgba(201,169,110,0.2)'}`,
                  background: form.budget === value ? 'rgba(201,169,110,0.08)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ fontWeight: 600, color: form.budget === value ? '#c9a96e' : '#f5ede0' }}>
                  {label}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: '0.25rem' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={20} color="#c9a96e" /> Interests (select all that apply)
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {interests.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleInterest(id)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '50px',
                  border: `1px solid ${form.interests.includes(id) ? '#c9a96e' : 'rgba(201,169,110,0.25)'}`,
                  background: form.interests.includes(id) ? 'rgba(201,169,110,0.12)' : 'transparent',
                  color: form.interests.includes(id) ? '#c9a96e' : '#d4c5ae',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Special Requirements */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label className="form-label">Special Requirements or Notes</label>
            <textarea
              className="form-input"
              placeholder="e.g. vegetarian food, wheelchair accessible, travelling with kids, anniversary trip..."
              value={form.special_requirements}
              onChange={e => set('special_requirements', e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ fontSize: '1.1rem', padding: '1rem 3rem', minWidth: '250px' }}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Amazon Nova is planning...
              </>
            ) : (
              <>
                Generate My Itinerary
                <ChevronRight size={20} />
              </>
            )}
          </button>
          {loading && (
            <p style={{ color: 'var(--text2)', marginTop: '1rem', fontSize: '0.9rem' }}>
              🤖 Amazon Nova is crafting your perfect trip — this takes about 15-30 seconds...
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
