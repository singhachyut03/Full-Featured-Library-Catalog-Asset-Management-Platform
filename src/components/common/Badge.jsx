import React from 'react';

export function Badge({
  children,
  variant = 'info', // 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral'
  dot = false,
  size = 'md', // 'sm' | 'md'
  className = '',
  style = {}
}) {
  const variantStyles = {
    success: {
      backgroundColor: 'var(--success-bg)',
      color: 'var(--success)',
      borderColor: 'var(--success-border)'
    },
    warning: {
      backgroundColor: 'var(--warning-bg)',
      color: 'var(--warning)',
      borderColor: 'var(--warning-border)'
    },
    danger: {
      backgroundColor: 'var(--danger-bg)',
      color: 'var(--danger)',
      borderColor: 'var(--danger-border)'
    },
    info: {
      backgroundColor: 'var(--info-bg)',
      color: 'var(--primary)',
      borderColor: 'var(--info-border)'
    },
    purple: {
      backgroundColor: 'rgba(139, 124, 246, 0.12)',
      color: 'var(--lavender)',
      borderColor: 'rgba(139, 124, 246, 0.25)'
    },
    neutral: {
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-secondary)',
      borderColor: 'var(--border-subtle)'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.info;

  const dotColors = {
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
    info: 'var(--primary)',
    purple: 'var(--lavender)',
    neutral: 'var(--text-muted)'
  };

  return (
    <span
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem',
        fontSize: size === 'sm' ? '0.72rem' : '0.8rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        border: '1px solid',
        lineHeight: 1.2,
        ...currentVariant,
        ...style
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: dotColors[variant] || dotColors.info,
            display: 'inline-block'
          }}
        />
      )}
      {children}
    </span>
  );
}
