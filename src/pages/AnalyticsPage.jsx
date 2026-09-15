import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Award,
  BookOpen,
  Users,
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function AnalyticsPage({ onNavigate }) {
  const { state, notifySuccess } = useLibrary();

  const [dateFilter, setDateFilter] = useState('30 Days'); // '7 Days' | '30 Days' | '3 Months' | '6 Months' | '1 Year'

  // Top Borrowed Books Ranking
  const topBooks = useMemo(() => {
    return [...state.books]
      .sort((a, b) => (b.borrowCountMonth || 0) - (a.borrowCountMonth || 0))
      .slice(0, 5);
  }, [state.books]);

  // Top Active Borrowers
  const topMembers = useMemo(() => {
    return [...state.members]
      .sort((a, b) => (b.booksBorrowedCount || 0) - (a.booksBorrowedCount || 0))
      .slice(0, 5);
  }, [state.members]);

  // Category Circulation
  const categoryStats = useMemo(() => {
    const counts = {};
    state.books.forEach((b) => {
      counts[b.genre] = (counts[b.genre] || 0) + (b.borrowCountMonth || 1);
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [state.books]);

  const totalBorrowsThisMonth = state.books.reduce((acc, b) => acc + (b.borrowCountMonth || 0), 0);

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Title,Author,Genre,Rating,Available,Total\n' +
      state.books
        .map(
          (b) =>
            `"${b.title}","${b.author}","${b.genre}",${b.rating},${b.availableCopies},${b.totalCopies}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `libra_circulation_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifySuccess('Report Exported', 'Circulation & inventory CSV downloaded.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Date Filters */}
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
            Library Analytics & Circulation
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Interactive circulation patterns, top volume readers, and category breakdowns.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Date Filter Pills */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '3px'
            }}
          >
            {['7 Days', '30 Days', '3 Months', '6 Months', '1 Year'].map((p) => (
              <button
                key={p}
                onClick={() => setDateFilter(p)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: dateFilter === p ? 'var(--primary)' : 'transparent',
                  color: dateFilter === p ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExport}
          >
            Export Report (.csv)
          </Button>
        </div>
      </div>

      {/* Circulation Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Monthly Borrows
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
            {totalBorrowsThisMonth}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>
            <TrendingUp size={14} />
            <span>+19.4% vs previous window</span>
          </div>
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Average Turnaround Time
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy)' }}>
            9.2 days
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across all 32 titles
          </div>
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            On-Time Return Rate
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--mint)' }}>
            91.8%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Only 8.2% past due date
          </div>
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Penalties Collected
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--lavender)' }}>
            ₹1,840
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            YTD institutional settlement
          </div>
        </Card>
      </div>

      {/* Circulation Wave & Trend Chart */}
      <Card style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '2px' }}>
              Circulation Volume & Demand Curve
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Total books borrowed vs returned across months
            </span>
          </div>
          <Badge variant="purple">Window: {dateFilter}</Badge>
        </div>

        {/* SVG Area Chart */}
        <div style={{ width: '100%', height: '240px' }}>
          <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="20" y1="40" x2="580" y2="40" stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <line x1="20" y1="90" x2="580" y2="90" stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <line x1="20" y1="140" x2="580" y2="140" stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <line x1="20" y1="190" x2="580" y2="190" stroke="var(--border-subtle)" />

            {/* Shaded Area */}
            <path
              d="M 50 160 Q 150 120, 250 80 T 450 60 T 550 40 L 550 190 L 50 190 Z"
              fill="url(#areaGradient)"
            />

            {/* Line Curve */}
            <path
              d="M 50 160 Q 150 120, 250 80 T 450 60 T 550 40"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data Points with tooltips */}
            {[
              { x: 50, y: 160, label: 'May (210)' },
              { x: 150, y: 125, label: 'Jun (290)' },
              { x: 250, y: 80, label: 'Jul (380)' },
              { x: 350, y: 95, label: 'Aug (340)' },
              { x: 450, y: 60, label: 'Sep (460)' },
              { x: 550, y: 40, label: 'Oct (520 projected)' }
            ].map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="var(--primary)" strokeWidth="3">
                  <title>{pt.label}</title>
                </circle>
              </g>
            ))}
          </svg>
        </div>
      </Card>

      {/* Leaderboard Grids: Top Books & Top Members */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Top Borrowed Books */}
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Award size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Most Borrowed Books
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {topBooks.map((book, idx) => (
              <div
                key={book.id}
                onClick={() => onNavigate(`/book/${book.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-main)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: idx === 0 ? '#F59E0B' : idx === 1 ? '#94A3B8' : '#B45309',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{book.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{book.author}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.92rem' }}>
                    {book.borrowCountMonth}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>borrows/mo</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Most Active Members */}
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Users size={20} color="var(--lavender)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Top Member Borrowers
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {topMembers.map((member, idx) => (
              <div
                key={member.id}
                onClick={() => onNavigate(`/member/${member.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-main)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{member.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.department}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--lavender)', fontSize: '0.92rem' }}>
                    {member.booksBorrowedCount}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>lifetime loans</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
