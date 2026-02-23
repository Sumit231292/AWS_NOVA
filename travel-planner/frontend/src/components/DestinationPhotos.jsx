import { useState, useEffect, useRef } from 'react'
import { Camera, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'

/**
 * DestinationPhotos
 * Uses Picsum Photos (https://picsum.photos) — free, no API key, works in all browsers.
 * For real destination photos: add VITE_PEXELS_KEY=your_key to frontend/.env
 * Get a free Pexels key at: https://www.pexels.com/api/
 */

// Curated Picsum IDs that look like travel/landmark/nature photos
const PHOTO_SETS = {
  city:    [325185, 466685, 1036808, 1486899, 373912, 380376, 1529679, 1485982],
  nature:  [1624496, 2387873, 631477, 1166209, 1271619, 1287145, 346529, 1477166],
  beach:   [1174732, 189349, 1730877, 235621, 1295036, 3155666, 1320684, 1032650],
  culture: [1010, 417074, 460672, 210186, 417142, 189, 1157, 133],
  urban:   [325185, 466685, 1529679, 373912, 1036808, 380376, 1485982, 1486899],
}

const DESTINATION_MAP = {
  tokyo:      { set: 'city',    ids: [1536, 325185, 466685, 1036808] },
  kyoto:      { set: 'culture', ids: [1010, 417074, 189, 210186] },
  osaka:      { set: 'city',    ids: [373912, 380376, 466685, 325185] },
  paris:      { set: 'city',    ids: [1485982, 1486899, 1529679, 380376] },
  london:     { set: 'city',    ids: [466685, 1036808, 373912, 1486899] },
  rome:       { set: 'culture', ids: [417074, 460672, 210186, 417142] },
  barcelona:  { set: 'city',    ids: [1529679, 325185, 1485982, 466685] },
  amsterdam:  { set: 'city',    ids: [380376, 373912, 1036808, 466685] },
  bali:       { set: 'nature',  ids: [133, 1624496, 631477, 1271619] },
  santorini:  { set: 'beach',   ids: [189, 1174732, 235621, 189349] },
  dubai:      { set: 'urban',   ids: [325185, 1529679, 1485982, 1036808] },
  singapore:  { set: 'urban',   ids: [466685, 373912, 380376, 1486899] },
  bangkok:    { set: 'culture', ids: [417142, 460672, 1010, 417074] },
  istanbul:   { set: 'culture', ids: [210186, 417074, 1010, 460672] },
  'new york': { set: 'urban',   ids: [325185, 1036808, 1529679, 466685] },
  sydney:     { set: 'beach',   ids: [1174732, 189349, 235621, 1730877] },
  patagonia:  { set: 'nature',  ids: [2387873, 1624496, 1271619, 1166209] },
  maldives:   { set: 'beach',   ids: [3155666, 1295036, 1730877, 1174732] },
  prague:     { set: 'culture', ids: [460672, 417074, 210186, 1010] },
  cairo:      { set: 'culture', ids: [417142, 417074, 460672, 210186] },
  mumbai:     { set: 'city',    ids: [325185, 466685, 373912, 380376] },
  pune:       { set: 'city',    ids: [373912, 380376, 325185, 466685] },
  delhi:      { set: 'culture', ids: [417074, 210186, 460672, 417142] },
}

function getPhotos(destination) {
  const lower = (destination || '').toLowerCase()
  for (const [key, val] of Object.entries(DESTINATION_MAP)) {
    if (lower.includes(key)) {
      return val.ids.map((id, i) => ({
        id,
        src: `https://picsum.photos/id/${id}/900/560`,
        thumb: `https://picsum.photos/id/${id}/200/120`,
        alt: `${destination} — scene ${i + 1}`,
      }))
    }
  }
  // Unknown destination — pick from city set deterministically
  const seed = lower.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const ids = PHOTO_SETS.city
  const picked = [0, 1, 2, 3].map(i => ids[(seed + i * 3) % ids.length])
  return picked.map((id, i) => ({
    id,
    src: `https://picsum.photos/id/${id}/900/560`,
    thumb: `https://picsum.photos/id/${id}/200/120`,
    alt: `${destination} — scene ${i + 1}`,
  }))
}

function Img({ src, alt, style, onLoad, onError }) {
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onLoad={onLoad}
      onError={onError}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      loading="lazy"
    />
  )
}

