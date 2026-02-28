import { useState, useRef, useEffect } from 'react'
import { Send, Terminal, Bot, User, Zap, ChevronRight } from 'lucide-react'
import { travelAPI } from '../services/api'
import toast from 'react-hot-toast'

const SUGGESTED = [
  "Best hidden gems in Kyoto?",
  "3-day Amsterdam food itinerary",
  "Best time to visit Patagonia?",
  "2-week SE Asia budget estimate",
  "Iceland winter packing list",
  "Solo travel tips for Japan",
]

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'flex-start',
      marginBottom: '1.25rem',
      flexDirection: isUser ? 'row-reverse' : 'row',
      animation: 'fadeUp 0.3s ease',
    }}>
      {/* Avatar */}
      <div style={{
        width: '34px',
        height: '34px',
        borderRadius: '10px',
        background: isUser ? 'var(--accent-glow)' : 'var(--teal2)',
        border: `1px solid ${isUser ? 'var(--border2)' : 'rgba(45,212,191,0.3)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: isUser ? '0 0 10px var(--accent-glow)' : '0 0 10px rgba(45,212,191,0.2)',
      }}>
        {isUser
          ? <User size={15} color="var(--accent)" />
          : <Bot size={15} color="var(--teal)" />}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '76%',
        padding: '0.85rem 1.1rem',
        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
        background: isUser ? 'var(--accent-glow)' : 'var(--glass)',
        backdropFilter: isUser ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: isUser ? 'none' : 'blur(12px)',
        border: `1px solid ${isUser ? 'var(--border2)' : 'var(--glass-border)'}`,
        fontSize: '0.93rem',
        lineHeight: 1.7,
        color: 'var(--text)',
        whiteSpace: 'pre-wrap',
        boxShadow: isUser ? '0 2px 12px var(--accent-glow)' : 'none',
      }}>
        {msg.content}
        {msg.loading && (
          <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', marginLeft: '0.6rem' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: 'var(--teal)',
                animation: 'pulse 1.2s ease infinite',
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
          </span>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "// SYSTEM READY\n\nHey! I'm Nova — your AI travel concierge running on Amazon Nova via Bedrock. I can generate itineraries, find hidden gems, estimate budgets, and answer anything travel-related.\n\nWhere shall we go? 🌍",
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    const newMsg = { role: 'user', content: userText }
    const updatedMessages = [...messages, newMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    // Add loading bubble
    setMessages(m => [...m, { role: 'assistant', content: '', loading: true }])

    try {
      // Build the conversation history (exclude loading message)
      // Only send real user/assistant messages — skip the initial greeting (assistant-first)
      // and any loading placeholders
      const apiMessages = updatedMessages
        .filter(m => m.content && !m.loading)
        .map(m => ({ role: m.role, content: m.content }))

      const res = await travelAPI.chat(apiMessages)
      setMessages(m => {
        const withoutLoading = m.filter(msg => !msg.loading)
        return [...withoutLoading, { role: 'assistant', content: res.reply }]
      })
    } catch (err) {
      setMessages(m => {
        const withoutLoading = m.filter(msg => !msg.loading)
        return [...withoutLoading, {
          role: 'assistant',
          content: '⚠️ Sorry, I encountered an error. Please check the backend connection and try again.',
        }]
      })
      toast.error(err.message)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 2rem 0',
      height: 'calc(100vh - 70px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent-glow), var(--teal2))',
            border: '1px solid var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--neon-glow)',
          }}>
            <Terminal size={22} color="var(--teal)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', letterSpacing: '-0.02em' }}>Nova <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: '1rem' }}>/ AI Travel Concierge</span></h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--teal)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>amazon.nova-lite-v1:0 · us-east-1</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.8rem', borderRadius: '8px', background: 'var(--green2)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--green)', fontWeight: 600, letterSpacing: '0.06em' }}>LIVE</span>
        </div>
      </div>

      {/* Suggestions (only at start) */}
      {messages.length <= 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {SUGGESTED.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              style={{
                padding: '0.38rem 0.9rem',
                borderRadius: '8px',
                background: 'var(--glass)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text2)',
                fontSize: '0.78rem',
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.boxShadow = 'var(--neon-glow)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <ChevronRight size={11} style={{ color: 'var(--accent)', flexShrink: 0 }} />{s}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0.5rem 0 1rem',
        scrollbarWidth: 'thin',
      }}>
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '1rem 0 1.5rem',
        borderTop: '1px solid var(--glass-border)',
      }}>
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          background: 'var(--glass)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '14px',
          padding: '0.5rem 0.75rem 0.5rem 1.1rem',
          alignItems: 'flex-end',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
          onFocus={() => {}}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.boxShadow = 'var(--neon-glow)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <span style={{ color: 'var(--accent)', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.9rem', paddingBottom: '0.45rem', userSelect: 'none', opacity: 0.7 }}>›</span>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about travel..."
            rows={1}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontSize: '0.93rem',
              resize: 'none',
              maxHeight: '120px',
              lineHeight: 1.6,
              padding: '0.42rem 0',
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, var(--accent), var(--teal))'
                : 'var(--card2)',
              border: `1px solid ${input.trim() && !loading ? 'transparent' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              flexShrink: 0, transition: 'all 0.2s',
              boxShadow: input.trim() && !loading ? 'var(--shadow-accent)' : 'none',
            }}
          >
            <Send size={16} color={input.trim() && !loading ? '#fff' : 'var(--text3)'} />
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text3)', marginTop: '0.55rem', fontFamily: "'JetBrains Mono',monospace" }}>
          Enter ↵ send · Shift+Enter new line
        </p>
      </div>
    </div>
  )
}
