import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Compass, Map, Package, DollarSign, MessageCircle, Menu, X, Sun, Moon, BookMarked, LogOut, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'

const navLinks = [
  { to: '/plan', label: 'Plan Trip', icon: Map },
  { to: '/packing', label: 'Packing', icon: Package },
  { to: '/budget', label: 'Budget', icon: DollarSign },
  { to: '/chat', label: 'AI Chat', icon: MessageCircle },
  { to: '/saved', label: 'Saved', icon: BookMarked },
]

export default function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme, user, openSignIn, openSignUp, signOut, savedItineraries } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const isDark = theme === 'dark'

  return (
    <nav style={{ background:'var(--navbar-bg)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:100, transition:'background 0.3s' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:'64px' }}>
        
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.55rem', textDecoration:'none' }}>
          <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px var(--accent-glow)' }}>
            <Compass size={18} color="#fff" />
          </div>
          <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.2rem', color:'var(--text)', letterSpacing:'-0.02em' }}>
            Roam<span style={{ color:'var(--accent)' }}>ly</span>
          </span>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:'0.1rem' }}>
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to} style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.42rem 0.8rem', borderRadius:'8px', fontSize:'0.86rem', fontWeight:active?600:400, color:active?'var(--accent)':'var(--text2)', background:active?'var(--accent-glow)':'transparent', transition:'all 0.2s', textDecoration:'none', position:'relative' }}>
                <Icon size={15} /> {label}
                {to==='/saved' && savedItineraries.length>0 && <span style={{ position:'absolute', top:'3px', right:'3px', width:'7px', height:'7px', borderRadius:'50%', background:'var(--teal)', boxShadow:'0 0 6px var(--teal)' }} />}
              </Link>
            )
          })}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <div style={{ padding:'0.28rem 0.65rem', borderRadius:'6px', background:'rgba(255,153,0,0.1)', border:'1px solid rgba(255,153,0,0.25)', fontSize:'0.68rem', color:'#ff9900', fontWeight:700 }}>⚡ AWS Nova</div>
          
          <button className="btn-icon" onClick={toggleTheme} title="Toggle theme">
            {isDark ? <Sun size={16} color="var(--amber)" /> : <Moon size={16} color="var(--accent)" />}
          </button>

          {user ? (
            <div style={{ position:'relative' }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display:'flex', alignItems:'center', gap:'0.45rem', padding:'0.35rem 0.75rem', borderRadius:'50px', background:'var(--card2)', border:'1px solid var(--border)', color:'var(--text)', fontSize:'0.86rem', fontWeight:500 }}>
                <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:700, color:'#fff' }}>{user.avatar}</div>
                {user.name.split(' ')[0]}
                <ChevronDown size={13} color="var(--text2)" />
              </button>
              {userMenuOpen && (
                <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', background:'var(--card)', border:'1px solid var(--border2)', borderRadius:'12px', padding:'0.4rem', minWidth:'185px', boxShadow:'var(--shadow)', zIndex:200, animation:'slideDown 0.2s ease' }}
                  onMouseLeave={() => setUserMenuOpen(false)}>
                  <div style={{ padding:'0.45rem 0.7rem', borderBottom:'1px solid var(--border)', marginBottom:'0.3rem' }}>
                    <div style={{ fontSize:'0.86rem', fontWeight:600 }}>{user.name}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text2)' }}>{user.email}</div>
                  </div>
                  <Link to="/saved" onClick={() => setUserMenuOpen(false)} style={{ display:'flex', alignItems:'center', gap:'0.55rem', padding:'0.5rem 0.7rem', borderRadius:'8px', color:'var(--text2)', fontSize:'0.86rem', textDecoration:'none' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='var(--card2)';e.currentTarget.style.color='var(--text)'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--text2)'}}>
                    <BookMarked size={15}/> Saved Trips
                    {savedItineraries.length>0 && <span style={{ marginLeft:'auto', background:'var(--accent-glow)', color:'var(--accent)', fontSize:'0.68rem', fontWeight:700, padding:'0.1rem 0.4rem', borderRadius:'50px' }}>{savedItineraries.length}</span>}
                  </Link>
                  <button onClick={() => {signOut(); setUserMenuOpen(false)}} style={{ display:'flex', alignItems:'center', gap:'0.55rem', width:'100%', padding:'0.5rem 0.7rem', borderRadius:'8px', color:'var(--coral)', background:'none', fontSize:'0.86rem' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--coral2)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <LogOut size={15}/> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display:'flex', gap:'0.4rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={openSignIn}>Sign In</button>
              <button className="btn btn-primary btn-sm" onClick={openSignUp}>Sign Up</button>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="btn-icon" style={{ display:'none' }} id="mob-btn">
            {mobileOpen ? <X size={17}/> : <Menu size={17}/>}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ borderTop:'1px solid var(--border)', padding:'0.75rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.3rem' }}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)} style={{ display:'flex', alignItems:'center', gap:'0.65rem', padding:'0.65rem 1rem', borderRadius:'10px', textDecoration:'none', color:location.pathname===to?'var(--accent)':'var(--text2)', background:location.pathname===to?'var(--accent-glow)':'transparent' }}>
              <Icon size={16}/> {label}
            </Link>
          ))}
        </div>
      )}
      <style>{`@media(max-width:900px){#mob-btn{display:flex!important;}}`}</style>
    </nav>
  )
}
