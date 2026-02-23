import { useState } from 'react'
import { X, Mail, User, Lock, Compass, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../context/AppContext'

/**
 * AUTH SETUP GUIDE
 * ─────────────────────────────────────────────────────────────────
 * This modal supports three auth modes:
 *
 * MODE 1 — LOCAL (default, works right now, no setup needed)
 *   Credentials stored in localStorage. Fine for demo/hackathon.
 *
 * MODE 2 — AWS COGNITO (recommended for production)
 *   1. Create a Cognito User Pool in AWS Console
 *   2. Enable Google / GitHub (via Cognito Hosted UI + OAuth)
 *   3. npm install aws-amplify
 *   4. Uncomment the Amplify block in AppContext.jsx
 *   5. Set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID in .env
 *
 * MODE 3 — SUPABASE (easiest social auth)
 *   1. Create project at supabase.com
 *   2. npm install @supabase/supabase-js
 *   3. Enable Google/GitHub in Supabase Auth settings
 *   4. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
 *   Then replace signIn() calls with supabase.auth.signInWithOAuth({ provider })
 * ─────────────────────────────────────────────────────────────────
 */

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const GITHUB_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

export default function AuthModal() {
  const { setShowAuthModal, authMode, setAuthMode, signIn } = useApp()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState('')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    if (authMode === 'signup' && !form.name) { setError('Name is required'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    /* ── COGNITO INTEGRATION POINT ─────────────────────────────────────
    import { signIn as amplifySignIn, signUp as amplifySignUp } from 'aws-amplify/auth'
    if (authMode === 'signup') {
      await amplifySignUp({ username: form.email, password: form.password,
        options: { userAttributes: { email: form.email, name: form.name } } })
    } else {
      await amplifySignIn({ username: form.email, password: form.password })
    }
    const user = await getCurrentUser()
    signIn(form.email, form.name || user.username)
    ─────────────────────────────────────────────────────────────────── */

    signIn(form.email, authMode === 'signup' ? form.name : form.email.split('@')[0])
    setLoading(false)
  }

  const handleSocial = async (provider) => {
    setSocialLoading(provider)

    /* ── COGNITO / SUPABASE SOCIAL LOGIN ───────────────────────────────
    
    OPTION A — AWS Cognito Hosted UI:
      import { signInWithRedirect } from 'aws-amplify/auth'
      await signInWithRedirect({ provider: provider === 'google' ? 'Google' : 'GitHub' })
      // Cognito redirects back; handle in App.jsx with Hub.listen('auth', ...)

    OPTION B — Supabase:
      import { createClient } from '@supabase/supabase-js'
      const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
      await supabase.auth.signInWithOAuth({ provider,
        options: { redirectTo: window.location.origin } })
    ─────────────────────────────────────────────────────────────────── */

    // Demo simulation (remove this block once real auth is wired up)
    await new Promise(r => setTimeout(r, 1000))
    signIn(`demo@${provider}.com`, `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`)
    setSocialLoading('')
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAuthModal(false)}>
      <div className="modal-box">
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.55rem' }}>
            <div style={{ width:'34px', height:'34px', borderRadius:'9px', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Compass size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.05rem', color:'var(--text)' }}>Roamly</div>
              <div style={{ fontSize:'0.7rem', color:'var(--text2)' }}>
                {authMode === 'signin' ? 'Welcome back, explorer' : 'Start your journey'}
              </div>
            </div>
          </div>
          <button className="btn-icon" onClick={() => setShowAuthModal(false)} style={{ width:'32px', height:'32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'0.2rem', padding:'0.28rem', background:'var(--bg2)', borderRadius:'10px', marginBottom:'1.4rem' }}>
          {['signin','signup'].map(m => (
            <button key={m} onClick={() => { setAuthMode(m); setError('') }} style={{
              flex:1, padding:'0.45rem', borderRadius:'8px', fontSize:'0.86rem', fontWeight:600,
              background: authMode===m ? 'var(--accent)' : 'transparent',
              color: authMode===m ? '#fff' : 'var(--text2)',
              transition:'all 0.2s',
            }}>
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Social Buttons */}
        <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1.1rem' }}>
          <button className="social-btn" onClick={() => handleSocial('google')} disabled={!!socialLoading}>
            {socialLoading==='google' ? <div className="spinner" style={{width:'16px',height:'16px'}}/> : GOOGLE_ICON}
            <span style={{ color:'var(--text)' }}>Google</span>
          </button>
          <button className="social-btn" onClick={() => handleSocial('github')} disabled={!!socialLoading}>
            {socialLoading==='github' ? <div className="spinner" style={{width:'16px',height:'16px'}}/> : GITHUB_ICON}
            <span style={{ color:'var(--text)' }}>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.1rem' }}>
          <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
          <span style={{ fontSize:'0.75rem', color:'var(--text3)', fontWeight:500 }}>or continue with email</span>
          <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
          {authMode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position:'relative' }}>
                <User size={15} style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }} />
                <input className="form-input" placeholder="Your full name" value={form.name}
                  onChange={e => set('name', e.target.value)} style={{ paddingLeft:'2.4rem' }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position:'relative' }}>
              <Mail size={15} style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }} />
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => set('email', e.target.value)} style={{ paddingLeft:'2.4rem' }} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position:'relative' }}>
              <Lock size={15} style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }} />
              <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={form.password} onChange={e => set('password', e.target.value)}
                style={{ paddingLeft:'2.4rem', paddingRight:'2.8rem' }} required />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position:'absolute', right:'0.85rem', top:'50%', transform:'translateY(-50%)', background:'none', color:'var(--text3)', padding:0 }}>
                {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding:'0.6rem 0.9rem', borderRadius:'8px', background:'var(--coral2)', border:'1px solid rgba(225,29,72,0.2)', fontSize:'0.83rem', color:'var(--coral)' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
            {loading
              ? <><div className="spinner"/>{authMode==='signin' ? 'Signing in...' : 'Creating account...'}</>
              : <>{authMode==='signin' ? 'Sign In' : 'Create Account'}<ArrowRight size={15}/></>}
          </button>
        </form>

        <p style={{ textAlign:'center', fontSize:'0.76rem', color:'var(--text3)', marginTop:'1.1rem' }}>
          {authMode==='signin' ? "No account? " : "Already have one? "}
          <button onClick={() => { setAuthMode(authMode==='signin'?'signup':'signin'); setError('') }}
            style={{ background:'none', color:'var(--accent)', fontWeight:600, fontSize:'0.76rem' }}>
            {authMode==='signin' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>

        {/* Cognito notice */}
        <div style={{ marginTop:'1rem', padding:'0.65rem 0.85rem', borderRadius:'8px', background:'var(--amber2)', border:'1px solid rgba(251,191,36,0.2)', fontSize:'0.74rem', color:'var(--amber)', lineHeight:1.5 }}>
          <strong>💡 For production:</strong> Wire Google/GitHub to AWS Cognito or Supabase. See comments in <code>AuthModal.jsx</code>.
        </div>
      </div>
    </div>
  )
}
