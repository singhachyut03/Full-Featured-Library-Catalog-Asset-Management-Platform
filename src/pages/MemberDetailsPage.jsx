import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  BookOpen,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  Building
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { formatDate } from '../utils/formatters';
import { calculateDaysLate, calculatePenalty } from '../utils/penaltyEngine';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function MemberDetailsPage({ memberId, onNavigate }) {
  const { state, toggleMemberStatus } = useLibrary();

  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'history' | 'penalties'

  const member = state.members.find((m) => m.id === memberId) || state.members[0];

  if (!member) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Member not found</h2>
        <Button variant="primary" onClick={() => onNavigate('/members')} style={{ marginTop: '1rem' }}>
          Back to Members
        </Button>
      </div>
    );
  }

  // Transactions for this member
  const memberTransactions = state.transactions.filter((t) => t.memberId === member.id);
  const currentIssued = memberTransactions.filter((t) => t.status !== 'returned');
  const pastReturned = memberTransactions.filter((t) => t.status === 'returned');
  const overdueLoans = currentIssued.filter((t) => {
    return calculateDaysLate(t.dueDate, new Date(), state.settings.gracePeriodDays) > 0;
  });

  const totalPenaltiesPaid = pastReturned.reduce((acc, t) => acc + (t.penaltyPaid || 0), 0);
  const pendingPenalties = overdueLoans.reduce((acc, t) => {
    return acc + calculatePenalty(t.dueDate, new Date(), state.settings.penaltyPerDay, state.settings.gracePeriodDays);
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Back navigation */}
      <div>
        <button
          onClick={() => onNavigate('/members')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          <ArrowLeft size={18} />
          <span>Back to Members</span>
        </button>
      </div>

      {/* Member Profile Banner Card */}
      <Card style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={member.avatar}
              alt={member.name}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary-light)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                  {member.name}
                </h1>
                <Badge variant={member.status === 'active' ? 'success' : 'danger'} dot={true}>
                  {member.status === 'active' ? 'Active Account' : 'Suspended'}
                </Badge>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {member.id} • {member.department} • {member.role}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span>✉️ {member.email}</span>
                <span>📞 {member.phone}</span>
                <span>📅 Member since {formatDate(member.joinedDate)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate(`/borrow?memberId=${member.id}`)}
            >
              Issue Book to Member
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleMemberStatus(member.id, member.name, member.status)}
            >
              {member.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </div>

        {/* Member KPI Counters */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1.75rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Currently Issued</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              {currentIssued.length} books
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lifetime Borrowed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {member.booksBorrowedCount || memberTransactions.length} books
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overdue Count</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: overdueLoans.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {overdueLoans.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Penalties (Pending / Settled)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>
              ₹{pendingPenalties} / ₹{totalPenaltiesPaid}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        {[
          { id: 'current', label: `Currently Issued (${currentIssued.length})` },
          { id: 'history', label: `Borrowing History (${pastReturned.length})` },
          { id: 'penalties', label: 'Penalty Records' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: 600,
              backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CURRENTLY ISSUED */}
      {activeTab === 'current' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {currentIssued.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No books currently checked out by this member.
            </div>
          ) : (
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Book Title</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Issue Date</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Due Date</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Overdue Status</th>
                    <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentIssued.map((tx) => {
                    const late = calculateDaysLate(tx.dueDate, new Date(), state.settings.gracePeriodDays);
                    return (
                      <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>{tx.bookTitle}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>{formatDate(tx.issueDate)}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>{formatDate(tx.dueDate)}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <Badge variant={late > 0 ? 'danger' : 'success'} size="sm" dot={true}>
                            {late > 0 ? `${late} days overdue` : 'On Schedule'}
                          </Badge>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={RotateCcw}
                            onClick={() => onNavigate('/return')}
                          >
                            Return Book
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB 2: PAST BORROWING HISTORY */}
      {activeTab === 'history' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {pastReturned.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No completed return history recorded for this member.
            </div>
          ) : (
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Book Title</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Borrowed Date</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Returned Date</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Condition</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Penalty Paid</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {pastReturned.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>{tx.bookTitle}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>{formatDate(tx.issueDate)}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>{formatDate(tx.returnDate)}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <Badge variant="neutral" size="sm">
                          {tx.condition || 'Good'}
                        </Badge>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                        {tx.penaltyPaid > 0 ? `₹${tx.penaltyPaid}` : '₹0'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {tx.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB 3: PENALTY RECORDS */}
      {activeTab === 'penalties' && (
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Penalty Assessment & Settlement Log
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pastReturned.filter(t => t.penaltyPaid > 0).length === 0 && overdueLoans.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Member has an exemplary record. Zero overdue penalties recorded.
              </div>
            ) : (
              <>
                {overdueLoans.map((ol) => (
                  <div
                    key={ol.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--danger-bg)',
                      border: '1px solid var(--danger-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--danger)' }}>PENDING: {ol.bookTitle}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Due on {formatDate(ol.dueDate)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--danger)' }}>
                      ₹{calculatePenalty(ol.dueDate, new Date(), state.settings.penaltyPerDay, state.settings.gracePeriodDays)}
                    </div>
                  </div>
                ))}

                {pastReturned.filter(t => t.penaltyPaid > 0).map((pt) => (
                  <div
                    key={pt.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>SETTLED: {pt.bookTitle}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Returned on {formatDate(pt.returnDate)} • {pt.notes || 'Fine paid at circulation desk'}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--success)' }}>
                      ₹{pt.penaltyPaid} (Paid)
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