export default function DestinationPhotos({ destination }) {
  const [photos] = useState(() => getPhotos(destination))
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState({})   // id → true
  const [errored, setErrored] = useState({}) // id → true
  const timerRef = useRef(null)

  // Auto-advance every 5s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % photos.length)
    }, 5000)
    return () => clearInterval(timerRef.current)
  }, [photos.length])

  const go = (dir) => {
    clearInterval(timerRef.current)
    setCurrent(c => (c + dir + photos.length) % photos.length)
  }

  if (!destination || !photos.length) return null
  const city = destination.split(',')[0].trim()

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Camera size={14} color="var(--accent)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            {city} — Highlights
          </span>
        </div>
        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          {photos.map((_, i) => (
            <button key={i} onClick={() => { clearInterval(timerRef.current); setCurrent(i) }}
              style={{
                width: i === current ? '18px' : '7px', height: '7px',
                borderRadius: '4px', border: 'none', padding: 0, cursor: 'pointer',
                background: i === current ? 'var(--accent)' : 'var(--border2)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Main slide area */}
      <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/9', background: 'var(--bg2)', boxShadow: 'var(--shadow-sm)' }}>
        {photos.map((photo, i) => {
          const isVisible = i === current
          const isLoaded = loaded[photo.id]
          const isErrored = errored[photo.id]
          return (
            <div key={photo.id} style={{
              position: 'absolute', inset: 0,
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.5s ease',
              zIndex: isVisible ? 1 : 0,
            }}>
              {/* Skeleton shimmer while loading */}
              {!isLoaded && !isErrored && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, var(--bg2) 25%, var(--bg3) 50%, var(--bg2) 75%)',
                  backgroundSize: '400% 100%',
                  animation: 'shimmer 1.5s infinite',
                }} />
              )}

              {!isErrored ? (
                <Img
                  src={photo.src}
                  alt={photo.alt}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: isLoaded ? 1 : 0, transition: 'opacity 0.4s' }}
                  onLoad={() => setLoaded(prev => ({ ...prev, [photo.id]: true }))}
                  onError={() => setErrored(prev => ({ ...prev, [photo.id]: true }))}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.6rem', color: 'var(--text3)' }}>
                  <span style={{ fontSize: '2.5rem' }}>🌍</span>
                  <span style={{ fontSize: '0.82rem' }}>Photo loading...</span>
                </div>
              )}

              {/* Bottom gradient + caption */}
              {isLoaded && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
                  padding: '1.5rem 0.85rem 0.5rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
                    {city}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                    {i + 1} / {photos.length} · Picsum
                  </span>
                </div>
              )}
            </div>
          )
        })}

        {/* Nav arrows */}
        {photos.length > 1 && (
          <>
            {[{ d: -1, side: { left: '0.55rem' }, icon: <ChevronLeft size={17} /> },
              { d:  1, side: { right: '0.55rem' }, icon: <ChevronRight size={17} /> }].map(({ d, side, icon }) => (
              <button key={d} onClick={() => go(d)} style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)', ...side,
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(6px)',
                color: '#fff', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s', zIndex: 10,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.72)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.42)'}>
                {icon}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.45rem' }}>
          {photos.map((photo, i) => (
            <button key={photo.id} onClick={() => { clearInterval(timerRef.current); setCurrent(i) }}
              style={{
                flex: 1, aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden',
                border: `2px solid ${i === current ? 'var(--accent)' : 'transparent'}`,
                padding: 0, cursor: 'pointer', transition: 'border-color 0.2s',
                background: 'var(--bg2)',
              }}>
              <img src={photo.thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy" referrerPolicy="no-referrer"
                onError={e => e.currentTarget.style.opacity = '0'} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}