import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Star,
  BookOpen,
  Heart,
  Zap,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { useDebounce } from '../hooks/useDebounce';
import { filterBooks, getSearchSuggestions } from '../utils/searchEngine';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';

export function CatalogPage({ onNavigate, initialQuery = '' }) {
  const { state, addBook, toggleWishlist } = useLibrary();

  // Search and Filter States
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 250);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [availability, setAvailability] = useState('all'); // 'all' | 'available' | 'reserved'
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'recent' | 'title' | 'copies' | 'rating'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchBoxRef = useRef(null);

  // New Book Form State
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: 'Technology',
    totalCopies: 3,
    pages: 320,
    publisher: '',
    publishYear: 2024,
    description: '',
    coverImage: ''
  });

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const genres = [
    'All',
    'Technology',
    'Self-Help',
    'Business',
    'Fiction',
    'Psychology',
    'History',
    'Philosophy',
    'Non-Fiction'
  ];

  const searchPrompts = [
    'Books about psychology for beginners',
    'Programming books under 400 pages',
    'Self-improvement books similar to Atomic Habits'
  ];

  // Suggestions for auto-complete
  const suggestions = useMemo(() => {
    return getSearchSuggestions(state.books, query, 5);
  }, [state.books, query]);

  // Filtered Books using multi-attribute & natural language engine
  const filteredBooks = useMemo(() => {
    return filterBooks(state.books, debouncedQuery, {
      genre: selectedGenre,
      availability,
      sortBy
    });
  }, [state.books, debouncedQuery, selectedGenre, availability, sortBy]);

  const handleClearFilters = () => {
    setQuery('');
    setSelectedGenre('All');
    setAvailability('all');
    setSortBy('popular');
  };

  const handleAddBookSubmit = (e) => {
    e.preventDefault();
    addBook({
      ...newBook,
      availableCopies: Number(newBook.totalCopies),
      coverImage:
        newBook.coverImage ||
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'
    });
    setShowAddModal(false);
    setNewBook({
      title: '',
      author: '',
      isbn: '',
      genre: 'Technology',
      totalCopies: 3,
      pages: 320,
      publisher: '',
      publishYear: 2024,
      description: '',
      coverImage: ''
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
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
            Explore Our Collection
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Browse {state.books.length} curated volumes across science, literature, business, and tech.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowAddModal(true)}
          size="md"
        >
          + Add Book
        </Button>
      </div>

      {/* Smart Search Bar with Natural Language & Suggestions */}
      <div style={{ position: 'relative' }} ref={searchBoxRef}>
        <div
          style={{
            position: 'relative',
            boxShadow: 'var(--shadow-sm)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--primary)'
            }}
          />
          <input
            type="text"
            placeholder="Describe what you're looking for... e.g. 'programming books under 400 pages'"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            style={{
              width: '100%',
              height: '52px',
              paddingLeft: '48px',
              paddingRight: query ? '40px' : '16px',
              fontSize: '0.96rem',
              border: 'none',
              backgroundColor: 'transparent'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                padding: '4px'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '58px',
              left: 0,
              right: 0,
              zIndex: 45,
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              animation: 'fadeIn 0.15s ease-out'
            }}
          >
            <div
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                backgroundColor: 'var(--bg-main)'
              }}
            >
              Instant Suggestions
            </div>
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (s.bookId) {
                    onNavigate(`/book/${s.bookId}`);
                  } else {
                    setQuery(s.text);
                  }
                  setShowSuggestions(false);
                }}
                style={{
                  padding: '0.65rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  fontSize: '0.88rem'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>{s.text}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '8px', fontSize: '0.78rem' }}>
                    {s.subtext}
                  </span>
                </div>
                <Badge variant="neutral" size="sm">
                  {s.type}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Natural Language Prompt Pill Examples */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
            flexWrap: 'wrap',
            fontSize: '0.8rem'
          }}
        >
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} color="var(--primary)" />
            Try searching:
          </span>
          {searchPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setQuery(prompt)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              “{prompt}”
            </button>
          ))}
        </div>
      </div>

      {/* Filter Chips & Sorting Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem'
        }}
      >
        {/* Genre Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {genres.map((g) => {
            const isSelected = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                style={{
                  padding: '0.4rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  transition: 'all var(--transition-fast)'
                }}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters & Sort Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Availability */}
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
          >
            <option value="all">All Copies</option>
            <option value="available">🟢 Available Only</option>
            <option value="reserved">🔴 All Reserved</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Recently Added</option>
            <option value="title">Title (A - Z)</option>
            <option value="copies">Available Copies</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Book Grid or Empty State */}
      {filteredBooks.length === 0 ? (
        <EmptyState
          title="No books match your criteria"
          description="We couldn't find any books matching your search or active filters. Try refining terms or reset your filters."
          actionLabel="Clear All Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;
            const isWishlisted = state.wishlist?.includes(book.id);

            return (
              <Card
                key={book.id}
                hover={true}
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onClick={() => onNavigate(`/book/${book.id}`)}
              >
                {/* Book Cover Container with Hover Zoom */}
                <div
                  style={{
                    position: 'relative',
                    height: '240px',
                    backgroundColor: 'var(--bg-main)',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(book.id);
                    }}
                    aria-label="Toggle Wishlist"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)',
                      color: isWishlisted ? '#EF4444' : '#718096'
                    }}
                  >
                    <Heart
                      size={18}
                      fill={isWishlisted ? '#EF4444' : 'none'}
                      color={isWishlisted ? '#EF4444' : 'currentColor'}
                    />
                  </button>

                  {/* Genre Tag on Cover */}
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                    <Badge variant="purple" size="sm">
                      {book.genre}
                    </Badge>
                  </div>
                </div>

                {/* Book Details */}
                <div
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        marginBottom: '0.25rem',
                        lineHeight: 1.3,
                        color: 'var(--text-primary)'
                      }}
                    >
                      {book.title}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                      {book.author}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        marginBottom: '0.75rem'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontWeight: 700 }}>
                        <Star size={15} fill="#F59E0B" color="#F59E0B" />
                        {book.rating}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {book.pages} pages
                      </span>
                    </div>

                    {/* Copies availability badge */}
                    <div style={{ marginBottom: '1rem' }}>
                      <Badge
                        variant={isAvailable ? 'success' : 'danger'}
                        dot={true}
                        size="sm"
                      >
                        {isAvailable
                          ? `${book.availableCopies} copies available`
                          : 'Currently checked out'}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <Button
                      variant={isAvailable ? 'primary' : 'outline'}
                      size="sm"
                      disabled={!isAvailable}
                      icon={Zap}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`/borrow?bookId=${book.id}`);
                      }}
                      style={{ flex: 1 }}
                    >
                      {isAvailable ? 'Borrow' : 'Reserved'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add New Book Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Book to Collection"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddBookSubmit}>
              Save Book
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Book Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Clean Architecture"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Author *
              </label>
              <input
                type="text"
                required
                placeholder="Author name"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Genre *
              </label>
              <select
                value={newBook.genre}
                onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                style={{ width: '100%' }}
              >
                {genres.filter(g => g !== 'All').map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Total Copies
              </label>
              <input
                type="number"
                min="1"
                value={newBook.totalCopies}
                onChange={(e) => setNewBook({ ...newBook, totalCopies: parseInt(e.target.value, 10) || 1 })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Pages
              </label>
              <input
                type="number"
                min="1"
                value={newBook.pages}
                onChange={(e) => setNewBook({ ...newBook, pages: parseInt(e.target.value, 10) || 100 })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Year
              </label>
              <input
                type="number"
                value={newBook.publishYear}
                onChange={(e) => setNewBook({ ...newBook, publishYear: parseInt(e.target.value, 10) || 2024 })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              ISBN
            </label>
            <input
              type="text"
              placeholder="e.g. 978-0134494166"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={newBook.coverImage}
              onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Synopsis of the book..."
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
