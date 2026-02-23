import { useNavigate } from 'react-router-dom'
import { Compass, Map, Package, DollarSign, MessageCircle, Zap, ArrowRight, Star, Globe, BookMarked } from 'lucide-react'
import { useApp } from '../context/AppContext'

const features = [
  { icon: Map, title: 'AI Itineraries', desc: 'Day-by-day plans with activities, meals & accommodation tailored to you.', color: 'accent', tag: 'Most Popular' },
  { icon: Package, title: 'Smart Packing', desc: 'Weather-aware, activity-specific checklists you can check off as you go.', color: 'teal', tag: null },
  { icon: DollarSign, title: 'Budget Planner', desc: 'Detailed cost estimates with money-saving tips for any destination.', color: 'green', tag: null },
  { icon: MessageCircle, title: 'AI Concierge', desc: 'Chat in real-time with an AI that knows travel like a seasoned explorer.', color: 'purple', tag: 'New' },
]

const destinations = [
  { name: 'Tokyo', country: 'Japan', emoji: '🗼', tag: 'Culture', picsumId: 1537 },
  { name: 'Santorini', country: 'Greece', emoji: '🌊', tag: 'Romance', picsumId: 189 },
  { name: 'Bali', country: 'Indonesia', emoji: '🌴', tag: 'Wellness', picsumId: 133 },
  { name: 'New York', country: 'USA', emoji: '🏙️', tag: 'Urban', picsumId: 325185 },
  { name: 'Kyoto', country: 'Japan', emoji: '⛩️', tag: 'History', picsumId: 1010 },
  { name: 'Patagonia', country: 'Argentina', emoji: '🏔️', tag: 'Adventure', picsumId: 1624496 },
]

const tagColorMap = { accent: 'tag-accent', teal: 'tag-teal', green: 'tag-green', purple: 'tag-purple', amber: 'tag-amber' }

