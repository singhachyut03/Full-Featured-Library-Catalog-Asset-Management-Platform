import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Clock,
  RotateCcw,
  User,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function NotificationsPage({ onNavigate }) {
  const {
    state,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications
  } = useLibrary();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const notifications = state.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle size={18} color="var(--danger)" />;
      case 'due_soon':
        return <Clock size={18} color="var(--warning)" />;
      case 'return':
        return <RotateCcw size={18} color="var(--success)" />;
      case 'member':
        return <User size={18} color="var(--primary)" />;
      case 'asset':
        return <Layers size={18} color="var(--lavender)" />;
      default:
        return <Bell size={18} color="var(--primary)" />;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Notifications Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Circulation alerts, overdue updates, and system messages ({unreadCount} unread).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={CheckCheck}
              onClick={markAllNotificationsRead}
            >
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={clearNotifications}
              style={{ color: 'var(--text-muted)' }}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            backgroundColor: filter === 'all' ? 'var(--primary)' : 'transparent',
            color: filter === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            backgroundColor: filter === 'unread' ? 'var(--primary)' : 'transparent',
            color: filter === 'unread' ? '#FFFFFF' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filtered.length === 0 ? (
          <Card style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={36} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>
              All caught up!
            </h3>
            <p style={{ fontSize: '0.88rem', margin: 0 }}>
              No notifications matching the current filter.
            </p>
          </Card>
        ) : (
          filtered.map((item) => (
            <Card
              key={item.id}
              hover={true}
              style={{
                padding: '1.25rem',
                backgroundColor: item.read ? 'var(--bg-surface)' : 'var(--primary-light)',
                border: `1px solid ${item.read ? 'var(--border-subtle)' : 'rgba(49, 91, 234, 0.25)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                cursor: item.actionUrl ? 'pointer' : 'default'
              }}
              onClick={() => {
                if (!item.read) markNotificationRead(item.id);
                if (item.actionUrl) onNavigate(item.actionUrl);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-xs)',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {getIcon(item.type)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: item.read ? 600 : 800, margin: 0 }}>
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary)'
                        }}
                      />
                    )}
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 4px 0', lineHeight: 1.4 }}>
                    {item.message}
                  </p>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.timestamp}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {!item.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(item.id);
                    }}
                    title="Mark as read"
                    style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--primary)'
                    }}
                  >
                    <Check size={16} />
                  </button>
                )}
                {item.actionUrl && (
                  <ArrowRight size={16} color="var(--text-muted)" />
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
