/**
 * Skeleton loading components for Trip Chronicles.
 * Use these while waiting for AI responses from Amazon Nova.
 */

const shimmerStyle = {
  background: 'linear-gradient(90deg, var(--card) 25%, var(--card2) 50%, var(--card) 75%)',
  backgroundSize: '400% 100%',
  animation: 'shimmer 1.6s infinite',
  borderRadius: 'var(--radius-sm)',
}

function SkeletonBlock({ width = '100%', height = '1rem', style = {}, borderRadius }) {
  return (
    <div style={{
      ...shimmerStyle,
      width,
      height,
      borderRadius: borderRadius || 'var(--radius-xs)',
      ...style,
    }} />
  )
}

/** Skeleton for a single itinerary day card */
export function ItineraryDaySkeleton() {
  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <SkeletonBlock width="50px" height="50px" borderRadius="12px" />
        <div style={{ flex: 1 }}>
          <SkeletonBlock width="40%" height="1.1rem" style={{ marginBottom: '0.5rem' }} />
          <SkeletonBlock width="25%" height="0.8rem" />
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          display: 'flex', gap: '1rem', padding: '1rem',
          borderRadius: '10px', background: 'var(--activity-bg)',
          border: '1px solid var(--activity-border)', marginBottom: '0.75rem',
        }}>
          <SkeletonBlock width="52px" height="1rem" />
          <div style={{ flex: 1 }}>
            <SkeletonBlock width="60%" height="1rem" style={{ marginBottom: '0.5rem' }} />
            <SkeletonBlock width="90%" height="0.8rem" style={{ marginBottom: '0.35rem' }} />
            <SkeletonBlock width="45%" height="0.8rem" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Full itinerary page skeleton */
export function ItinerarySkeleton() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Trip summary header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <SkeletonBlock width="200px" height="0.8rem" style={{ margin: '0 auto 1rem' }} />
        <SkeletonBlock width="70%" height="2.5rem" style={{ margin: '0 auto 0.75rem' }} />
        <SkeletonBlock width="50%" height="1rem" style={{ margin: '0 auto 1.5rem' }} />
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {[1, 2, 3].map(i => (
            <SkeletonBlock key={i} width="100px" height="2rem" borderRadius="50px" />
          ))}
        </div>
      </div>
      {/* Day cards */}
      {[1, 2, 3].map(i => <ItineraryDaySkeleton key={i} />)}
    </div>
  )
}

/** Packing list skeleton */
export function PackingListSkeleton() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      <SkeletonBlock width="250px" height="2rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonBlock width="400px" height="1rem" style={{ marginBottom: '2rem' }} />
      <div className="grid-2" style={{ gap: '1.25rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <SkeletonBlock width="40px" height="40px" borderRadius="10px" />
              <SkeletonBlock width="40%" height="1rem" />
            </div>
            {[1, 2, 3, 4].map(j => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                <SkeletonBlock width="20px" height="20px" borderRadius="4px" />
                <SkeletonBlock width={`${55 + j * 8}%`} height="0.85rem" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Budget page skeleton */
export function BudgetSkeleton() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      <SkeletonBlock width="220px" height="2rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonBlock width="350px" height="1rem" style={{ marginBottom: '2rem' }} />
      {/* Summary card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <SkeletonBlock width="30%" height="1.2rem" style={{ marginBottom: '1rem' }} />
        <div className="grid-3" style={{ gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ textAlign: 'center' }}>
              <SkeletonBlock width="80px" height="2rem" style={{ margin: '0 auto 0.5rem' }} />
              <SkeletonBlock width="60px" height="0.75rem" style={{ margin: '0 auto' }} />
            </div>
          ))}
        </div>
      </div>
      {/* Breakdown */}
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="card" style={{ padding: '1.25rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SkeletonBlock width="30%" height="1rem" />
            <SkeletonBlock width="20%" height="1rem" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Chat message skeleton (typing indicator) */
export function ChatSkeleton() {
  return (
    <div style={{
      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
      marginBottom: '1.25rem', animation: 'fadeUp 0.3s ease',
    }}>
      <SkeletonBlock width="34px" height="34px" borderRadius="10px" />
      <div style={{ maxWidth: '76%' }}>
        <div style={{
          padding: '0.85rem 1.1rem', borderRadius: '4px 16px 16px 16px',
          background: 'var(--glass)', backdropFilter: 'blur(12px)',
        }}>
          <SkeletonBlock width="240px" height="0.85rem" style={{ marginBottom: '0.5rem' }} />
          <SkeletonBlock width="180px" height="0.85rem" style={{ marginBottom: '0.5rem' }} />
          <SkeletonBlock width="120px" height="0.85rem" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonBlock
