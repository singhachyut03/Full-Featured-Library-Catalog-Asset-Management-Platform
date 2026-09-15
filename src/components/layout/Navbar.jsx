import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Zap,
  Menu,
  Check,
  Palette,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useLibrary } from '../../hooks/useLibrary';
import { Button } from '../common/Button';

export function Navbar({ onOpenMobile, onNavigate, currentPath }) {
  const {
    state,
    toggleDarkMode,
    setThemeAccent,
    markNotificationRead,
    markAllNotificationsRead
  } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const themeRef = useRef(null);
  const notifRef = useRef(null);

  const unreadNotifications = state.notifications.filter(n => !n.read);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setShowThemeDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions = [
    { id: 'ocean-blue', name: 'Ocean Blue', color: '#315BEA' },
    { id: 'mint-fresh', name: 'Mint Fresh', color: '#10B981' },
    { id: 'lavender-dream', name: 'Lavender Dream', color: '#8B7CF6' },
    { id: 'sky-minimal', name: 'Sky Minimal', color: '#0284C7' },
    { id: 'midnight-luxe', name: 'Midnight Luxe', color: '#6366F1' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onNavigate('/catalog');
    }
  };

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: 'var(--bg-surface-translucent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        transition: 'background-color var(--transition-normal)'
      }}
    >
      {/* Left: Mobile Hamburger & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '520px' }}>
        <button
          onClick={onOpenMobile}
          className="mobile-only-btn"
          aria-label="Open mobile menu"
          style={{
            display: 'none', // Will be enabled via media query / flex
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <Menu size={22} />
        </button>

        {/* Global Quick Search Form */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search books, authors, ISBN or ask: 'psychology for beginners'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '38px',
              paddingRight: '12px',
              height: '40px',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem'
            }}
          />
        </form>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Quick Borrow Signature Action */}
        <Button
          variant="primary"
          size="sm"
          icon={Zap}
          onClick={() => onNavigate('/borrow')}
          style={{
            boxShadow: '0 2px 10px var(--primary-glow)'
          }}
        >
          Quick Borrow
        </Button>

        {/* Theme Accent Picker */}
        <div style={{ position: 'relative' }} ref={themeRef}>
          <button
            onClick={() => setShowThemeDropdown(!showThemeDropdown)}
            title="Change Theme Accent"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Palette size={18} />
          </button>

          {showThemeDropdown && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '210px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                zIndex: 50,
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  padding: '0.4rem 0.6rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Color Accents
              </div>
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setThemeAccent(opt.id);
                    setShowThemeDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-main)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: opt.color
                      }}
                    />
                    <span>{opt.name}</span>
                  </div>
                  {state.settings.theme === opt.id && (
                    <Check size={14} color="var(--primary)" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          title={state.settings.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {state.settings.darkMode ? (
            <Sun size={18} color="#F59E0B" />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            title="Notifications"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {unreadNotifications.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: 'var(--danger)',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-surface)'
                }}
              >
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '340px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden',
                zIndex: 50,
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-main)'
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Notifications ({unreadNotifications.length})
                </span>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      fontWeight: 600
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {state.notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.actionUrl) onNavigate(n.actionUrl);
                      setShowNotifDropdown(false);
                    }}
                    style={{
                      padding: '0.85rem 1rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: n.read ? 'transparent' : 'var(--primary-light)',
                      cursor: 'pointer',
                      transition: 'background-color var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: n.read ? 600 : 700 }}>
                        {n.title}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {n.timestamp}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: '0.65rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-main)',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <button
                  onClick={() => {
                    onNavigate('/notifications');
                    setShowNotifDropdown(false);
                  }}
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--primary)',
                    fontWeight: 600
                  }}
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-only-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
