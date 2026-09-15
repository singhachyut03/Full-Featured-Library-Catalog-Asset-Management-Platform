import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Clock,
  Send,
  Bell,
  CheckCircle2,
  Calendar,
  DollarSign,
  RotateCcw,
  Check
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { calculateDaysLate, calculatePenalty } from '../utils/penaltyEngine';
import { formatDate } from '../utils/formatters';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function OverduePage({ onNavigate }) {
  const { state, sendReminder, notifySuccess } = useLibrary();

  const [activeTab, setActiveTab] = useState('overdue'); // 'all' | 'overdue' | 'due_soon' | 'returned'
  const [broadcasting, setBroadcasting] = useState(false);

  // Compute live penalties and days late dynamically
  const enrichedTransactions = useMemo(() => {
    return state.transactions.map((tx) => {
      const isReturned = tx.status === 'returned';
      const daysLate = isReturned
        ? tx.daysOverdue || 0
        : calculateDaysLate(tx.dueDate, new Date(), state.settings.gracePeriodDays);

      const penalty = isReturned
        ? tx.calculatedPenalty || 0
        : calculatePenalty(
            tx.dueDate,
            new Date(),
            state.settings.penaltyPerDay,
            state.settings.gracePeriodDays
          );

      let status = tx.status;
      if (!isReturned) {
        if (daysLate > 0) status = 'overdue';
        else status = tx.status === 'due_soon' ? 'due_soon' : 'issued';
      }

      return {
        ...tx,
        dynamicDaysLate: daysLate,
        dynamicPenalty: penalty,
        computedStatus: status
      };
    });
  }, [state.transactions, state.settings]);

  // Tab filtering
  const filteredList = useMemo(() => {
    if (activeTab === 'overdue') {
      return enrichedTransactions.filter((t) => t.computedStatus === 'overdue');
    }
    if (activeTab === 'due_soon') {
      return enrichedTransactions.filter((t) => t.computedStatus === 'due_soon');
    }
    if (activeTab === 'returned') {
      return enrichedTransactions.filter((t) => t.computedStatus === 'returned');
    }
    return enrichedTransactions;
  }, [enrichedTransactions, activeTab]);

  // Metrics summary
  const overdueItems = enrichedTransactions.filter((t) => t.computedStatus === 'overdue');
  const dueSoonItems = enrichedTransactions.filter((t) => t.computedStatus === 'due_soon');
  const totalPendingPenalties = overdueItems.reduce((acc, t) => acc + t.dynamicPenalty, 0);

  const handleBulkRemind = () => {
    setBroadcasting(true);
    setTimeout(() => {
      setBroadcasting(false);
      overdueItems.forEach((item) => {
        sendReminder(item.id);
      });
      notifySuccess('Broadcast Completed', `Reminders dispatched to all ${overdueItems.length} overdue members.`);
    }, 800);
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
            Needs Attention
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Monitor overdue circulation, compute dynamic late penalties, and dispatch member notices.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Bell}
          loading={broadcasting}
          onClick={handleBulkRemind}
          disabled={overdueItems.length === 0}
        >
          Dispatch Bulk Reminders ({overdueItems.length})
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
            Overdue Loans
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--danger)' }}>
            {overdueItems.length} books
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Require immediate attention
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
            Due Soon (Next 48h)
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--warning)' }}>
            {dueSoonItems.length} books
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Automated alerts scheduled
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
            Pending Penalties
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy)' }}>
            ₹{totalPendingPenalties}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Calculated @ ₹{state.settings.penaltyPerDay}/day
          </div>
        </Card>
      </div>

      {/* Automated Alert Notice Panel */}
      <Card
        style={{
          background: 'var(--gradient-mint-sky)',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <Bell size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: 0 }}>
              🚨 Automated Alert Dispatch Active
            </h4>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Overdue members are notified automatically via SMS & Email. Grace period: {state.settings.gracePeriodDays} days.
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('/settings')}
        >
          Configure Rules
        </Button>
      </Card>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        {[
          { id: 'all', label: 'All Records' },
          { id: 'overdue', label: `Overdue (${overdueItems.length})` },
          { id: 'due_soon', label: `Due Soon (${dueSoonItems.length})` },
          { id: 'returned', label: 'Returned History' }
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
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table / Card List */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>Book Title</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Borrower</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Due Date</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Overdue Days</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Penalty</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Status</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No records found in this category.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isLate = item.computedStatus === 'overdue';
                  const bookMeta = state.books.find((b) => b.id === item.bookId);

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: isLate ? 'rgba(239, 68, 68, 0.02)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {bookMeta?.coverImage && (
                            <img
                              src={bookMeta.coverImage}
                              alt={item.bookTitle}
                              style={{ width: '32px', height: '46px', objectFit: 'cover', borderRadius: '3px' }}
                            />
                          )}
                          <div>
                            <div>{item.bookTitle}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              TX ID: {item.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600 }}>{item.memberName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.memberId}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        {formatDate(item.dueDate)}
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        {item.dynamicDaysLate > 0 ? (
                          <span style={{ color: 'var(--danger)', fontWeight: 700 }}>
                            {item.dynamicDaysLate} days late
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>On time</span>
                        )}
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            color: item.dynamicPenalty > 0 ? 'var(--danger)' : 'var(--text-muted)'
                          }}
                        >
                          ₹{item.dynamicPenalty}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <Badge
                          variant={
                            item.computedStatus === 'overdue'
                              ? 'danger'
                              : item.computedStatus === 'due_soon'
                              ? 'warning'
                              : item.computedStatus === 'returned'
                              ? 'success'
                              : 'info'
                          }
                          size="sm"
                          dot={true}
                        >
                          {item.computedStatus === 'due_soon' ? 'Due Soon' : item.computedStatus}
                        </Badge>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          {item.computedStatus !== 'returned' && (
                            <Button
                              variant="outline"
                              size="sm"
                              icon={Send}
                              onClick={() => sendReminder(item.id)}
                            >
                              {item.remindedCount > 0
                                ? `Remind (${item.remindedCount})`
                                : 'Send Reminder'}
                            </Button>
                          )}
                          {item.computedStatus !== 'returned' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={RotateCcw}
                              onClick={() => onNavigate('/return')}
                            >
                              Return
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
