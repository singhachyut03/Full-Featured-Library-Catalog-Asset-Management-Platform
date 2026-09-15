import React from 'react';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    border: '1px solid transparent',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    whiteSpace: 'nowrap'
  };

  const sizeStyles = {
    sm: { padding: '0.4rem 0.8rem', fontSize: '0.85rem' },
    md: { padding: '0.65rem 1.25rem', fontSize: '0.95rem' },
    lg: { padding: '0.85rem 1.75rem', fontSize: '1.05rem', borderRadius: 'var(--radius-lg)' }
  };

  const variantStyles = {
    primary: {
      background: 'var(--gradient-primary)',
      color: '#FFFFFF',
      boxShadow: 'var(--shadow-sm)'
    },
    secondary: {
      background: 'var(--primary-light)',
      color: 'var(--primary)',
      border: '1px solid rgba(49, 91, 234, 0.15)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-subtle)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)'
    },
    danger: {
      background: 'var(--danger)',
      color: '#FFFFFF'
    },
    success: {
      background: 'var(--success)',
      color: '#FFFFFF'
    }
  };

  const combinedStyle = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant]
  };

  return (
    <button
      type={type}
      style={combinedStyle}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn-${variant} ${className}`}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      {children}
      {IconRight && !loading && <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
    </button>
  );
}
