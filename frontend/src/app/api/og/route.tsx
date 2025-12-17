import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') || 'SMA Negeri 1 Denpasar'
  const description = searchParams.get('description') || 'Unggul dalam Prestasi, Berkarakter Pancasila'
  const type = searchParams.get('type') || 'default'

  // Color schemes based on type
  const colorSchemes: Record<string, { bg: string; accent: string }> = {
    default: { bg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', accent: '#fbbf24' },
    news: { bg: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', accent: '#60a5fa' },
    announcement: { bg: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', accent: '#fbbf24' },
    extracurricular: { bg: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)', accent: '#86efac' },
    facility: { bg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', accent: '#c4b5fd' },
    staff: { bg: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)', accent: '#a5b4fc' },
  }

  const colors = colorSchemes[type] || colorSchemes.default

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: colors.bg,
          padding: '60px',
        }}
      >
        {/* Logo/Brand Area */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1e3a8a',
            }}
          >
            S1
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
              SMAN 1 Denpasar
            </span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
              Unggul dalam Prestasi, Berkarakter Pancasila
            </span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            transform: 'translate(50%, -50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            right: '200px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            transform: 'translate(0, 50%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '900px',
          }}
        >
          {/* Type Badge */}
          {type !== 'default' && (
            <div
              style={{
                display: 'flex',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  background: colors.accent,
                  color: '#1e3a8a',
                  padding: '8px 20px',
                  borderRadius: '100px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                }}
              >
                {type === 'news' && 'Berita'}
                {type === 'announcement' && 'Pengumuman'}
                {type === 'extracurricular' && 'Ekstrakurikuler'}
                {type === 'facility' && 'Fasilitas'}
                {type === 'staff' && 'Staff & Guru'}
              </span>
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontSize: title.length > 50 ? '48px' : '56px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              margin: 0,
              marginBottom: '20px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p
              style={{
                fontSize: '24px',
                color: 'rgba(255,255,255,0.9)',
                margin: 0,
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '18px',
          }}
        >
          <span>sman1denpasar.sch.id</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