export default function HomePage() {
  const navigate = useNavigate()
  const { user, openSignUp } = useApp()

  return (
    <div>
      {/* Hero */}
      <div style={{ position:'relative', minHeight:'92vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', padding:'4rem 1.5rem' }}>
        {/* Background orbs */}
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'-10%', left:'60%', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', opacity:0.6 }} />
          <div style={{ position:'absolute', bottom:'5%', left:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, var(--teal2) 0%, transparent 70%)', opacity:0.8 }} />
          <div style={{ position:'absolute', top:'40%', right:'5%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, var(--purple2) 0%, transparent 70%)', opacity:0.5 }} />
        </div>

        {/* Grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize:'80px 80px', opacity:0.4 }} />

        <div style={{ position:'relative', textAlign:'center', maxWidth:'820px' }}>
          <div className="fade-up" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.38rem 1.1rem', borderRadius:'50px', background:'rgba(255,153,0,0.1)', border:'1px solid rgba(255,153,0,0.25)', color:'#ff9900', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.08em', marginBottom:'2rem' }}>
            <Zap size={13} /> AMAZON NOVA AI HACKATHON 2026
          </div>

          <h1 className="fade-up" style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(2.8rem,8vw,5.5rem)', fontWeight:800, lineHeight:1.05, marginBottom:'1.5rem', animationDelay:'0.08s' }}>
            Travel smarter<br/>
            with <span className="glow-text">AI that gets you</span>
          </h1>

          <p className="fade-up" style={{ fontSize:'1.1rem', color:'var(--text2)', maxWidth:'560px', margin:'0 auto 2.5rem', lineHeight:1.7, animationDelay:'0.15s' }}>
            Roamly uses Amazon Nova to create hyper-personalized itineraries, packing lists, and real-time travel advice — in seconds.
          </p>

          <div className="fade-up" style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap', animationDelay:'0.22s' }}>
            <button className="btn btn-primary" onClick={() => navigate('/plan')} style={{ fontSize:'0.95rem', padding:'0.8rem 2rem' }}>
              <Compass size={18} /> Start Planning Free
            </button>
            {!user && (
              <button className="btn btn-ghost" onClick={openSignUp} style={{ fontSize:'0.95rem', padding:'0.8rem 2rem' }}>
                <BookMarked size={18} /> Save Your Trips
              </button>
            )}
          </div>

          {/* Floating stats */}
          <div className="fade-up" style={{ display:'flex', justifyContent:'center', gap:'2.5rem', marginTop:'4rem', animationDelay:'0.3s', flexWrap:'wrap' }}>
            {[['Nova Lite', 'AI Model'], ['< 30s', 'To Plan'], ['4 Tools', 'All-in-One']].map(([val, label]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.5rem', fontWeight:800, color:'var(--accent)' }}>{val}</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.1em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding:'5rem 1.5rem', maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div className="tag tag-accent" style={{ marginBottom:'1rem' }}>Features</div>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', marginBottom:'0.75rem' }}>Everything in one place</h2>
          <p style={{ color:'var(--text2)', maxWidth:'500px', margin:'0 auto' }}>
            Amazon Nova powers every feature — from itinerary generation to real-time chat.
          </p>
        </div>

        <div className="grid-2" style={{ gap:'1rem' }}>
          {features.map(({ icon: Icon, title, desc, color, tag }) => (
            <div key={title} className="card" style={{ cursor:'pointer', transition:'all 0.28s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--shadow)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow-sm)' }}
            >
              <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start' }}>
                <div style={{ width:'46px', height:'46px', borderRadius:'12px', background:`var(--${color}2, var(--accent-glow))`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={20} color={`var(--${color})`} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.4rem' }}>
                    <h3 style={{ fontSize:'1rem' }}>{title}</h3>
                    {tag && <span className={`tag ${tagColorMap[color]}`} style={{ fontSize:'0.65rem' }}>{tag}</span>}
                  </div>
                  <p style={{ fontSize:'0.88rem', color:'var(--text2)', lineHeight:1.6 }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destinations */}
      <div style={{ padding:'3rem 1.5rem 6rem', maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <div className="tag tag-teal" style={{ marginBottom:'0.5rem' }}>Destinations</div>
            <h2 style={{ fontSize:'clamp(1.5rem,3vw,2rem)' }}>Where will you go?</h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/plan')}>
            Plan custom trip <ArrowRight size={14}/>
          </button>
        </div>

        <div className="grid-3">
          {destinations.map(({ name, country, emoji, tag, picsumId }) => (
            <div key={name} className="card"
              onClick={() => navigate(`/plan?destination=${name}, ${country}`)}
              style={{ cursor:'pointer', padding:0, overflow:'hidden', transition:'all 0.28s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.boxShadow='var(--shadow)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='var(--shadow-sm)' }}
            >
              {/* Photo */}
              <div style={{ position:'relative', aspectRatio:'16/9', overflow:'hidden', background:'var(--bg2)' }}>
                <img
                  src={`https://picsum.photos/id/${picsumId}/600/340`}
                  alt={name}
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.4s' }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                  onError={e => { e.currentTarget.style.display='none'; e.currentTarget.parentElement.innerHTML=`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:2.5rem;background:var(--bg3)">${emoji}</div>` }}
                />
                <div style={{ position:'absolute', top:'0.5rem', right:'0.5rem' }}>
                  <span className="tag tag-accent" style={{ fontSize:'0.68rem', background:'rgba(0,0,0,0.5)', color:'#fff', border:'none', backdropFilter:'blur(4px)' }}>{tag}</span>
                </div>
              </div>
              {/* Info */}
              <div style={{ padding:'0.85rem 1rem' }}>
                <h3 style={{ fontSize:'1rem', marginBottom:'0.15rem', color:'var(--text)' }}>{name}</h3>
                <p style={{ fontSize:'0.78rem', color:'var(--text2)' }}>{country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div style={{ margin:'0 1.5rem 6rem', maxWidth:'1100px', marginLeft:'auto', marginRight:'auto' }}>
          <div className="card" style={{ textAlign:'center', padding:'3.5rem 2rem', background:'linear-gradient(135deg, var(--accent-glow), var(--teal2))', border:'1px solid var(--border2)' }}>
            <h2 style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)', marginBottom:'0.75rem' }}>Sign up to save your itineraries</h2>
            <p style={{ color:'var(--text2)', marginBottom:'1.75rem', maxWidth:'400px', margin:'0 auto 1.75rem' }}>
              Create a free account to save, revisit, and share your AI-generated travel plans anytime.
            </p>
            <button className="btn btn-primary" onClick={openSignUp} style={{ fontSize:'0.95rem', padding:'0.8rem 2.2rem' }}>
              <Star size={17} /> Create Free Account
            </button>
          </div>
        </div>
      )}
    </div>
  )
}