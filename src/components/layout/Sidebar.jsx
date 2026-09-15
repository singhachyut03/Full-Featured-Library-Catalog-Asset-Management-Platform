import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Zap,
  RotateCcw,
  AlertTriangle,
  Users,
  Layers,
  BarChart3,
  Bell,
  Settings,
  Compass,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useLibrary } from '../../hooks/useLibrary';

export function Sidebar({ currentPath, onNavigate, onCloseMobile }) {
  const { state, setCurrentUser } = useLibrary();

  // Compute live badges
  const overdueCount = state.transactions.filter(t => t.status === 'overdue').length;
  const unreadNotifCount = state.notifications.filter(n => !n.read).length;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Explore Catalog', path: '/catalog', icon: BookOpen },
    { label: 'Quick Borrow', path: '/borrow', icon: Zap, highlight: true },
    { label: 'Return Book', path: '/return', icon: RotateCcw },
    {
      label: 'Needs Attention',
      path: '/overdue',
      icon: AlertTriangle,
      badge: overdueCount > 0 ? overdueCount : null,
      badgeVariant: 'danger'
    },
    { label: 'Members', path: '/members', icon: Users },
    { label: 'Library Assets', path: '/assets', icon: Layers },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotifCount > 0 ? unreadNotifCount : null,
      badgeVariant: 'primary'
    },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Public Showcase', path: '/', icon: Compass, subtle: true }
  ];

  const handleNav = (path) => {
    onNavigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    onNavigate('/login');
  };

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        height: '100vh',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        userSelect: 'none'
      }}
    >
      {/* Header / Logo */}
      <div
        style={{
          padding: '1.4rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Logo
          size="md"
          showTagline={false}
          onClick={() => handleNav('/dashboard')}
        />
      </div>

      {/* Navigation List */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem 0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem'
        }}
      >
        <div
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            padding: '0.4rem 0.65rem 0.2rem'
          }}
        >
          Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path ||
            (item.path !== '/' && currentPath.startsWith(item.path));

          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive
                  ? 'var(--primary-light)'
                  : item.highlight
                  ? 'rgba(110, 220, 197, 0.12)'
                  : 'transparent',
                color: isActive
                  ? 'var(--primary)'
                  : item.subtle
                  ? 'var(--text-muted)'
                  : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                transition: 'all var(--transition-fast)',
                border: 'none',
                width: '100%',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = item.highlight
                    ? 'rgba(110, 220, 197, 0.12)'
                    : 'transparent';
                  e.currentTarget.style.color = item.subtle
                    ? 'var(--text-muted)'
                    : 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon
                  size={18}
                  color={
                    isActive
                      ? 'var(--primary)'
                      : item.highlight
                      ? 'var(--mint)'
                      : 'currentColor'
                  }
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  style={{
                    backgroundColor:
                      item.badgeVariant === 'danger'
                        ? 'var(--danger)'
                        : 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    lineHeight: 1
                  }}
                >
                  {item.badge}
                </span>
              )}

              {item.highlight && !item.badge && (
                <span
                  style={{
                    backgroundColor: 'var(--mint)',
                    color: '#102A56',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 5px',
                    borderRadius: '4px'
                  }}
                >
                  FAST
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section & Quick Action */}
      <div
        style={{
          padding: '0.85rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}
      >
        {state.currentUser ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-main)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                minWidth: 0
              }}
              onClick={() => handleNav('/settings')}
            >
              <img
                src={state.currentUser.avatar}
                alt={state.currentUser.name}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--primary-light)',
                  flexShrink: 0
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {state.currentUser.name}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {state.currentUser.role}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout / Switch User"
              style={{
                color: 'var(--text-muted)',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleNav('/login')}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
}
