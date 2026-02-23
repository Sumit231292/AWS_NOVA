import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, Bot, User, Sparkles } from 'lucide-react'
import { travelAPI } from '../services/api'
import toast from 'react-hot-toast'

const SUGGESTED = [
  "What are the best hidden gems in Kyoto?",
  "Plan a 3-day weekend in Amsterdam for food lovers",
  "What's the best time to visit Patagonia?",
  "How much should I budget for 2 weeks in Southeast Asia?",
  "What should I pack for a winter trip to Iceland?",
  "Give me tips for travelling solo in Japan",
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
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: isUser ? 'rgba(74,144,217,0.2)' : 'rgba(201,169,110,0.2)',
        border: `1px solid ${isUser ? 'rgba(74,144,217,0.4)' : 'rgba(201,169,110,0.4)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {isUser ? <User size={16} color="#4a90d9" /> : <Bot size={16} color="#c9a96e" />}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '75%',
        padding: '0.85rem 1.1rem',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? 'rgba(74,144,217,0.12)' : 'rgba(201,169,110,0.07)',
        border: `1px solid ${isUser ? 'rgba(74,144,217,0.25)' : 'rgba(201,169,110,0.2)'}`,
        fontSize: '0.93rem',
        lineHeight: 1.65,
        color: 'var(--text)',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
        {msg.loading && (
          <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center', marginLeft: '0.5rem' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#c9a96e',
                animation: 'pulse-gold 1.2s ease infinite',
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
      content: "✈️ Hello! I'm Nova, your AI travel concierge powered by Amazon Nova. I can help you plan trips, find hidden gems, estimate budgets, suggest itineraries, and answer any travel question. Where shall we explore today?",
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
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(201,169,110,0.3), rgba(232,201,138,0.1))',
          border: '1px solid rgba(201,169,110,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Bot size={24} color="#c9a96e" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Nova — AI Travel Concierge</h1>
          <p style={{ fontSize: '0.8rem', color: '#c9a96e' }}>
            <Sparkles size={12} style={{ display: 'inline', marginRight: '0.3rem' }} />
            Powered by Amazon Nova · Amazon Bedrock
          </p>
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
                padding: '0.45rem 1rem',
                borderRadius: '50px',
                background: 'rgba(201,169,110,0.07)',
                border: '1px solid rgba(201,169,110,0.25)',
                color: 'var(--text2)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a96e'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.25)'}
            >
              {s}
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
        borderTop: '1px solid rgba(201,169,110,0.15)',
      }}>
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          background: 'var(--card)',
          border: '1px solid rgba(201,169,110,0.25)',
          borderRadius: '16px',
          padding: '0.5rem 0.75rem 0.5rem 1.25rem',
          alignItems: 'flex-end',
        }}>
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
              fontSize: '0.95rem',
              resize: 'none',
              maxHeight: '120px',
              lineHeight: 1.6,
              padding: '0.4rem 0',
              fontFamily: 'DM Sans, sans-serif',
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #c9a96e, #e8c98a)'
                : 'rgba(201,169,110,0.15)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            <Send size={18} color={input.trim() && !loading ? '#0d0d1a' : '#c9a96e'} />
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.73rem', color: 'var(--text2)', marginTop: '0.6rem', opacity: 0.6 }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
