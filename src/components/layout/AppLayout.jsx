import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '../common/Toast';
import { X } from 'lucide-react';

export function AppLayout({ children, currentPath, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // If path is landing page ('/' or '/landing'), login, or signup, render without application sidebar
  const isPublicPage = currentPath === '/' || currentPath === '/landing' || currentPath === '/login' || currentPath === '/signup';

  if (isPublicPage) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
        {children}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Desktop Persistent Sidebar */}
      <div className="desktop-sidebar-container">
        <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(11, 19, 43, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex'
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{
              width: '280px',
              height: '100%',
              backgroundColor: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem' }}>
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  color: 'var(--text-muted)',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <X size={22} />
              </button>
            </div>
            <Sidebar
              currentPath={currentPath}
              onNavigate={onNavigate}
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar
          currentPath={currentPath}
          onNavigate={onNavigate}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main style={{ flex: 1, padding: '1.75rem 2rem' }} className="main-content-padding">
          <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </main>

        <footer
          style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div>
            <strong>LIBRA</strong> — Smart Library Catalog & Asset Management Platform. “Discover. Borrow. Track. Return.”
          </div>
          <div>
            Built with React & modern hooks • Ready for REST API integration
          </div>
        </footer>
      </div>

      <ToastContainer />

      <style>{`
        @media (max-width: 900px) {
          .desktop-sidebar-container {
            display: none !important;
          }
          .main-content-padding {
            padding: 1.25rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
