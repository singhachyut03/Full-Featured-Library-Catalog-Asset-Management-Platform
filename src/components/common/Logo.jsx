import React from 'react';

export function Logo({ size = 'md', showTagline = false, onClick, className = '' }) {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 44
  };

  const textSizes = {
    sm: '1.1rem',
    md: '1.4rem',
    lg: '1.85rem'
  };

  const s = iconSizes[size] || iconSizes.md;

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          width: `${s}px`,
          height: `${s}px`,
          borderRadius: size === 'lg' ? '12px' : '9px',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
          flexShrink: 0
        }}
      >
        {/* Custom SVG: Minimal open book icon with subtle "L" stroke */}
        <svg
          width={s * 0.65}
          height={s * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Left page */}
          <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
          {/* Right page */}
          <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
          {/* Stylized "L" spine highlight */}
          <path d="M6 8v6h3" stroke="#8DD7FF" strokeWidth="2.4" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: textSizes[size] || textSizes.md,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              lineHeight: 1
            }}
          >
            LIBRA
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--primary)',
              background: 'var(--primary-light)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            SaaS
          </span>
        </div>
        {showTagline && (
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              marginTop: '2px',
              letterSpacing: '-0.01em'
            }}
          >
            Discover. Borrow. Track. Return.
          </span>
        )}
      </div>
    </div>
  );
}
