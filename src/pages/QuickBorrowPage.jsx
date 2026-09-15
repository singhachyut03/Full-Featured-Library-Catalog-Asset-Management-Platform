import React, { useState, useMemo, useEffect } from 'react';
import {
  Zap,
  Search,
  CheckCircle2,
  Calendar,
  User,
  BookOpen,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLibrary } from '../hooks/useLibrary';
import { calculateDueDate } from '../utils/penaltyEngine';
import { formatDate } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export function QuickBorrowPage({ onNavigate, preSelectedBookId }) {
  const { state, issueBook } = useLibrary();

  // Current Step: 1 = Member, 2 = Book, 3 = Confirm, 4 = Success
  const [currentStep, setCurrentStep] = useState(preSelectedBookId ? 1 : 1);

  // Form selections
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBook, setSelectedBook] = useState(() => {
    return state.books.find((b) => b.id === preSelectedBookId) || null;
  });
  const [borrowDays, setBorrowDays] = useState(state.settings.standardBorrowDays || 14);
  const [issuedDueResult, setIssuedDueResult] = useState('');

  // Search filters for picker
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  // If pre-selected book provided, advance step
  useEffect(() => {
    if (preSelectedBookId && !selectedBook) {
      const b = state.books.find((bk) => bk.id === preSelectedBookId);
      if (b) setSelectedBook(b);
    }
  }, [preSelectedBookId, state.books, selectedBook]);

  // Filtered members for step 1
  const filteredMembers = useMemo(() => {
    const q = memberSearch.toLowerCase().trim();
    return state.members.filter(
      (m) =>
        m.status === 'active' &&
        (m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q))
    );
  }, [state.members, memberSearch]);

  // Filtered available books for step 2
  const filteredBooks = useMemo(() => {
    const q = bookSearch.toLowerCase().trim();
    return state.books.filter(
      (b) =>
        b.availableCopies > 0 &&
        (b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.isbn || '').includes(q) ||
          b.genre.toLowerCase().includes(q))
    );
  }, [state.books, bookSearch]);

  const calculatedDueDateStr = calculateDueDate(new Date(), borrowDays);

  const handleIssueBook = () => {
    if (!selectedMember || !selectedBook) return;

    issueBook(selectedBook.id, selectedMember.id, calculatedDueDateStr);
    setIssuedDueResult(calculatedDueDateStr);
    setCurrentStep(4);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleResetWorkflow = () => {
    setSelectedMember(null);
    setSelectedBook(null);
    setMemberSearch('');
    setBookSearch('');
    setCurrentStep(1);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
          <Zap size={16} />
          <span>SIGNATURE FEATURE</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          Quick Borrow
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Issue books to library members in 3 seamless steps with automatic due date computation.
        </p>
      </div>

      {/* 3-Step Visual Progress Tracker */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
          padding: '0.5rem 0'
        }}
      >
        {[
          { step: 1, label: 'Select Member', icon: User },
          { step: 2, label: 'Select Book', icon: BookOpen },
          { step: 3, label: 'Confirm & Issue', icon: CheckCircle2 }
        ].map((s) => {
          const Icon = s.icon;
          const isDone = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <div
              key={s.step}
              onClick={() => {
                if (s.step === 1) setCurrentStep(1);
                if (s.step === 2 && selectedMember) setCurrentStep(2);
                if (s.step === 3 && selectedMember && selectedBook) setCurrentStep(3);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isCurrent
                  ? 'var(--primary-light)'
                  : isDone
                  ? 'var(--success-bg)'
                  : 'var(--bg-surface)',
                border: `1px solid ${
                  isCurrent
                    ? 'var(--primary)'
                    : isDone
                    ? 'var(--success-border)'
                    : 'var(--border-subtle)'
                }`,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: isCurrent
                    ? 'var(--primary)'
                    : isDone
                    ? 'var(--success)'
                    : 'var(--bg-main)',
                  color: isCurrent || isDone ? '#FFFFFF' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}
              >
                {isDone ? '✓' : s.step}
              </div>
              <span
                style={{
                  fontSize: '0.88rem',
                  fontWeight: isCurrent || isDone ? 700 : 500,
                  color: isCurrent
                    ? 'var(--primary)'
                    : isDone
                    ? 'var(--success)'
                    : 'var(--text-secondary)'
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* STEP 1: SELECT MEMBER */}
      {currentStep === 1 && (
        <Card style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Step 1: Select Borrower
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Search member by name, ID or department.
            </p>
          </div>

          {/* Member Search */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search member name (e.g. Priya, Rohan, Dr. Aarav)..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '42px', height: '46px' }}
            />
          </div>

          {/* Member List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '380px', overflowY: 'auto' }}>
            {filteredMembers.map((m) => {
              const isSelected = selectedMember?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMember(m);
                    setCurrentStep(selectedBook ? 3 : 2);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={m.avatar}
                      alt={m.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{m.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {m.id} • {m.department} ({m.role})
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge variant="neutral" size="sm">
                      {m.booksBorrowedCount || 0} borrowed
                    </Badge>
                    <Button variant={isSelected ? 'primary' : 'secondary'} size="sm">
                      {isSelected ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* STEP 2: SELECT BOOK */}
      {currentStep === 2 && (
        <Card style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                Step 2: Select Book to Issue
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Borrower: <strong style={{ color: 'var(--primary)' }}>{selectedMember?.name}</strong>
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
              Change Member
            </Button>
          </div>

          {/* Book Search */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by book title, author, ISBN..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '42px', height: '46px' }}
            />
          </div>

          {/* Book Selection List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '380px', overflowY: 'auto' }}>
            {filteredBooks.map((b) => {
              const isSelected = selectedBook?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBook(b);
                    setCurrentStep(3);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>{b.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        by {b.author} • {b.genre}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge variant="success" size="sm">
                      {b.availableCopies} available
                    </Badge>
                    <Button variant={isSelected ? 'primary' : 'secondary'} size="sm">
                      {isSelected ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* STEP 3: CONFIRM BORROWING */}
      {currentStep === 3 && (
        <Card style={{ padding: '2.5rem 2rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Step 3: Review & Confirm Issue
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Verify checkout details. Return due date is calculated automatically.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            {/* Member Details */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                Borrower Details
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{selectedMember.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {selectedMember.id} • {selectedMember.department}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Email: {selectedMember.email}<br />
                Phone: {selectedMember.phone}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
                style={{ marginTop: '0.75rem', padding: 0 }}
              >
                Change borrower →
              </Button>
            </div>

            {/* Book Details */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                Book Details
              </div>
              <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '0.75rem' }}>
                <img
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  style={{ width: '48px', height: '68px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{selectedBook.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    by {selectedBook.author}
                  </div>
                  <Badge variant="purple" size="sm" style={{ marginTop: '4px' }}>
                    {selectedBook.genre}
                  </Badge>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                ISBN: {selectedBook.isbn || 'N/A'}<br />
                Remaining copies: <strong>{selectedBook.availableCopies} available</strong>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(2)}
                style={{ marginTop: '0.75rem', padding: 0 }}
              >
                Change book →
              </Button>
            </div>
          </div>

          {/* Due Date & Loan Duration Selection */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid rgba(49, 91, 234, 0.2)',
              marginBottom: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                Calculated Return Date
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)' }}>
                {formatDate(calculatedDueDateStr)}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Issue Date: {formatDate(new Date())}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Loan Duration:</span>
              <select
                value={borrowDays}
                onChange={(e) => setBorrowDays(Number(e.target.value))}
                style={{ backgroundColor: 'var(--bg-surface)' }}
              >
                <option value={7}>7 Days (1 Week)</option>
                <option value={14}>14 Days (Standard)</option>
                <option value={21}>21 Days (3 Weeks)</option>
                <option value={30}>30 Days (1 Month)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="outline" size="lg" onClick={handleResetWorkflow}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              icon={Zap}
              onClick={handleIssueBook}
              style={{ minWidth: '180px', boxShadow: '0 4px 14px var(--primary-glow)' }}
            >
              Issue Book Now
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: SUCCESS STATE WITH CELEBRATION */}
      {currentStep === 4 && (
        <Card
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              animation: 'pulseGlow 2s infinite'
            }}
          >
            <CheckCircle2 size={44} />
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            ✓ Book Successfully Issued
          </h2>

          <div
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--primary)',
              marginBottom: '1rem'
            }}
          >
            Return due on {formatDate(issuedDueResult)}
          </div>

          <p style={{ maxWidth: '460px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            <strong>{selectedMember?.name}</strong> has borrowed <strong>“{selectedBook?.title}”</strong>. Circulation count updated, automated reminders scheduled.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="primary"
              size="md"
              icon={Zap}
              onClick={handleResetWorkflow}
            >
              Issue Another Book
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('/catalog')}
            >
              Back to Catalog
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigate('/overdue')}
            >
              View Overdue Tracker
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
