import { Component } from 'react'
import { BookOpen, RefreshCw, Home } from 'lucide-react'

/**
 * Error Boundary — catches unhandled React errors and shows a friendly fallback UI
 * instead of a blank white screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--bg)',
        color: 'var(--text)',
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '480px',
          padding: '3rem 2rem',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          boxShadow: 'var(--shadow)',
        }}>
          {/* Logo */}
          <div style={{
            width: '60px', height: '60px', borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--coral), var(--rose))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 4px 20px rgba(251,113,133,0.3)',
          }}>
            <BookOpen size={28} color="#fff" />
          </div>

          <h1 style={{
            fontSize: '1.5rem', fontFamily: "'Space Grotesk',sans-serif",
            marginBottom: '0.6rem',
          }}>
            Something went wrong
          </h1>

          <p style={{
            color: 'var(--text2)', fontSize: '0.9rem',
            lineHeight: 1.6, marginBottom: '1.5rem',
          }}>
            Trip Chronicles encountered an unexpected error. 
            Don't worry — your saved trips are safe.
          </p>

          {/* Error detail (collapsed) */}
          {this.state.error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'var(--coral2)',
              border: '1px solid rgba(251,113,133,0.2)',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              textAlign: 'left',
            }}>
              <code style={{
                fontSize: '0.75rem', color: 'var(--coral)',
                fontFamily: "'JetBrains Mono',monospace",
                wordBreak: 'break-word',
              }}>
                {this.state.error.toString()}
              </code>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={this.handleReload}
              className="btn btn-primary"
              style={{ fontSize: '0.9rem', padding: '0.7rem 1.5rem' }}
            >
              <RefreshCw size={16} /> Reload Page
            </button>
            <button
              onClick={this.handleGoHome}
              className="btn btn-ghost"
              style={{ fontSize: '0.9rem', padding: '0.7rem 1.5rem' }}
            >
              <Home size={16} /> Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }
}
