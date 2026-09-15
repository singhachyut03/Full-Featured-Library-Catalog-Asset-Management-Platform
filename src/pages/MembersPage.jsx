import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  UserCheck,
  UserX,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { formatDate } from '../utils/formatters';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export function MembersPage({ onNavigate }) {
  const { state, addMember, toggleMemberStatus } = useLibrary();

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    role: 'Student'
  });

  const departments = useMemo(() => {
    const deps = new Set(state.members.map((m) => m.department));
    return ['All', ...Array.from(deps)];
  }, [state.members]);

  const filteredMembers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return state.members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q);

      const matchesDep = departmentFilter === 'All' || m.department === departmentFilter;

      return matchesSearch && matchesDep;
    });
  }, [state.members, search, departmentFilter]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addMember({
      ...formData,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'Computer Science',
      role: 'Student'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
            Member Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Registered students, faculty, and research scholars ({state.members.length} total).
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowAddModal(true)}
        >
          + Add Member
        </Button>
      </div>

      {/* Search & Filter Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search members by name, ID or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '40px', height: '44px' }}
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={{ height: '44px' }}
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              Department: {d}
            </option>
          ))}
        </select>
      </div>

      {/* Members Grid / Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {filteredMembers.map((m) => {
          const isActive = m.status === 'active';
          // Count active borrows
          const activeBorrows = state.transactions.filter(
            (t) => t.memberId === m.id && t.status !== 'returned'
          ).length;

          return (
            <Card
              key={m.id}
              hover={true}
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={m.avatar}
                      alt={m.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                        {m.name}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {m.id} • {m.role}
                      </div>
                    </div>
                  </div>

                  <Badge variant={isActive ? 'success' : 'danger'} dot={true} size="sm">
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>🏢 <strong>{m.department}</strong></div>
                  <div>✉️ {m.email}</div>
                  <div>📞 {m.phone}</div>
                </div>

                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-around',
                    textAlign: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {m.booksBorrowedCount || 0}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Loans</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: activeBorrows > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>
                      {activeBorrows}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Currently Held</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatDate(m.joinedDate).split(' ')[1] || '2024'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Joined</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="primary"
                  size="sm"
                  style={{ flex: 1 }}
                  onClick={() => onNavigate(`/member/${m.id}`)}
                >
                  View Profile
                </Button>
                <Button
                  variant={isActive ? 'outline' : 'secondary'}
                  size="sm"
                  onClick={() => toggleMemberStatus(m.id, m.name, m.status)}
                >
                  {isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Enroll New Library Member"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddSubmit}>
              Enroll Member
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sanya Kapoor"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Campus Email *
            </label>
            <input
              type="email"
              required
              placeholder="sanya.k@campus.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Member Role
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
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Department
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Data Science, Electrical, Arts"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
