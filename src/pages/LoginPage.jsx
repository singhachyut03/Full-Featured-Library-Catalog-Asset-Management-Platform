import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, UserCheck, Shield } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useLibrary } from '../hooks/useLibrary';
import { defaultUser } from '../data/initialData';

export function LoginPage({ onNavigate }) {
  const { setCurrentUser, notifySuccess } = useLibrary();
  const [email, setEmail] = useState('librarian@libra.edu');
  const [password, setPassword] = useState('••••••••');

  const handleLogin = (e) => {
    e.preventDefault();
    setCurrentUser(defaultUser);
    notifySuccess('Welcome Back', `Logged in as ${defaultUser.name} (${defaultUser.role}).`);
    onNavigate('/dashboard');
  };

  const handleDemoLibrarian = () => {
    setCurrentUser(defaultUser);
    notifySuccess('Demo Access', 'Signed in as Chief Librarian.');
    onNavigate('/dashboard');
  };

  const handleDemoStudent = () => {
    setCurrentUser({
      name: 'Priya Singh',
      email: 'priya.singh@campus.edu',
      role: 'Student Member',
      memberId: 'MEM-001',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    });
    notifySuccess('Student Access', 'Signed in as Priya Singh.');
    onNavigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'var(--gradient-hero)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size="lg" showTagline={true} onClick={() => onNavigate('/')} />
        </div>

        <Card
          glass={true}
          style={{
            padding: '2.5rem 2rem',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Welcome Back
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Sign in to manage catalog, circulation and assets.
            </p>
          </div>

          {/* Quick 1-Click Demo Buttons */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                marginBottom: '0.65rem'
              }}
            >
              1-Click Demo Login
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Button
                variant="secondary"
                size="sm"
                icon={Shield}
                onClick={handleDemoLibrarian}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                Sign In as Chief Librarian (Admin)
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={UserCheck}
                onClick={handleDemoStudent}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                Sign In as Student (Priya Singh)
              </Button>
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '0.4rem',
                  color: 'var(--text-secondary)'
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
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
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)'
                  }}
                >
                  Password
                </label>
                <a href="#reset" onClick={(e) => e.preventDefault()} style={{ fontSize: '0.8rem' }}>
                  Forgot?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              iconRight={ArrowRight}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Sign In
            </Button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '0.88rem',
              color: 'var(--text-muted)'
            }}
          >
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('/signup')}
              style={{ color: 'var(--primary)', fontWeight: 700 }}
            >
              Register as Member
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
