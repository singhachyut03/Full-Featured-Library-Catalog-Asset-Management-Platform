import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { calculatePenalty, calculateDaysLate } from '../utils/penaltyEngine';
import { formatDate } from '../utils/formatters';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function ReturnBookPage({ onNavigate }) {
  const { state, returnBook } = useLibrary();

  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [condition, setCondition] = useState('Good');
  const [notes, setNotes] = useState('');
  const [returnSuccess, setReturnSuccess] = useState(false);
  const [lastReturnedInfo, setLastReturnedInfo] = useState(null);

  // Active loans list (issued, overdue, due_soon)
  const activeLoans = useMemo(() => {
    return state.transactions.filter((t) => t.status !== 'returned');
  }, [state.transactions]);

  // Filtered active loans
  const filteredLoans = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return activeLoans;
    return activeLoans.filter(
      (t) =>
        t.bookTitle.toLowerCase().includes(q) ||
        t.memberName.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.memberId.toLowerCase().includes(q)
    );
  }, [activeLoans, search]);

  // Computed penalty for the currently selected loan
  const currentDaysLate = selectedTx
    ? calculateDaysLate(selectedTx.dueDate, new Date(), state.settings.gracePeriodDays)
    : 0;

  const currentPenalty = selectedTx
    ? calculatePenalty(
        selectedTx.dueDate,
        new Date(),
        state.settings.penaltyPerDay,
        state.settings.gracePeriodDays,
        condition
      )
    : 0;

  const handleConfirmReturn = () => {
    if (!selectedTx) return;

    returnBook(selectedTx.id, condition, notes, currentPenalty);

    setLastReturnedInfo({
      bookTitle: selectedTx.bookTitle,
      memberName: selectedTx.memberName,
      daysLate: currentDaysLate,
      penalty: currentPenalty,
      condition
    });
    setReturnSuccess(true);
    setSelectedTx(null);
    setNotes('');
    setCondition('Good');
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Return Book
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Inspect book condition, calculate dynamic overdue penalties, and restore catalog availability.
        </p>
      </div>

      {/* Success Notification Banner */}
      {returnSuccess && lastReturnedInfo && (
        <Card
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--success-bg)',
            borderColor: 'var(--success-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                ✓ Return Completed
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                “{lastReturnedInfo.bookTitle}” returned by {lastReturnedInfo.memberName} (Condition: {lastReturnedInfo.condition}).
                {lastReturnedInfo.penalty > 0
                  ? ` Overdue fee ₹${lastReturnedInfo.penalty} recorded.`
                  : ' No penalty charged.'}
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setReturnSuccess(false)}>
            Dismiss
          </Button>
        </Card>
      )}

      {/* Search Input for Active Loans */}
      <Card style={{ padding: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
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
            placeholder="Search member or book title to return..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '42px', height: '46px' }}
          />
        </div>

        {/* List of Active Loans */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            Currently Borrowed Books ({filteredLoans.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto' }}>
            {filteredLoans.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No active loans match this search query.
              </div>
            ) : (
              filteredLoans.map((tx) => {
                const isSelected = selectedTx?.id === tx.id;
                const isLate = tx.status === 'overdue';

                return (
                  <div
                    key={tx.id}
                    onClick={() => {
                      setSelectedTx(tx);
                      setReturnSuccess(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected
                        ? 'var(--primary-light)'
                        : isLate
                        ? 'rgba(239, 68, 68, 0.04)'
                        : 'var(--bg-surface)',
                      border: `1px solid ${
                        isSelected
                          ? 'var(--primary)'
                          : isLate
                          ? 'var(--danger-border)'
                          : 'var(--border-subtle)'
                      }`,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                        {tx.bookTitle}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Borrower: <strong>{tx.memberName}</strong> • Due: {formatDate(tx.dueDate)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Badge variant={isLate ? 'danger' : 'info'} size="sm">
                        {isLate ? `${tx.daysOverdue || 1}d Overdue` : 'On Loan'}
                      </Badge>
                      <Button variant={isSelected ? 'primary' : 'secondary'} size="sm">
                        {isSelected ? 'Inspecting' : 'Select'}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Card>

      {/* Return Inspection & Penalty Form */}
      {selectedTx && (
        <Card style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Return Inspection & Settlement
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Selected Loan: <strong>{selectedTx.bookTitle}</strong> borrowed by <strong>{selectedTx.memberName}</strong>
            </p>
          </div>

          {/* Condition Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Book Condition:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
              {[
                { label: '🟢 Good', value: 'Good', fee: 'No fee' },
                { label: '🟡 Minor Damage', value: 'Minor Damage', fee: '+₹50 fee' },
                { label: '🔴 Damaged', value: 'Damaged', fee: '+₹150 fee' }
              ].map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCondition(c.value)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'left',
                    backgroundColor: condition === c.value ? 'var(--primary-light)' : 'var(--bg-main)',
                    border: `1px solid ${condition === c.value ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.fee}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Librarian Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Spine intact, cover slightly scuffed..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Dynamic Penalty Calculation Engine Card */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: currentPenalty > 0 ? 'var(--danger-bg)' : 'var(--success-bg)',
              border: `1px solid ${currentPenalty > 0 ? 'var(--danger-border)' : 'var(--success-border)'}`,
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {currentPenalty > 0 ? (
                  <ShieldAlert size={18} color="var(--danger)" />
                ) : (
                  <CheckCircle2 size={18} color="var(--success)" />
                )}
                <strong style={{ fontSize: '0.95rem' }}>
                  {currentPenalty > 0 ? 'Penalty Applied' : 'No Overdue Penalty'}
                </strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Due Date: {formatDate(selectedTx.dueDate)} • Days Late: <strong>{currentDaysLate} days</strong>
                {state.settings.penaltyPerDay > 0 && ` (Rate: ₹${state.settings.penaltyPerDay}/day)`}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Calculated Fee
              </div>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: currentPenalty > 0 ? 'var(--danger)' : 'var(--success)'
                }}
              >
                ₹{currentPenalty}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="outline" size="md" onClick={() => setSelectedTx(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={RotateCcw}
              onClick={handleConfirmReturn}
            >
              Confirm Return
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
