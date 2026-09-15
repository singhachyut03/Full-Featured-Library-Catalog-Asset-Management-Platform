/**
 * LIBRA - Smart Multi-Attribute & Natural Language Search Engine
 * Supports natural language patterns (e.g. "books under 400 pages", "psychology", "programming")
 * plus keyword matching across title, author, isbn, genre, tags, and descriptions.
 */

/**
 * Parses query for natural language constraints
 * e.g., "under 400 pages", "less than 300 pages", "over 500 pages"
 */
function extractQueryFilters(queryString = '') {
  let cleanQuery = queryString.toLowerCase().trim();
  let maxPages = null;
  let minPages = null;

  // Check for "under X pages" or "less than X pages"
  const underMatch = cleanQuery.match(/(?:under|less than|below)\s+(\d+)\s*(?:pages|page)?/);
  if (underMatch) {
    maxPages = parseInt(underMatch[1], 10);
    cleanQuery = cleanQuery.replace(underMatch[0], '').trim();
  }

  // Check for "over X pages" or "more than X pages"
  const overMatch = cleanQuery.match(/(?:over|more than|above)\s+(\d+)\s*(?:pages|page)?/);
  if (overMatch) {
    minPages = parseInt(overMatch[1], 10);
    cleanQuery = cleanQuery.replace(overMatch[0], '').trim();
  }

  // Filter out filler stop words
  const stopWords = ['books', 'book', 'about', 'for', 'similar', 'to', 'like', 'in', 'the', 'a', 'an'];
  const tokens = cleanQuery
    .split(/\s+/)
    .filter(token => token.length > 1 && !stopWords.includes(token));

  return { cleanQuery, tokens, maxPages, minPages };
}

/**
 * Evaluates book against multi-attribute criteria and natural language tokens
 */
export function filterBooks(books = [], query = '', filters = {}) {
  const {
    genre = 'All',
    availability = 'all', // 'all' | 'available' | 'reserved'
    minRating = 0,
    sortBy = 'popular' // 'popular' | 'recent' | 'title' | 'copies'
  } = filters;

  const { cleanQuery, tokens, maxPages, minPages } = extractQueryFilters(query);

  let filtered = books.filter(book => {
    // 1. Genre filter
    if (genre !== 'All' && book.genre.toLowerCase() !== genre.toLowerCase()) {
      return false;
    }

    // 2. Availability filter
    if (availability === 'available' && book.availableCopies <= 0) {
      return false;
    }
    if (availability === 'reserved' && book.availableCopies > 0) {
      return false;
    }

    // 3. Rating filter
    if (minRating > 0 && book.rating < minRating) {
      return false;
    }

    // 4. Page range constraints
    if (maxPages !== null && book.pages > maxPages) {
      return false;
    }
    if (minPages !== null && book.pages < minPages) {
      return false;
    }

    // 5. Query matching
    if (!cleanQuery) return true;

    // Check exact or substring matches in main fields
    const titleMatch = book.title.toLowerCase().includes(cleanQuery);
    const authorMatch = book.author.toLowerCase().includes(cleanQuery);
    const isbnMatch = (book.isbn || '').toLowerCase().includes(cleanQuery);
    const genreMatch = book.genre.toLowerCase().includes(cleanQuery);
    const descMatch = (book.description || '').toLowerCase().includes(cleanQuery);
    const tagMatch = (book.tags || []).some(tag => tag.toLowerCase().includes(cleanQuery));

    if (titleMatch || authorMatch || isbnMatch || genreMatch || descMatch || tagMatch) {
      return true;
    }

    // If tokens extracted, test if any meaningful token matches
    if (tokens.length > 0) {
      const allText = `${book.title} ${book.author} ${book.genre} ${book.description} ${(book.tags || []).join(' ')}`.toLowerCase();
      return tokens.some(tok => allText.includes(tok));
    }

    return false;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.borrowCountMonth || 0) - (a.borrowCountMonth || 0);
    }
    if (sortBy === 'recent') {
      return (b.publishYear || 0) - (a.publishYear || 0);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'copies') {
      return b.availableCopies - a.availableCopies;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  return filtered;
}

/**
 * Returns instant suggestions while typing
 */
export function getSearchSuggestions(books = [], input = '', limit = 5) {
  if (!input || input.trim().length < 2) return [];

  const clean = input.toLowerCase().trim();
  const suggestions = [];

  for (const book of books) {
    if (book.title.toLowerCase().includes(clean)) {
      suggestions.push({
        type: 'title',
        text: book.title,
        subtext: `by ${book.author} • ${book.genre}`,
        bookId: book.id
      });
    } else if (book.author.toLowerCase().includes(clean)) {
      if (!suggestions.some(s => s.text === book.author)) {
        suggestions.push({
          type: 'author',
          text: book.author,
          subtext: `Author • ${book.genre}`,
          bookId: book.id
        });
      }
    } else if (book.genre.toLowerCase().includes(clean)) {
      if (!suggestions.some(s => s.text === book.genre)) {
        suggestions.push({
          type: 'genre',
          text: book.genre,
          subtext: 'Genre category',
          genre: book.genre
        });
      }
    }

    if (suggestions.length >= limit) break;
  }

  return suggestions;
}
