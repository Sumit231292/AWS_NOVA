import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Map, Package, DollarSign, MessageCircle, Zap, ArrowRight, Star, Globe, BookMarked, Shield, Cpu, Sparkles, Radio, ChevronRight, Terminal, Layers, Brain } from 'lucide-react'
import { useApp } from '../context/AppContext'

const features = [
  { icon: Map, title: 'Mission Planner', desc: 'AI-generated day-by-day itineraries with activities, dining & accommodation tailored to you.', gradient: 'linear-gradient(135deg, #38bdf8, #22d3ee)', tag: 'Popular' },
  { icon: Package, title: 'Smart Loadout', desc: 'Weather-aware, activity-specific packing checklists you can check off in real-time.', gradient: 'linear-gradient(135deg, #2dd4bf, #34d399)', tag: null },
  { icon: DollarSign, title: 'Cost Intelligence', desc: 'Detailed budget breakdowns with money-saving tactics for any destination.', gradient: 'linear-gradient(135deg, #34d399, #fbbf24)', tag: null },
  { icon: MessageCircle, title: 'Nova Agent', desc: 'Chat with an AI travel concierge that thinks like a seasoned world explorer.', gradient: 'linear-gradient(135deg, #a78bfa, #e879f9)', tag: 'New' },
]

const destinations = [
  { name: 'Tokyo', country: 'Japan', tag: 'Culture', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&h=400&fit=crop&q=80' },
  { name: 'Santorini', country: 'Greece', tag: 'Romance', img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&fit=crop&q=80' },
  { name: 'Bali', country: 'Indonesia', tag: 'Wellness', img: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&h=400&fit=crop&q=80' },
  { name: 'New York', country: 'USA', tag: 'Urban', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&h=400&fit=crop&q=80' },
  { name: 'Dubai', country: 'UAE', tag: 'Luxury', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop&q=80' },
  { name: 'Paris', country: 'France', tag: 'Romance', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop&q=80' },
]

const stats = [
  { value: 'Nova Lite', label: 'AI Engine', icon: Brain },
  { value: '< 30s', label: 'Generation', icon: Zap },
  { value: '4 Tools', label: 'Full Suite', icon: Layers },
  { value: 'Cognito', label: 'Auth', icon: Shield },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { user, openSignUp } = useApp()

  return (
    <div style={{ overflow: 'hidden' }}>
      {/*  HERO  */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 4rem' }}>
        {/* Travel-themed background collage */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Subtle travel hero image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=60)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.07,
            filter: 'blur(1px)',
          }} />
          {/* Warm gradient overlay for travel vibes */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(251,191,36,0.06) 25%, rgba(251,113,133,0.05) 50%, rgba(45,212,191,0.06) 75%, rgba(167,139,250,0.08) 100%)',
          }} />
          {/* Animated travel orbs with warm tones */}
          <div style={{ position: 'absolute', top: '-10%', right: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)', animation: 'float 12s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '0%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,113,133,0.08) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />
          <div style={{ position: 'absolute', top: '40%', left: '55%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,212,191,0.07) 0%, transparent 70%)', animation: 'float 14s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '15%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)', animation: 'float 16s ease-in-out infinite' }} />
          {/* Floating travel emoji particles */}
          {['✈️','🌍','🏖️','🗺️','⛰️','🌅','🧳','🏛️'].map((emoji, i) => (
            <div key={i} style={{
              position: 'absolute',
              fontSize: `${1.2 + (i % 3) * 0.5}rem`,
              opacity: 0.12 + (i % 4) * 0.03,
              top: `${10 + (i * 11) % 80}%`,
              left: `${5 + (i * 13) % 90}%`,
              animation: `float ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              {emoji}
            </div>
          ))}
        </div>

        {/* Hero grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%)' }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '860px', zIndex: 1 }}>
          {/* Hackathon badge */}
          <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1.2rem', borderRadius: '50px', background: 'rgba(255,153,0,0.08)', border: '1px solid rgba(255,153,0,0.2)', marginBottom: '2.5rem' }}>
            <Zap size={13} color="#ff9900" />
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ff9900', letterSpacing: '0.1em', fontFamily: "'JetBrains Mono', monospace" }}>AMAZON NOVA AI HACKATHON 2026</span>
          </div>

          {/* Main heading */}
          <h1 className="fade-up" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 800, lineHeight: 1.02, marginBottom: '1.8rem', animationDelay: '0.06s', letterSpacing: '-0.03em' }}>
            Travel smarter<br />
            with <span className="glow-text">AI intelligence</span>
          </h1>

          {/* Subtitle */}
          <p className="fade-up" style={{ fontSize: '1.15rem', color: 'var(--text2)', maxWidth: '580px', margin: '0 auto 2.8rem', lineHeight: 1.7, animationDelay: '0.12s' }}>
            Trip Chronicles uses <strong style={{ color: 'var(--text)' }}>Amazon Nova</strong> to generate hyper-personalized itineraries, smart packing lists, and real-time travel intelligence — all in seconds.
          </p>

          {/* CTA buttons */}
          <div className="fade-up" style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.18s' }}>
            <button className="btn btn-primary" onClick={() => navigate('/plan')} style={{ fontSize: '0.96rem', padding: '0.85rem 2.2rem' }}>
              <BookOpen size={18} /> Start Your Chronicle
            </button>
            {!user && (
              <button className="btn btn-ghost" onClick={openSignUp} style={{ fontSize: '0.96rem', padding: '0.85rem 2.2rem' }}>
                <BookMarked size={18} /> Save Chronicles
              </button>
            )}
          </div>

          {/* Floating stats */}
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '4.5rem', animationDelay: '0.26s', flexWrap: 'wrap' }}>
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="stat-chip hover-glow">
                <Icon size={15} style={{ color: 'var(--accent)', marginBottom: '0.25rem' }} />
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  FEATURES  */}
      <section style={{ padding: '4rem 1.5rem 5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="tag tag-accent" style={{ marginBottom: '1rem' }}>
            <Sparkles size={11} /> Capabilities
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>Full-stack travel intelligence</h2>
          <p style={{ color: 'var(--text2)', maxWidth: '520px', margin: '0 auto', fontSize: '1.02rem' }}>
            Amazon Nova powers every module — from mission planning to real-time AI agent queries.
          </p>
        </div>

        <div className="grid-2" style={{ gap: '1.25rem' }}>
          {features.map(({ icon: Icon, title, desc, gradient, tag }) => (
            <div key={title} className="card" style={{ cursor: 'pointer', padding: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '14px',
                  background: gradient, opacity: 0.9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: `0 4px 16px ${gradient.includes('38bdf8') ? 'rgba(56,189,248,0.25)' : gradient.includes('2dd4bf') ? 'rgba(45,212,191,0.25)' : gradient.includes('a78bfa') ? 'rgba(167,139,250,0.25)' : 'rgba(52,211,153,0.25)'}`,
                }}>
                  <Icon size={22} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.45rem' }}>
                    <h3 style={{ fontSize: '1.05rem' }}>{title}</h3>
                    {tag && <span className="tag tag-accent" style={{ fontSize: '0.62rem', padding: '0.15rem 0.55rem' }}>{tag}</span>}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*  DESTINATIONS  */}
      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="tag tag-cyan" style={{ marginBottom: '0.6rem' }}>
              <Globe size={11} /> Destinations
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.01em' }}>Popular destinations</h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/plan')}>
            Plan custom trip <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid-3">
          {destinations.map(({ name, country, tag, img }) => (
            <div key={name} className="card"
              onClick={() => navigate(`/plan?destination=${name}, ${country}`)}
              style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--bg2)' }}>
                {/* Shimmer placeholder while image loads */}
                <div className="shimmer" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
                <img
                  src={img}
                  alt={name}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)', position: 'relative', zIndex: 1 }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  onError={e => { e.currentTarget.style.display='none'; e.currentTarget.parentElement.innerHTML=`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:2.5rem;background:var(--bg3)"></div>` }}
                />
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(6,8,15,0.9) 100%)' }} />
                {/* Tag */}
                <div style={{ position: 'absolute', top: '0.65rem', right: '0.65rem' }}>
                  <span className="tag" style={{ fontSize: '0.66rem', background: 'rgba(0,0,0,0.55)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>{tag}</span>
                </div>
                {/* City info overlay */}
                <div style={{ position: 'absolute', bottom: '0.85rem', left: '1rem', right: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.1rem' }}>{name}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>{country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*  TECH STACK  */}
      <section style={{ padding: '1rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', padding: '1.1rem 2rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>Powered by</span>
          {['Amazon Nova Lite', 'Amazon Bedrock', 'AWS Cognito', 'DynamoDB', 'React + Vite'].map(t => (
            <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.76rem', color: 'var(--text2)', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </section>

      {/*  CTA  */}
      {!user && (
        <section style={{ padding: '3rem 1.5rem 6rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div className="card" style={{
            textAlign: 'center', padding: '4rem 2rem',
            background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(34,211,238,0.06), rgba(167,139,250,0.05))',
            border: '1px solid var(--border2)',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.3rem)', marginBottom: '0.8rem', letterSpacing: '-0.01em' }}>Save your chronicles — sign up free</h2>
            <p style={{ color: 'var(--text2)', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem' }}>
              Create a free account to save, revisit, and share your AI-generated travel intelligence anytime.
            </p>
            <button className="btn btn-primary" onClick={openSignUp} style={{ fontSize: '0.96rem', padding: '0.85rem 2.4rem' }}>
              <Star size={17} /> Create Free Account
            </button>
          </div>
        </section>
      )}
    </div>
  )
}