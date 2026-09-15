import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  Moon,
  Sun,
  User,
  Shield,
  Bell,
  Sliders,
  Database,
  RefreshCw,
  Download,
  Check
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function SettingsPage({ onNavigate }) {
  const {
    state,
    updateSettings,
    toggleDarkMode,
    setThemeAccent,
    resetData,
    setCurrentUser,
    notifySuccess
  } = useLibrary();

  const [activeTab, setActiveTab] = useState('appearance'); // 'appearance' | 'profile' | 'rules' | 'data'

  const [profileForm, setProfileForm] = useState({
    name: state.currentUser?.name || '',
    email: state.currentUser?.email || '',
    role: state.currentUser?.role || '',
    department: state.currentUser?.department || ''
  });

  const [rulesForm, setRulesForm] = useState({
    penaltyPerDay: state.settings.penaltyPerDay || 10,
    gracePeriodDays: state.settings.gracePeriodDays || 0,
    standardBorrowDays: state.settings.standardBorrowDays || 14,
    maxBooksPerMember: state.settings.maxBooksPerMember || 5
  });

  const themePresets = [
    { id: 'ocean-blue', name: 'Ocean Blue', color: '#315BEA', desc: 'Default royal blue & sky accents' },
    { id: 'mint-fresh', name: 'Mint Fresh', color: '#10B981', desc: 'Invigorating emerald & mint greens' },
    { id: 'lavender-dream', name: 'Lavender Dream', color: '#8B7CF6', desc: 'Soft purple, lavender & pink tones' },
    { id: 'sky-minimal', name: 'Sky Minimal', color: '#0284C7', desc: 'Clean cyan & minimal slate blue' },
    { id: 'midnight-luxe', name: 'Midnight Luxe', color: '#6366F1', desc: 'Rich indigo & vivid violet glow' }
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser({
      ...state.currentUser,
      ...profileForm
    });
    notifySuccess('Profile Updated', 'Librarian account details saved.');
  };

  const handleSaveRules = (e) => {
    e.preventDefault();
    updateSettings({
      ...state.settings,
      ...rulesForm
    });
    notifySuccess('Rules Saved', 'Borrowing durations and penalty engine rate updated.');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `libra_full_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notifySuccess('Export Complete', 'Full library database downloaded as JSON.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all library records, books, and members to initial demo dataset?')) {
      resetData();
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Platform Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Personalize appearance, configure penalty rules, manage profile, and export data.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'appearance', label: 'Appearance & Themes', icon: Palette },
          { id: 'rules', label: 'Penalty & Circulation Rules', icon: Sliders },
          { id: 'profile', label: 'Account Profile', icon: User },
          { id: 'data', label: 'Data Management', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 600,
                backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: APPEARANCE & THEMES */}
      {activeTab === 'appearance' && (
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Light / Dark Mode */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Interface Mode
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Select between vibrant daylight surface or sleek deep navy dark mode.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '420px' }}>
              <button
                onClick={() => {
                  if (state.settings.darkMode) toggleDarkMode();
                }}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${!state.settings.darkMode ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: '#FFFFFF',
                  color: '#102A56',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <Sun size={22} color="#F59E0B" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Light Mode</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>Clean & crisp</div>
                </div>
              </button>

              <button
                onClick={() => {
                  if (!state.settings.darkMode) toggleDarkMode();
                }}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${state.settings.darkMode ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: '#0B132B',
                  color: '#F0F4FF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <Moon size={22} color="#8DD7FF" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Dark Mode</div>
                  <div style={{ fontSize: '0.75rem', color: '#8E9DB8' }}>Deep navy SaaS</div>
                </div>
              </button>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-subtle)', borderStyle: 'solid' }} />

          {/* 5 Accent Themes */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Color Accent Palette
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Changes buttons, badges, charts, and header highlights dynamically.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {themePresets.map((t) => {
                const isSelected = state.settings.theme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setThemeAccent(t.id)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--bg-main)',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: t.color,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                          }}
                        />
                        <strong style={{ fontSize: '0.95rem' }}>{t.name}</strong>
                      </div>
                      {isSelected && <Check size={18} color="var(--primary)" />}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {t.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* TAB 2: PENALTY RULES & CIRCULATION */}
      {activeTab === 'rules' && (
        <Card style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Circulation & Penalty Engine Rules
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              These parameters feed into the dynamic penalty calculations on checkouts and returns.
            </p>
          </div>

          <form onSubmit={handleSaveRules} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Penalty Rate (₹ per overdue day)
                </label>
                <input
                  type="number"
                  min="0"
                  value={rulesForm.penaltyPerDay}
                  onChange={(e) => setRulesForm({ ...rulesForm, penaltyPerDay: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Default is ₹10 per late calendar day.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Grace Period (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={rulesForm.gracePeriodDays}
                  onChange={(e) => setRulesForm({ ...rulesForm, gracePeriodDays: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Days after due date before penalties start counting.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Standard Borrow Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={rulesForm.standardBorrowDays}
                  onChange={(e) => setRulesForm({ ...rulesForm, standardBorrowDays: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Default loan period for Quick Borrow (typically 14 days).
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Max Books Allowed Per Member
                </label>
                <input
                  type="number"
                  min="1"
                  value={rulesForm.maxBooksPerMember}
                  onChange={(e) => setRulesForm({ ...rulesForm, maxBooksPerMember: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Cap on concurrent active checkouts per borrower.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type="submit" variant="primary" size="md">
                Save Rule Configurations
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 3: ACCOUNT PROFILE */}
      {activeTab === 'profile' && (
        <Card style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Account Profile
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Logged-in librarian administrator information.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Role Title
                </label>
                <input
                  type="text"
                  value={profileForm.role}
                  onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Department
                </label>
                <input
                  type="text"
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type="submit" variant="primary" size="md">
                Update Account Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 4: DATA MANAGEMENT & BACKUP */}
      {activeTab === 'data' && (
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Data Storage & Reset Controls
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              All library items, members, transactions, assets, and themes persist in browser LocalStorage.
            </p>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 2px 0' }}>
                Export Database Archive
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Download entire application state (books, members, loans, assets, settings) as JSON.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportJSON}
            >
              Export JSON Backup
            </Button>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 2px 0', color: 'var(--danger)' }}>
                Reset to Fresh Demo Data
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Restores initial 32 books, 16 members, 22 loans, and 12 assets. Ideal for clean portfolio presentations.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={RefreshCw}
              onClick={handleResetData}
            >
              Reset All Demo Data
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
