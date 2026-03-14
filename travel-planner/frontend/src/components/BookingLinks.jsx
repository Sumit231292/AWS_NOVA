import { ExternalLink, Plane, Hotel, Car, MapPin, Ticket } from 'lucide-react'

/**
 * BookingLinks — Generates deep links to real booking platforms
 * pre-filled with the user's destination, dates, and traveler count.
 * Opens in new tabs — no affiliate/API keys needed.
 */

function formatDate(dateStr) {
  if (!dateStr) return ''
  // Handle various formats → YYYY-MM-DD
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toISOString().split('T')[0]
}

function buildLinks({ destination, origin, startDate, endDate, travelers }) {
  const dest = encodeURIComponent(destination || '')
  const orig = encodeURIComponent(origin || '')
  const checkin = formatDate(startDate)
  const checkout = formatDate(endDate)
  const guests = travelers || 2

  return [
    {
      id: 'flights',
      label: 'Search Flights',
      icon: <Plane size={16} />,
      color: 'var(--accent)',
      bg: 'var(--accent-glow)',
      links: [
        {
          name: 'Google Flights',
          url: `https://www.google.com/travel/flights?q=flights+from+${orig}+to+${dest}${checkin ? `+on+${checkin}` : ''}`,
        },
        {
          name: 'Skyscanner',
          url: `https://www.skyscanner.com/transport/flights/${orig}/${dest}/${checkin ? checkin.replace(/-/g, '') : ''}/${checkout ? checkout.replace(/-/g, '') : ''}/`,
        },
        {
          name: 'Kayak',
          url: `https://www.kayak.com/flights/${origin || 'anywhere'}-${destination || 'anywhere'}/${checkin || ''}/${checkout || ''}/${guests}adults`,
        },
      ],
    },
    {
      id: 'hotels',
      label: 'Book Hotels',
      icon: <Hotel size={16} />,
      color: 'var(--teal)',
      bg: 'var(--teal2)',
      links: [
        {
          name: 'Booking.com',
          url: `https://www.booking.com/searchresults.html?ss=${dest}&checkin=${checkin}&checkout=${checkout}&group_adults=${guests}`,
        },
        {
          name: 'Hotels.com',
          url: `https://www.hotels.com/search.do?q-destination=${dest}&q-check-in=${checkin}&q-check-out=${checkout}&q-rooms=1&q-room-0-adults=${guests}`,
        },
        {
          name: 'Airbnb',
          url: `https://www.airbnb.com/s/${dest}/homes?checkin=${checkin}&checkout=${checkout}&adults=${guests}`,
        },
      ],
    },
    {
      id: 'activities',
      label: 'Tours & Activities',
      icon: <Ticket size={16} />,
      color: 'var(--coral)',
      bg: 'var(--coral2)',
      links: [
        {
          name: 'GetYourGuide',
          url: `https://www.getyourguide.com/s/?q=${dest}&date_from=${checkin}&date_to=${checkout}`,
        },
        {
          name: 'Viator',
          url: `https://www.viator.com/searchResults/all?text=${dest}`,
        },
        {
          name: 'TripAdvisor',
          url: `https://www.tripadvisor.com/Search?q=${dest}`,
        },
      ],
    },
    {
      id: 'transport',
      label: 'Car Rental & Transport',
      icon: <Car size={16} />,
      color: 'var(--purple)',
      bg: 'rgba(168,85,247,0.1)',
      links: [
        {
          name: 'Rentalcars.com',
          url: `https://www.rentalcars.com/search-results?location=${dest}&pick-up-date=${checkin}&drop-off-date=${checkout}`,
        },
        {
          name: 'Rome2Rio',
          url: `https://www.rome2rio.com/map/${origin || 'My-Location'}/${destination || ''}`,
        },
        {
          name: 'Google Maps',
          url: `https://www.google.com/maps/dir/${orig}/${dest}`,
        },
      ],
    },
  ]
}

export default function BookingLinks({ destination, origin, startDate, endDate, travelers }) {
  if (!destination) return null
  const categories = buildLinks({ destination, origin, startDate, endDate, travelers })

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        marginBottom: '1rem',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--accent), var(--teal))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MapPin size={16} color="#fff" />
        </div>
        <div>
          <h3 style={{
            fontSize: '1rem', fontWeight: 700, color: 'var(--text)',
            fontFamily: "'Space Grotesk', sans-serif", margin: 0,
          }}>
            Book Your Trip
          </h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text3)', margin: 0 }}>
            Real booking links pre-filled with your trip details
          </p>
        </div>
      </div>

      {/* Booking categories grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.85rem',
      }}>
        {categories.map(cat => (
          <div key={cat.id} style={{
            padding: '1.1rem',
            borderRadius: '14px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = cat.color
            e.currentTarget.style.boxShadow = `0 0 20px ${cat.bg}`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            {/* Category header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '0.85rem',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '7px',
                background: cat.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: cat.color,
              }}>
                {cat.icon}
              </div>
              <span style={{
                fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                {cat.label}
              </span>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {cat.links.map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.5rem 0.7rem',
                    borderRadius: '8px',
                    background: 'var(--bg2)',
                    color: 'var(--text2)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = cat.bg
                    e.currentTarget.style.color = cat.color
                    e.currentTarget.style.borderColor = cat.color
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg2)'
                    e.currentTarget.style.color = 'var(--text2)'
                    e.currentTarget.style.borderColor = 'transparent'
                  }}
                >
                  <span>{link.name}</span>
                  <ExternalLink size={12} style={{ opacity: 0.6 }} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
