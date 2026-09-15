import React, { useState } from 'react';
import { ArrowRight, User, Mail, Phone, Building, Lock } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useLibrary } from '../hooks/useLibrary';

export function SignUpPage({ onNavigate }) {
  const { addMember, setCurrentUser } = useLibrary();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    role: 'Student'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMember = {
      id: `MEM-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      role: formData.role,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      booksBorrowedCount: 0
    };

    addMember(newMember);
    setCurrentUser(newMember);
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
      <div style={{ width: '100%', maxWidth: '480px' }}>
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
              Become a Member
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Join LIBRA for unlimited catalog exploration and fast checkout.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Roy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Campus Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@campus.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Phone
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', paddingLeft: '38px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Research Scholar">Research Scholar</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Department
              </label>
              <div style={{ position: 'relative' }}>
                <Building size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science, AI, Design"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
              Complete Registration
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Already a member?{' '}
            <button onClick={() => onNavigate('/login')} style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign In
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
