import { useState, useEffect, useRef } from 'react'
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * DestinationPhotos — Reliable destination images via Unsplash CDN
 * No API key needed. Direct CDN links that always work.
 */

const DESTINATION_PHOTOS = {
  tokyo: [
    { id: 'tokyo1', src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&h=560&fit=crop&q=80', alt: 'Tokyo skyline at night' },
    { id: 'tokyo2', src: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&h=560&fit=crop&q=80', alt: 'Tokyo Tower' },
    { id: 'tokyo3', src: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=900&h=560&fit=crop&q=80', alt: 'Shibuya Crossing' },
    { id: 'tokyo4', src: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=900&h=560&fit=crop&q=80', alt: 'Tokyo street scene' },
  ],
  kyoto: [
    { id: 'kyoto1', src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&h=560&fit=crop&q=80', alt: 'Fushimi Inari shrine' },
    { id: 'kyoto2', src: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&h=560&fit=crop&q=80', alt: 'Bamboo grove' },
    { id: 'kyoto3', src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&h=560&fit=crop&q=80', alt: 'Kyoto temple' },
    { id: 'kyoto4', src: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=900&h=560&fit=crop&q=80', alt: 'Japanese garden' },
  ],
  osaka: [
    { id: 'osaka1', src: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=900&h=560&fit=crop&q=80', alt: 'Osaka Castle' },
    { id: 'osaka2', src: 'https://images.unsplash.com/photo-1556888335-e16e0e4cb800?w=900&h=560&fit=crop&q=80', alt: 'Osaka neon lights' },
    { id: 'osaka3', src: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=900&h=560&fit=crop&q=80', alt: 'Dotonbori district' },
    { id: 'osaka4', src: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=900&h=560&fit=crop&q=80', alt: 'Osaka skyline' },
  ],
  paris: [
    { id: 'paris1', src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&h=560&fit=crop&q=80', alt: 'Eiffel Tower' },
    { id: 'paris2', src: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900&h=560&fit=crop&q=80', alt: 'Paris street' },
    { id: 'paris3', src: 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?w=900&h=560&fit=crop&q=80', alt: 'Louvre Museum' },
    { id: 'paris4', src: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=900&h=560&fit=crop&q=80', alt: 'Seine River' },
  ],
  london: [
    { id: 'london1', src: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&h=560&fit=crop&q=80', alt: 'London skyline' },
    { id: 'london2', src: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=900&h=560&fit=crop&q=80', alt: 'Tower Bridge' },
    { id: 'london3', src: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=900&h=560&fit=crop&q=80', alt: 'Big Ben' },
    { id: 'london4', src: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=900&h=560&fit=crop&q=80', alt: 'London Eye' },
  ],
  rome: [
    { id: 'rome1', src: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&h=560&fit=crop&q=80', alt: 'Colosseum' },
    { id: 'rome2', src: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=900&h=560&fit=crop&q=80', alt: 'Roman Forum' },
    { id: 'rome3', src: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=900&h=560&fit=crop&q=80', alt: 'Vatican City' },
    { id: 'rome4', src: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=900&h=560&fit=crop&q=80', alt: 'Trevi Fountain' },
  ],
  barcelona: [
    { id: 'bcn1', src: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=900&h=560&fit=crop&q=80', alt: 'Sagrada Familia' },
    { id: 'bcn2', src: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=900&h=560&fit=crop&q=80', alt: 'Barcelona beach' },
    { id: 'bcn3', src: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=900&h=560&fit=crop&q=80', alt: 'Park Guell' },
    { id: 'bcn4', src: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=900&h=560&fit=crop&q=80', alt: 'Gothic Quarter' },
  ],
  bali: [
    { id: 'bali1', src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&h=560&fit=crop&q=80', alt: 'Bali rice terraces' },
    { id: 'bali2', src: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=900&h=560&fit=crop&q=80', alt: 'Bali temple' },
    { id: 'bali3', src: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=900&h=560&fit=crop&q=80', alt: 'Bali beach' },
    { id: 'bali4', src: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=900&h=560&fit=crop&q=80', alt: 'Bali waterfall' },
  ],
  santorini: [
    { id: 'san1', src: 'https://images.unsplash.com/photo-1570077188670-e3a8d82f0326?w=900&h=560&fit=crop&q=80', alt: 'Santorini blue domes' },
    { id: 'san2', src: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&h=560&fit=crop&q=80', alt: 'Santorini sunset' },
    { id: 'san3', src: 'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=900&h=560&fit=crop&q=80', alt: 'Oia village' },
    { id: 'san4', src: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=900&h=560&fit=crop&q=80', alt: 'Santorini cliffs' },
  ],
  dubai: [
    { id: 'dub1', src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&h=560&fit=crop&q=80', alt: 'Dubai skyline' },
    { id: 'dub2', src: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=900&h=560&fit=crop&q=80', alt: 'Burj Khalifa' },
    { id: 'dub3', src: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=900&h=560&fit=crop&q=80', alt: 'Dubai marina' },
    { id: 'dub4', src: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=900&h=560&fit=crop&q=80', alt: 'Dubai desert' },
  ],
  singapore: [
    { id: 'sg1', src: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&h=560&fit=crop&q=80', alt: 'Marina Bay Sands' },
    { id: 'sg2', src: 'https://images.unsplash.com/photo-1496939376851-89342e90adcd?w=900&h=560&fit=crop&q=80', alt: 'Singapore skyline' },
    { id: 'sg3', src: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=900&h=560&fit=crop&q=80', alt: 'Gardens by the Bay' },
    { id: 'sg4', src: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=900&h=560&fit=crop&q=80', alt: 'Singapore street' },
  ],
  'new york': [
    { id: 'ny1', src: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=900&h=560&fit=crop&q=80', alt: 'NYC skyline' },
    { id: 'ny2', src: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=900&h=560&fit=crop&q=80', alt: 'Times Square' },
    { id: 'ny3', src: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&h=560&fit=crop&q=80', alt: 'Brooklyn Bridge' },
    { id: 'ny4', src: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=900&h=560&fit=crop&q=80', alt: 'Central Park' },
  ],
  sydney: [
    { id: 'syd1', src: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=900&h=560&fit=crop&q=80', alt: 'Sydney Opera House' },
    { id: 'syd2', src: 'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=900&h=560&fit=crop&q=80', alt: 'Sydney Harbour' },
    { id: 'syd3', src: 'https://images.unsplash.com/photo-1526958977630-bc61b30d2217?w=900&h=560&fit=crop&q=80', alt: 'Bondi Beach' },
    { id: 'syd4', src: 'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?w=900&h=560&fit=crop&q=80', alt: 'Sydney skyline' },
  ],
  bangkok: [
    { id: 'bkk1', src: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=900&h=560&fit=crop&q=80', alt: 'Grand Palace' },
    { id: 'bkk2', src: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=900&h=560&fit=crop&q=80', alt: 'Bangkok temples' },
    { id: 'bkk3', src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=560&fit=crop&q=80', alt: 'Bangkok skyline' },
    { id: 'bkk4', src: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=900&h=560&fit=crop&q=80', alt: 'Floating market' },
  ],
  istanbul: [
    { id: 'ist1', src: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=900&h=560&fit=crop&q=80', alt: 'Istanbul skyline' },
    { id: 'ist2', src: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&h=560&fit=crop&q=80', alt: 'Blue Mosque' },
    { id: 'ist3', src: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=900&h=560&fit=crop&q=80', alt: 'Grand Bazaar' },
    { id: 'ist4', src: 'https://images.unsplash.com/photo-1581862011407-e28c2b5acf0e?w=900&h=560&fit=crop&q=80', alt: 'Bosphorus' },
  ],
  patagonia: [
    { id: 'pat1', src: 'https://images.unsplash.com/photo-1531794680744-e10e1b012ab1?w=900&h=560&fit=crop&q=80', alt: 'Patagonia mountains' },
    { id: 'pat2', src: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=900&h=560&fit=crop&q=80', alt: 'Torres del Paine' },
    { id: 'pat3', src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&h=560&fit=crop&q=80', alt: 'Mountain peaks' },
    { id: 'pat4', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=560&fit=crop&q=80', alt: 'Glacier view' },
  ],
  maldives: [
    { id: 'mld1', src: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=900&h=560&fit=crop&q=80', alt: 'Maldives overwater villa' },
    { id: 'mld2', src: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&h=560&fit=crop&q=80', alt: 'Crystal clear water' },
    { id: 'mld3', src: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=900&h=560&fit=crop&q=80', alt: 'Maldives beach' },
    { id: 'mld4', src: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=900&h=560&fit=crop&q=80', alt: 'Maldives sunset' },
  ],
  mumbai: [
    { id: 'mum1', src: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=900&h=560&fit=crop&q=80', alt: 'Gateway of India' },
    { id: 'mum2', src: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&h=560&fit=crop&q=80', alt: 'Mumbai skyline' },
    { id: 'mum3', src: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=900&h=560&fit=crop&q=80', alt: 'Marine Drive' },
    { id: 'mum4', src: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=900&h=560&fit=crop&q=80', alt: 'Mumbai streets' },
  ],
  delhi: [
    { id: 'del1', src: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&h=560&fit=crop&q=80', alt: 'India Gate' },
    { id: 'del2', src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&h=560&fit=crop&q=80', alt: 'Taj Mahal' },
    { id: 'del3', src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=900&h=560&fit=crop&q=80', alt: 'Red Fort' },
    { id: 'del4', src: 'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=900&h=560&fit=crop&q=80', alt: 'Delhi market' },
  ],
  pune: [
    { id: 'pun1', src: 'https://images.unsplash.com/photo-1585136917246-4e37e23aa377?w=900&h=560&fit=crop&q=80', alt: 'Shaniwar Wada' },
    { id: 'pun2', src: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&h=560&fit=crop&q=80', alt: 'Pune cityscape' },
    { id: 'pun3', src: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=900&h=560&fit=crop&q=80', alt: 'Pune hills' },
    { id: 'pun4', src: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=900&h=560&fit=crop&q=80', alt: 'Pune temple' },
  ],
  prague: [
    { id: 'prg1', src: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=900&h=560&fit=crop&q=80', alt: 'Prague old town' },
    { id: 'prg2', src: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=900&h=560&fit=crop&q=80', alt: 'Charles Bridge' },
    { id: 'prg3', src: 'https://images.unsplash.com/photo-1458150945447-7fb764c11a92?w=900&h=560&fit=crop&q=80', alt: 'Prague Castle' },
    { id: 'prg4', src: 'https://images.unsplash.com/photo-1562770584-eaf50b017307?w=900&h=560&fit=crop&q=80', alt: 'Prague streets' },
  ],
  cairo: [
    { id: 'cai1', src: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=900&h=560&fit=crop&q=80', alt: 'Pyramids of Giza' },
    { id: 'cai2', src: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=900&h=560&fit=crop&q=80', alt: 'Cairo skyline' },
    { id: 'cai3', src: 'https://images.unsplash.com/photo-1568322445389-f64e1bbea7de?w=900&h=560&fit=crop&q=80', alt: 'Sphinx' },
    { id: 'cai4', src: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=900&h=560&fit=crop&q=80', alt: 'Cairo market' },
  ],
  amsterdam: [
    { id: 'ams1', src: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=900&h=560&fit=crop&q=80', alt: 'Amsterdam canals' },
    { id: 'ams2', src: 'https://images.unsplash.com/photo-1584003564911-a5039972e1ff?w=900&h=560&fit=crop&q=80', alt: 'Amsterdam houses' },
    { id: 'ams3', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&h=560&fit=crop&q=80', alt: 'Rijksmuseum' },
    { id: 'ams4', src: 'https://images.unsplash.com/photo-1576924542622-772281b13aa8?w=900&h=560&fit=crop&q=80', alt: 'Amsterdam bikes' },
  ],
}

const FALLBACK_PHOTOS = [
  { id: 'fb1', src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&h=560&fit=crop&q=80', alt: 'Travel scene' },
  { id: 'fb2', src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&h=560&fit=crop&q=80', alt: 'Mountain lake' },
  { id: 'fb3', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=560&fit=crop&q=80', alt: 'Tropical beach' },
  { id: 'fb4', src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&h=560&fit=crop&q=80', alt: 'Road trip' },
]

function getPhotos(destination) {
  const lower = (destination || '').toLowerCase()
  for (const [key, photos] of Object.entries(DESTINATION_PHOTOS)) {
    if (lower.includes(key)) return photos
  }
  return FALLBACK_PHOTOS
}

export default function DestinationPhotos({ destination }) {
  const [photos] = useState(() => getPhotos(destination))
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState({})
  const [errored, setErrored] = useState({})
  const timerRef = useRef(null)

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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Camera size={14} color="var(--accent)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            {city} — Highlights
          </span>
        </div>
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

      {/* Main slide */}
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
              {!isLoaded && !isErrored && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, var(--bg2) 25%, var(--bg3) 50%, var(--bg2) 75%)',
                  backgroundSize: '400% 100%',
                  animation: 'shimmer 1.5s infinite',
                }} />
              )}

              {!isErrored ? (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: isLoaded ? 1 : 0, transition: 'opacity 0.4s' }}
                  onLoad={() => setLoaded(prev => ({ ...prev, [photo.id]: true }))}
                  onError={() => setErrored(prev => ({ ...prev, [photo.id]: true }))}
                  loading="lazy"
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.6rem', color: 'var(--text3)' }}>
                  <span style={{ fontSize: '2.5rem' }}>🌍</span>
                  <span style={{ fontSize: '0.82rem' }}>Photo unavailable</span>
                </div>
              )}

              {isLoaded && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
                  padding: '1.5rem 0.85rem 0.5rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
                    {photo.alt}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                    {i + 1} / {photos.length}
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

      {/* Thumbnails */}
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
              <img src={`${photo.src.replace('w=900&h=560', 'w=200&h=120')}`} alt="" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
                onError={e => e.currentTarget.style.opacity = '0'} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}