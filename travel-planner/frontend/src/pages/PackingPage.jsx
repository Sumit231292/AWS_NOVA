import { useState } from 'react'
import { Package, CheckCircle, Circle, Loader2 } from 'lucide-react'
import { travelAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function PackingPage() {
  const [form, setForm] = useState({ destination: '', start_date: '', end_date: '', activities: [] })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState({})
  const [activityInput, setActivityInput] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addActivity = (e) => {
    if (e.key === 'Enter' && activityInput.trim()) {
      set('activities', [...form.activities, activityInput.trim()])
      setActivityInput('')
    }
  }

  const removeActivity = (i) => set('activities', form.activities.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.destination || !form.start_date || !form.end_date) {
      toast.error('Please fill in destination and dates')
      return
    }
    setLoading(true)
    try {
      const res = await travelAPI.getPackingList(form)
      setResult(res.data)
      setChecked({})
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleCheck = (catName, idx) => {
    const key = `${catName}-${idx}`
    setChecked(c => ({ ...c, [key]: !c[key] }))
  }

  const totalItems = result?.categories?.reduce((acc, c) => acc + c.items.length, 0) || 0
  const checkedCount = Object.values(checked).filter(Boolean).length

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          <Package size={32} style={{ display: 'inline', marginRight: '0.75rem', color: 'var(--accent)' }} />
          Packing List
        </h1>
        <p style={{ color: 'var(--text2)' }}>
          Amazon Nova generates a smart, destination-aware packing list for your trip.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
        <div className="grid-2" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Destination *</label>
            <input className="form-input" placeholder="e.g. Bali, Indonesia" value={form.destination}
              onChange={e => set('destination', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Activities (press Enter to add)</label>
            <input className="form-input" placeholder="e.g. hiking, snorkeling" value={activityInput}
              onChange={e => setActivityInput(e.target.value)} onKeyDown={addActivity} />
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Start Date *</label>
            <input type="date" className="form-input" style={{ colorScheme: 'dark' }}
              value={form.start_date} onChange={e => set('start_date', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">End Date *</label>
            <input type="date" className="form-input" style={{ colorScheme: 'dark' }}
              value={form.end_date} onChange={e => set('end_date', e.target.value)} required />
          </div>
        </div>

        {form.activities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {form.activities.map((a, i) => (
              <span key={i} className="tag tag-accent" style={{ cursor: 'pointer' }} onClick={() => removeActivity(i)}>
                {a} ×
              </span>
            ))}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <><div className="spinner" /> Generating...</> : <><Package size={18} /> Generate Packing List</>}
        </button>
      </form>

      {result && (
        <div style={{ animation: 'fadeUp 0.5s ease' }}>
          {/* Weather Advisory */}
          {result.weather_advisory && (
            <div style={{
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              background: 'var(--accent-glow)',
              border: '1px solid var(--border2)',
              marginBottom: '1.5rem',
            }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '0.25rem' }}>🌤️ Weather Advisory</p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text2)' }}>{result.weather_advisory}</p>
            </div>
          )}

          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Your Packing List</h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>
              {checkedCount}/{totalItems} packed
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: '6px', borderRadius: '3px', background: 'var(--bg3)', marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--green))',
              borderRadius: '3px',
              transition: 'width 0.3s',
            }} />
          </div>

          <div className="grid-2">
            {result.categories?.map(cat => (
              <div key={cat.name} className="card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text)' }}>
                  <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                  {cat.name}
                </h3>
                {cat.items.map((item, idx) => {
                  const key = `${cat.name}-${idx}`
                  const done = checked[key]
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(cat.name, idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.6rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '0.25rem',
                        opacity: done ? 0.5 : 1,
                        transition: 'opacity 0.2s',
                        background: done ? 'var(--green2)' : 'transparent',
                      }}
                    >
                      {done
                        ? <CheckCircle size={18} color="var(--green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        : <Circle size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      }
                      <div>
                        <span style={{ fontSize: '0.9rem', textDecoration: done ? 'line-through' : 'none' }}>
                          {item.item}
                          {item.quantity && item.quantity !== '1' && (
                            <span style={{ color: 'var(--teal)', marginLeft: '0.5rem', fontSize: '0.8rem', fontFamily: "'JetBrains Mono',monospace" }}>× {item.quantity}</span>
                          )}
                          {item.essential && (
                            <span style={{ color: 'var(--coral)', marginLeft: '0.4rem', fontSize: '0.7rem' }}>★</span>
                          )}
                        </span>
                        {item.notes && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: '0.1rem' }}>{item.notes}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Tips */}
          {result.tips?.length > 0 && (
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>💡 Packing Tips</h3>
              {result.tips.map((tip, i) => (
                <p key={i} style={{ fontSize: '0.9rem', color: 'var(--text2)', marginBottom: '0.5rem' }}>
                  • {tip}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
