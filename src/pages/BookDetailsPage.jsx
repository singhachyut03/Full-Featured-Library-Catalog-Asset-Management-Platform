import React from 'react';
import {
  ArrowLeft,
  Star,
  BookOpen,
  Calendar,
  Layers,
  Heart,
  Zap,
  CheckCircle,
  Building,
  Globe,
  Share2
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';

export function BookDetailsPage({ bookId, onNavigate }) {
  const { state, toggleWishlist, notifyInfo } = useLibrary();

  const book = state.books.find((b) => b.id === bookId) || state.books[0];
  const isWishlisted = state.wishlist?.includes(book?.id);
  const isAvailable = book?.availableCopies > 0;

  // Find related books in same genre
  const relatedBooks = state.books
    .filter((b) => b.id !== book?.id && b.genre === book?.genre)
    .slice(0, 4);

  if (!book) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Book not found</h2>
        <Button variant="primary" onClick={() => onNavigate('/catalog')} style={{ marginTop: '1rem' }}>
          Back to Catalog
        </Button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    notifyInfo('Link Copied', 'Book catalog link copied to clipboard.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Back Button */}
      <div>
        <button
          onClick={() => onNavigate('/catalog')}
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
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* Main Book Detail Card */}
      <Card style={{ padding: '2.5rem 2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            alignItems: 'flex-start'
          }}
        >
          {/* Left: Large Book Cover */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '320px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-main)'
              }}
            >
              <img
                src={book.coverImage}
                alt={book.title}
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Quick Circulation Stats Pill */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={16} />
              <span>Borrowed {book.borrowCountMonth || 24} times this month</span>
            </div>
          </div>

          {/* Right: Book Metadata & Synopsis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                <Badge variant="purple" size="md">
                  {book.genre}
                </Badge>
                <Badge variant={isAvailable ? 'success' : 'danger'} dot={true}>
                  {isAvailable ? `${book.availableCopies} Copies Available` : 'Reserved'}
                </Badge>
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.5rem' }}>
                {book.title}
              </h1>

              <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                by <strong style={{ color: 'var(--text-primary)' }}>{book.author}</strong>
              </div>
            </div>

            {/* Star Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 800, fontSize: '1.05rem' }}>
                <Star size={20} fill="#F59E0B" color="#F59E0B" />
                <span>{book.rating}</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                ({book.ratingCount || 480} reader reviews)
              </span>
            </div>

            {/* Actions: Borrow & Wishlist */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
              <Button
                variant="primary"
                size="lg"
                icon={Zap}
                disabled={!isAvailable}
                onClick={() => onNavigate(`/borrow?bookId=${book.id}`)}
                style={{ minWidth: '180px' }}
              >
                {isAvailable ? 'Borrow Book Now' : 'Currently Unavailable'}
              </Button>

              <Button
                variant={isWishlisted ? 'danger' : 'outline'}
                size="lg"
                icon={Heart}
                onClick={() => toggleWishlist(book.id)}
              >
                {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                icon={Share2}
                onClick={handleShare}
              >
                Share
              </Button>
            </div>

            {/* Specification Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ISBN</span>
                <strong style={{ fontSize: '0.88rem' }}>{book.isbn || '978-0132350884'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Pages</span>
                <strong style={{ fontSize: '0.88rem' }}>{book.pages} pages</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Publisher</span>
                <strong style={{ fontSize: '0.88rem' }}>{book.publisher || 'Penguin'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Publication Year</span>
                <strong style={{ fontSize: '0.88rem' }}>{book.publishYear || 2020}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Language</span>
                <strong style={{ fontSize: '0.88rem' }}>{book.language || 'English'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Inventory</span>
                <strong style={{ fontSize: '0.88rem' }}>{book.totalCopies} copies</strong>
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Synopsis
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.96rem' }}>
                {book.description}
              </p>
            </div>

            {/* Tags */}
            {book.tags && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tags:</span>
                {book.tags.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* "You may also like" Section */}
      {relatedBooks.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            You may also like in {book.genre}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {relatedBooks.map((rel) => (
              <Card
                key={rel.id}
                hover={true}
                style={{ padding: '1rem', cursor: 'pointer' }}
                onClick={() => onNavigate(`/book/${rel.id}`)}
              >
                <img
                  src={rel.coverImage}
                  alt={rel.title}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}
                />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>
                  {rel.title}
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {rel.author}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 700 }}>
                    ★ {rel.rating}
                  </span>
                  <Badge variant={rel.availableCopies > 0 ? 'success' : 'danger'} size="sm">
                    {rel.availableCopies > 0 ? `${rel.availableCopies} available` : 'Out'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
