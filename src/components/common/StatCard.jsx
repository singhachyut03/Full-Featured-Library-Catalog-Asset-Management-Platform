import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendPositive = true,
  subtitle = 'vs last month',
  accentColor = 'var(--primary)',
  bgGradient,
  onClick
}) {
  return (
    <Card
      hover={true}
      onClick={onClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: bgGradient || 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        padding: '1.4rem 1.5rem'
      }}
    >
      {/* Decorative ambient light circle */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: accentColor,
          opacity: 0.08,
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
      </div>

      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              fontWeight: 700,
              color: trendPositive ? 'var(--success)' : 'var(--danger)'
            }}
          >
            {trendPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>
        </div>
      )}
    </Card>
  );
}
