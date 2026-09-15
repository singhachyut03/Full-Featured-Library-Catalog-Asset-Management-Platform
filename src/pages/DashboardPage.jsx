import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Clock,
  AlertTriangle,
  Zap,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Calendar,
  Layers
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatNumber } from '../utils/formatters';

export function DashboardPage({ onNavigate }) {
  const { state } = useLibrary();

  // Compute metrics dynamically from state
  const totalBooksCount = state.books.reduce((acc, b) => acc + (b.totalCopies || 1), 0);
  const activeMembersCount = state.members.filter(m => m.status === 'active').length;
  const activeLoans = state.transactions.filter(t => t.status !== 'returned');
  const overdueLoans = state.transactions.filter(t => t.status === 'overdue');
  const dueSoonLoans = state.transactions.filter(t => t.status === 'due_soon');

  // Compute category distribution
  const categoryCounts = {};
  state.books.forEach(b => {
    categoryCounts[b.genre] = (categoryCounts[b.genre] || 0) + (b.borrowCountMonth || 1);
  });
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCategoryVal = sortedCategories[0]?.[1] || 1;

  // Chart view toggle: 6-Month vs 12-Month
  const [chartPeriod, setChartPeriod] = useState('6M');

  const monthlyTrend = [
    { month: 'Apr', issued: 210, returned: 185 },
    { month: 'May', issued: 275, returned: 240 },
    { month: 'Jun', issued: 310, returned: 290 },
    { month: 'Jul', issued: 380, returned: 345 },
    { month: 'Aug', issued: 420, returned: 390 },
    { month: 'Sep', issued: 460, returned: 412 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Dashboard Greeting Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingBottom: '0.5rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Welcome back, {state.currentUser?.name?.split(' ')[0] || 'Librarian'} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Here’s what’s happening in your library today. Your library, intelligently organized.
          </p>
        </div>

        {/* Quick Command Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="md"
            icon={Zap}
            onClick={() => onNavigate('/borrow')}
            style={{ boxShadow: '0 4px 14px var(--primary-glow)' }}
          >
            Quick Borrow
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={RotateCcw}
            onClick={() => onNavigate('/return')}
          >
            Return Book
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={Plus}
            onClick={() => onNavigate('/catalog')}
          >
            + Add Book
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <StatCard
          title="Total Books"
          value={formatNumber(totalBooksCount)}
          icon={BookOpen}
          trend="+14% new"
          trendPositive={true}
          accentColor="var(--primary)"
          onClick={() => onNavigate('/catalog')}
        />
        <StatCard
          title="Active Members"
          value={formatNumber(activeMembersCount)}
          icon={Users}
          trend="+8% this term"
          trendPositive={true}
          accentColor="var(--lavender)"
          onClick={() => onNavigate('/members')}
        />
        <StatCard
          title="Currently Issued"
          value={formatNumber(activeLoans.length)}
          icon={Clock}
          trend="+18% volume"
          trendPositive={true}
          accentColor="var(--mint)"
          onClick={() => onNavigate('/overdue')}
        />
        <StatCard
          title="Needs Attention (Overdue)"
          value={formatNumber(overdueLoans.length)}
          icon={AlertTriangle}
          trend={overdueLoans.length > 0 ? `${overdueLoans.length} pending` : 'All clear'}
          trendPositive={overdueLoans.length === 0}
          accentColor="var(--danger)"
          bgGradient="linear-gradient(135deg, rgba(239, 68, 68, 0.04), var(--bg-surface))"
          onClick={() => onNavigate('/overdue')}
        />
      </div>

      {/* ====================================================
          LIBRARY PULSE & INTELLIGENT INSIGHTS
          ==================================================== */}
      <Card
        style={{
          background: 'var(--gradient-card-pulse)',
          border: '1px solid var(--border-subtle)',
          padding: '1.75rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Activity size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                LIBRARY PULSE
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Real-time circulation metrics generated from local dataset
              </span>
            </div>
          </div>

          <Badge variant="purple" dot={true}>
            Live Monitoring
          </Badge>
        </div>

        {/* 4 Insight Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}
        >
          <div
            style={{
              padding: '1rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem' }}>
              GROWTH TREND
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              Technology borrowing increased <strong>24%</strong> this month.
            </div>
          </div>

          <div
            style={{
              padding: '1rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--lavender)', marginBottom: '0.35rem' }}>
              TOP CATEGORY
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {sortedCategories[0]?.[0] || 'Self-Help'} is currently the most borrowed category.
            </div>
          </div>

          <div
            style={{
              padding: '1rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.35rem' }}>
              UPCOMING RETURNS
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              <strong>{dueSoonLoans.length || 3} books</strong> are due within the next 48 hours.
            </div>
          </div>

          <div
            style={{
              padding: '1rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--mint)', marginBottom: '0.35rem' }}>
              CIRCULATION PEAK
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              Peak borrowing hours: <strong>4:00 PM – 6:00 PM</strong> daily.
            </div>
          </div>
        </div>
      </Card>

      {/* Main Charts & Activity Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Chart 1: Books Issued vs Returned */}
        <Card style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2px' }}>
                Books Issued vs Returned
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Circulation comparison over time
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--primary)' }} />
                Issued
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--mint)' }} />
                Returned
              </span>
            </div>
          </div>

          {/* Responsive SVG Bar Chart */}
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Horizontal Grid lines */}
              <line x1="30" y1="30" x2="480" y2="30" stroke="var(--border-subtle)" strokeDasharray="3 3" />
              <line x1="30" y1="80" x2="480" y2="80" stroke="var(--border-subtle)" strokeDasharray="3 3" />
              <line x1="30" y1="130" x2="480" y2="130" stroke="var(--border-subtle)" strokeDasharray="3 3" />
              <line x1="30" y1="180" x2="480" y2="180" stroke="var(--border-subtle)" />

              {/* Bars for each month */}
              {monthlyTrend.map((d, i) => {
                const x = 50 + i * 75;
                const issuedHeight = (d.issued / 500) * 150;
                const returnedHeight = (d.returned / 500) * 150;
                return (
                  <g key={i}>
                    {/* Issued Bar */}
                    <rect
                      x={x}
                      y={180 - issuedHeight}
                      width="20"
                      height={issuedHeight}
                      rx="4"
                      fill="var(--primary)"
                    >
                      <title>{`Issued: ${d.issued}`}</title>
                    </rect>
                    {/* Returned Bar */}
                    <rect
                      x={x + 24}
                      y={180 - returnedHeight}
                      width="20"
                      height={returnedHeight}
                      rx="4"
                      fill="var(--mint)"
                    >
                      <title>{`Returned: ${d.returned}`}</title>
                    </rect>
                    {/* Month Label */}
                    <text
                      x={x + 22}
                      y="196"
                      fontSize="11"
                      fill="var(--text-muted)"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {d.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Card>

        {/* Chart 2: Most Borrowed Categories */}
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2px' }}>
              Most Borrowed Categories
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Demand breakdown across genres
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {sortedCategories.map(([category, count], idx) => {
              const pct = Math.round((count / maxCategoryVal) * 100);
              const barGradients = [
                'var(--gradient-primary)',
                'linear-gradient(90deg, #6EDCC5, #315BEA)',
                'linear-gradient(90deg, #8B7CF6, #B8A7FF)',
                'linear-gradient(90deg, #8DD7FF, #315BEA)',
                'linear-gradient(90deg, #F4B8D8, #8B7CF6)'
              ];

              return (
                <div key={idx}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      marginBottom: '0.35rem'
                    }}
                  >
                    <span>{category}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>
                      {count} borrows
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-main)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        borderRadius: 'var(--radius-full)',
                        background: barGradients[idx % barGradients.length],
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Activity Live Feed & Quick Overdue Alert Table */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Recent Activity List */}
        <Card style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Recent Activity
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => onNavigate('/notifications')}>
              View all
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Priya Singh returned “Atomic Habits”</span>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>2 min ago • On time</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Rohan Verma issued “Clean Code”</span>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>15 min ago • Due in 14 days</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>“Dune” is 8 days overdue</span>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>1 hour ago • Vikram Malhotra (₹80 fee)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(139, 124, 246, 0.12)', color: 'var(--lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>New member Zoya Qureshi registered</span>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>3 hours ago • Business Dept</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Needs Attention Quick Action Panel */}
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="var(--danger)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  Needs Attention
                </h3>
              </div>
              <Badge variant="danger">{overdueLoans.length} Overdue</Badge>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Outstanding loans requiring reminders or penalty settlement. Automated SMS/Email notices can be dispatched in one click.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {overdueLoans.slice(0, 3).map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>{tx.bookTitle}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {tx.memberName} • {tx.daysOverdue} days late
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--danger)' }}>
                      ₹{tx.calculatedPenalty}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="md"
            iconRight={ArrowRight}
            onClick={() => onNavigate('/overdue')}
            style={{ marginTop: '1.25rem', width: '100%' }}
          >
            Open Overdue Action Center
          </Button>
        </Card>
      </div>
    </div>
  );
}
