import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useLibrary } from '../../hooks/useLibrary';

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 size={20} color="var(--success)" />,
    error: <AlertCircle size={20} color="var(--danger)" />,
    info: <Info size={20} color="var(--primary)" />
  };

  const borderColors = {
    success: 'var(--success-border)',
    error: 'var(--danger-border)',
    info: 'var(--info-border)'
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${borderColors[toast.type] || 'var(--border-subtle)'}`,
        boxShadow: 'var(--shadow-lg)',
        width: '360px',
        maxWidth: 'calc(100vw - 2rem)',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {icons[toast.type] || icons.info}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 2px 0', color: 'var(--text-primary)' }}>
            {toast.title}
          </h4>
        )}
        <p style={{ fontSize: '0.84rem', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          color: 'var(--text-muted)',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { state, removeToast } = useLibrary();
  const toasts = state?.toasts || [];

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}
