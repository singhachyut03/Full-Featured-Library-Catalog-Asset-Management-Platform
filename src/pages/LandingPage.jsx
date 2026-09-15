import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Zap,
  Users,
  AlertTriangle,
  BarChart3,
  Layers,
  ArrowRight,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export function LandingPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onNavigate('/catalog');
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Smart Catalog',
      desc: 'Natural language search, genre filters, and real-time inventory tracking for physical and digital books.',
      gradient: 'linear-gradient(135deg, #EAF2FF, #F0E9FF)',
      color: '#315BEA'
    },
    {
      icon: Zap,
      title: 'Quick Borrow',
      desc: 'Lightning-fast 3-step checkout with automatic due date calculation and instant receipt generation.',
      gradient: 'linear-gradient(135deg, #E9FFF8, #EAF3FF)',
      color: '#10B981'
    },
    {
      icon: Users,
      title: 'Member Management',
      desc: 'Complete student and faculty profiles, borrowing history, active loans, and department records.',
      gradient: 'linear-gradient(135deg, #F0E9FF, #FFF0F5)',
      color: '#8B7CF6'
    },
    {
      icon: AlertTriangle,
      title: 'Smart Alerts',
      desc: 'Automated overdue tracking, date-difference penalty calculation, and one-click reminder dispatches.',
      gradient: 'linear-gradient(135deg, #FFFBEB, #FEF2F2)',
      color: '#F59E0B'
    },
    {
      icon: BarChart3,
      title: 'Library Insights',
      desc: 'Real-time circulation metrics, category breakdowns, peak borrowing hours, and borrower leaderboards.',
      gradient: 'linear-gradient(135deg, #EAF2FF, #E9FFF8)',
      color: '#0284C7'
    },
    {
      icon: Layers,
      title: 'Asset Management',
      desc: 'Unified tracking for laptops, projectors, study pods, scanners, and facility equipment alongside books.',
      gradient: 'linear-gradient(135deg, #F5F3FF, #EAF2FF)',
      color: '#6366F1'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      {/* Public Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 2.5rem',
          maxWidth: '1360px',
          margin: '0 auto',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--bg-surface-translucent)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <Logo size="md" showTagline={false} onClick={() => onNavigate('/')} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => onNavigate('/catalog')}
            style={{
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.92rem',
              padding: '0.5rem 0.85rem'
            }}
          >
            Explore Catalog
          </button>
          <button
            onClick={() => onNavigate('/login')}
            style={{
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.92rem',
              padding: '0.5rem 0.85rem'
            }}
          >
            Sign In
          </button>
          <Button
            variant="primary"
            size="sm"
            iconRight={ArrowRight}
            onClick={() => onNavigate('/dashboard')}
          >
            Launch App
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '4rem 2rem 5rem',
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}
        >
          {/* Left Hero Content */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                border: '1px solid rgba(49, 91, 234, 0.2)'
              }}
            >
              <Sparkles size={16} />
              <span>Smart Library & Asset Platform</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.12,
                marginBottom: '1.25rem',
                color: 'var(--text-primary)'
              }}
            >
              More Books.<br />
              <span
                style={{
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Brighter Futures.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '520px'
              }}
            >
              Discover, borrow and manage books effortlessly with a smarter library experience. Powered by real-time circulation tracking, automated penalties, and modern asset management.
            </p>

            {/* Large Hero Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                position: 'relative',
                maxWidth: '520px',
                marginBottom: '1.75rem',
                boxShadow: 'var(--shadow-md)',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <Search
                size={22}
                style={{
                  position: 'absolute',
                  left: '18px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--primary)'
                }}
              />
              <input
                type="text"
                placeholder="Search by title, author, ISBN or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '56px',
                  paddingLeft: '54px',
                  paddingRight: '130px',
                  fontSize: '1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)'
                }}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  bottom: '6px',
                  borderRadius: 'var(--radius-full)',
                  padding: '0 1.25rem'
                }}
              >
                Search
              </Button>
            </form>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('/catalog')}
                iconRight={ArrowRight}
              >
                Explore Catalog
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('/signup')}
              >
                Become a Member
              </Button>
            </div>
          </div>

          {/* Right Hero Visual with Rounded Image and Decorative Elements */}
          <div style={{ position: 'relative' }}>
            {/* Soft background glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-20px',
                background: 'var(--gradient-hero)',
                borderRadius: '32px',
                filter: 'blur(30px)',
                opacity: 0.7,
                zIndex: 0
              }}
            />

            {/* Main Rounded Image Frame */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid rgba(255, 255, 255, 0.6)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Library with Books and Warm Lighting"
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              {/* Glassmorphism Floating Badge 1: Quick Borrow */}
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--mint)',
                    color: '#102A56',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Zap size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Quick Borrow Flow
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Issued in under 10 seconds
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Overdue engine */}
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  padding: '0.75rem 1.1rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <ShieldCheck size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  Automated Penalty Engine
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section
        style={{
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '2.5rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              10K+
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Curated Books
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--lavender)' }}>
              2K+
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Active Members
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--mint)' }}>
              99%
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Collection Availability
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--sky)' }}>
              24/7
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Digital Platform Access
            </div>
          </div>
        </div>
      </section>

      {/* Features Section: "Everything your library needs" */}
      <section
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '5rem 2rem'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em'
            }}
          >
            Everything your library needs.
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              maxWidth: '560px',
              margin: '0 auto'
            }}
          >
            Designed with thoughtful precision for librarians, students, and researchers alike.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={idx}
                hover={true}
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-lg)',
                    background: feat.gradient,
                    color: feat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={26} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {feat.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {feat.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quote / Call to Action */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '4.5rem 2rem',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div
            style={{
              fontStyle: 'italic',
              fontSize: '1.4rem',
              fontWeight: 600,
              color: 'var(--navy)',
              marginBottom: '1rem',
              lineHeight: 1.4
            }}
          >
            “Today a reader, tomorrow a leader.”
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>
            Transform your catalog management with LIBRA’s intelligent tracking today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('/dashboard')}
              iconRight={ArrowRight}
            >
              Open Librarian Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('/catalog')}
            >
              Browse Catalog
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
