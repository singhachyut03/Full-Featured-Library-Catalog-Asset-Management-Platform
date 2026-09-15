import React from 'react';

export function Card({
  children,
  className = '',
  style = {},
  hover = false,
  glass = false,
  padding = '1.5rem',
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`${hover ? 'card-hover' : ''} ${className}`}
      style={{
        backgroundColor: glass ? 'var(--bg-surface-translucent)' : 'var(--bg-surface)',
        backdropFilter: glass ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: glass ? 'blur(12px)' : 'none',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        padding: padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--transition-normal)',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
