import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = SearchX,
  title = 'No results found',
  description = 'Try adjusting your search criteria, clearing active filters, or adding a new record.',
  actionLabel,
  onAction,
  actionIcon
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--border-subtle)',
        margin: '1.5rem 0'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}
      >
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ maxWidth: '420px', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: actionLabel ? '1.5rem' : 0, lineHeight: 1.5 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} icon={actionIcon}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
