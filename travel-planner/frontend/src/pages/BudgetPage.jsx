import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { travelAPI } from '../services/api'
import toast from 'react-hot-toast'

const budgetLevels = ['budget', 'moderate', 'luxury']

export default function BudgetPage() {
  const [form, setForm] = useState({ destination: '', duration_days: 7, travelers: 2, budget_level: 'moderate' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.destination) { toast.error('Enter a destination'); return }
    setLoading(true)
    try {
      const res = await travelAPI.getBudget(form)
      setResult(res.data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['accommodation', 'food', 'transportation', 'activities', 'miscellaneous']

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          <DollarSign size={32} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--green)' }} />
          Budget Estimator
        </h1>
        <p style={{ color: 'var(--text2)' }}>Get AI-powered cost estimates for your trip to any destination.</p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
        <div className="grid-2" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Destination *</label>
            <input className="form-input" placeholder="e.g. Barcelona, Spain"
              value={form.destination} onChange={e => set('destination', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Duration (days)</label>
            <input type="number" className="form-input" min={1} max={90}
              value={form.duration_days} onChange={e => set('duration_days', parseInt(e.target.value))} />
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Number of Travelers</label>
            <input type="number" className="form-input" min={1} max={20}
              value={form.travelers} onChange={e => set('travelers', parseInt(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Budget Level</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {budgetLevels.map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set('budget_level', l)}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: `1px solid ${form.budget_level === l ? 'var(--accent)' : 'var(--border)'}`,
                    background: form.budget_level === l ? 'var(--accent-glow)' : 'transparent',
                    color: form.budget_level === l ? 'var(--accent)' : 'var(--text2)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontWeight: form.budget_level === l ? 600 : 400,
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <><div className="spinner" /> Calculating...</> : <><DollarSign size={18} /> Estimate Budget</>}
        </button>
      </form>

      {result && (
        <div style={{ animation: 'fadeUp 0.5s ease' }}>
          {result.summary && (
            <div style={{ padding: '1rem 1.5rem', borderRadius: '12px', background: 'var(--green2)', border: '1px solid rgba(52,211,153,0.25)', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--text2)' }}>{result.summary}</p>
            </div>
          )}

          {/* Totals */}
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            {result.total_per_person && Object.entries(result.total_per_person).map(([range, amount]) => (
              <div key={range} className="card" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'capitalize', marginBottom: '0.5rem', fontFamily: "'JetBrains Mono',monospace" }}>
                  {range} / person
                </p>
                <p style={{ fontSize: '2rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--text)' }}>
                  ${typeof amount === 'number' ? amount.toLocaleString() : amount}
                </p>
              </div>
            ))}
          </div>

          {/* Daily Breakdown */}
          {result.daily_breakdown && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Daily Breakdown</h2>
              {categories.map(cat => {
                const data = result.daily_breakdown[cat]
                if (!data) return null
                const maxVal = Math.max(data.low || 0, data.average || 0, data.high || 0)
                return (
                  <div key={cat} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{cat}</span>
                      <span style={{ color: 'var(--green)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>${data.average}/day</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg3)', marginBottom: '0.5rem', overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: `${maxVal > 0 ? (data.low / maxVal) * 100 : 0}%`,
                        width: `${maxVal > 0 ? ((data.high - data.low) / maxVal) * 100 : 50}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--accent), var(--teal))',
                        borderRadius: '4px',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text2)' }}>
                      <span>Low: ${data.low}</span>
                      <span>High: ${data.high}</span>
                    </div>
                    {data.notes && <p style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: '0.25rem' }}>{data.notes}</p>}
                  </div>
                )
              })}
            </div>
          )}

          <div className="grid-2">
            {result.money_saving_tips?.length > 0 && (
              <div className="card">
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingDown size={18} color="var(--green)" /> Money-Saving Tips
                </h3>
                {result.money_saving_tips.map((tip, i) => (
                  <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '0.5rem' }}>💡 {tip}</p>
                ))}
              </div>
            )}
            {result.splurge_recommendations?.length > 0 && (
              <div className="card">
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="var(--teal)" /> Worth Splurging On
                </h3>
                {result.splurge_recommendations.map((item, i) => (
                  <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '0.5rem' }}>✨ {item}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
