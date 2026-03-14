import { BookOpen, Github, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--glass-border)',
      background: 'var(--navbar-bg)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      padding: '2rem 1.5rem 1.5rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Top row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          marginBottom: '1.5rem',
        }}>
          {/* Brand */}
          <div style={{ maxWidth: '320px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '0.65rem' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px var(--accent-glow)',
              }}>
                <BookOpen size={15} color="#fff" />
              </div>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)' }}>
                Trip<span style={{ color: 'var(--accent)' }}>Chronicles</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.82rem', color: 'var(--text3)', lineHeight: 1.6 }}>
              AI-powered travel intelligence. Plan smarter, pack better, explore further — all powered by Amazon Nova.
            </p>
          </div>

          {/* Quick links */}
          <div className="footer-links-grid" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.65rem', fontFamily: "'JetBrains Mono',monospace" }}>Plan</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <Link to="/plan" style={{ fontSize: '0.84rem', color: 'var(--text3)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                  New Trip
                </Link>
                <Link to="/packing" style={{ fontSize: '0.84rem', color: 'var(--text3)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                  Packing List
                </Link>
                <Link to="/budget" style={{ fontSize: '0.84rem', color: 'var(--text3)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                  Budget
                </Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.65rem', fontFamily: "'JetBrains Mono',monospace" }}>Tools</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <Link to="/chat" style={{ fontSize: '0.84rem', color: 'var(--text3)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                  AI Chat
                </Link>
                <Link to="/saved" style={{ fontSize: '0.84rem', color: 'var(--text3)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                  Saved Trips
                </Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.65rem', fontFamily: "'JetBrains Mono',monospace" }}>Powered By</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text3)' }}>Amazon Nova Lite</span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text3)' }}>Amazon Bedrock</span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text3)' }}>AWS Cognito</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border2), transparent)', marginBottom: '1rem' }} />

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <p style={{ fontSize: '0.74rem', color: 'var(--text3)' }}>
            © {new Date().getFullYear()} Trip Chronicles · Built with <Heart size={10} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--coral)' }} /> for the Amazon Nova AI Hackathon 2026
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href="https://github.com/Sumit231292/AWS_NOVA"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.74rem', color: 'var(--text3)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
            >
              <Github size={13} /> Source Code
            </a>
            <span style={{
              fontSize: '0.68rem', fontFamily: "'JetBrains Mono',monospace",
              color: '#ff9900', fontWeight: 600,
            }}>
              ⚡ AWS Nova
            </span>
          </div>
        </div>
      </div>

      {/* Footer mobile collapse */}
      <style>{`
        @media(max-width:640px){
          footer .footer-links-grid { display:none!important; }
          footer { padding: 1.25rem 1.5rem 1rem !important; }
        }
      `}</style>
    </footer>
  )
}
