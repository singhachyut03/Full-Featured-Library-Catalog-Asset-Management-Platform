/**
 * LIBRA - Central Library Reducer
 * Manages synchronized state across books, members, transactions, assets, notifications, settings, and UI toasts.
 */

import {
  initialBooks,
  initialMembers,
  initialTransactions,
  initialAssets,
  initialNotifications,
  initialSettings,
  defaultUser
} from '../data/initialData';
import { calculateDueDate, calculatePenalty, calculateDaysLate } from '../utils/penaltyEngine';

export const initialState = {
  books: initialBooks,
  members: initialMembers,
  transactions: initialTransactions,
  assets: initialAssets,
  notifications: initialNotifications,
  settings: initialSettings,
  currentUser: defaultUser,
  wishlist: ['book-1', 'book-4', 'book-8'],
  toasts: []
};

export function libraryReducer(state, action) {
  switch (action.type) {
    // ----------------------------------------------------
    // BOOKS
    // ----------------------------------------------------
    case 'ADD_BOOK': {
      const newBook = {
        ...action.payload,
        id: action.payload.id || `book-${Date.now()}`,
        availableCopies: Number(action.payload.availableCopies ?? action.payload.totalCopies ?? 1),
        totalCopies: Number(action.payload.totalCopies ?? 1),
        rating: Number(action.payload.rating || 4.5),
        borrowCountMonth: 0
      };
      return {
        ...state,
        books: [newBook, ...state.books]
      };
    }

    case 'UPDATE_BOOK': {
      return {
        ...state,
        books: state.books.map(b => (b.id === action.payload.id ? { ...b, ...action.payload } : b))
      };
    }

    case 'DELETE_BOOK': {
      return {
        ...state,
        books: state.books.filter(b => b.id !== action.payload.id)
      };
    }

    // ----------------------------------------------------
    // MEMBERS
    // ----------------------------------------------------
    case 'ADD_MEMBER': {
      const newMember = {
        ...action.payload,
        id: action.payload.id || `MEM-${String(state.members.length + 1).padStart(3, '0')}`,
        status: action.payload.status || 'active',
        joinedDate: action.payload.joinedDate || new Date().toISOString().split('T')[0],
        booksBorrowedCount: 0
      };
      return {
        ...state,
        members: [newMember, ...state.members],
        notifications: [
          {
            id: `NOTIF-${Date.now()}`,
            type: 'member',
            severity: 'info',
            title: 'New Member Registered',
            message: `${newMember.name} (${newMember.department}) joined the library.`,
            timestamp: 'Just now',
            read: false,
            actionUrl: '/members'
          },
          ...state.notifications
        ]
      };
    }

    case 'UPDATE_MEMBER': {
      return {
        ...state,
        members: state.members.map(m => (m.id === action.payload.id ? { ...m, ...action.payload } : m))
      };
    }

    case 'TOGGLE_MEMBER_STATUS': {
      return {
        ...state,
        members: state.members.map(m =>
          m.id === action.payload.id
            ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' }
            : m
        )
      };
    }

    // ----------------------------------------------------
    // BORROW / ISSUE BOOK
    // ----------------------------------------------------
    case 'ISSUE_BOOK': {
      const { bookId, memberId, dueDate } = action.payload;
      const targetBook = state.books.find(b => b.id === bookId);
      const targetMember = state.members.find(m => m.id === memberId);

      if (!targetBook || !targetMember) return state;
      if (targetBook.availableCopies <= 0) return state;

      const issueDateStr = new Date().toISOString().split('T')[0];
      const dueDateStr = dueDate || calculateDueDate(issueDateStr, state.settings.standardBorrowDays);

      const newTx = {
        id: `TX-${Date.now().toString().slice(-6)}`,
        bookId: targetBook.id,
        bookTitle: targetBook.title,
        memberId: targetMember.id,
        memberName: targetMember.name,
        issueDate: issueDateStr,
        dueDate: dueDateStr,
        returnDate: null,
        status: 'issued',
        daysOverdue: 0,
        calculatedPenalty: 0,
        penaltyPaid: 0,
        remindedCount: 0,
        lastReminded: null
      };

      return {
        ...state,
        transactions: [newTx, ...state.transactions],
        books: state.books.map(b =>
          b.id === bookId
            ? {
                ...b,
                availableCopies: Math.max(0, b.availableCopies - 1),
                borrowCountMonth: (b.borrowCountMonth || 0) + 1
              }
            : b
        ),
        members: state.members.map(m =>
          m.id === memberId
            ? { ...m, booksBorrowedCount: (m.booksBorrowedCount || 0) + 1 }
            : m
        ),
        notifications: [
          {
            id: `NOTIF-${Date.now()}`,
            type: 'borrow',
            severity: 'info',
            title: 'Book Issued',
            message: `${targetMember.name} checked out "${targetBook.title}". Due on ${dueDateStr}.`,
            timestamp: 'Just now',
            read: false,
            actionUrl: '/overdue'
          },
          ...state.notifications
        ]
      };
    }

    // ----------------------------------------------------
    // RETURN BOOK
    // ----------------------------------------------------
    case 'RETURN_BOOK': {
      const { transactionId, condition = 'Good', notes = '', penaltyPaid = 0 } = action.payload;
      const tx = state.transactions.find(t => t.id === transactionId);
      if (!tx || tx.status === 'returned') return state;

      const returnDateStr = new Date().toISOString().split('T')[0];
      const daysLate = calculateDaysLate(tx.dueDate, returnDateStr, state.settings.gracePeriodDays);
      const computedPenalty = calculatePenalty(
        tx.dueDate,
        returnDateStr,
        state.settings.penaltyPerDay,
        state.settings.gracePeriodDays,
        condition
      );

      const updatedTransactions = state.transactions.map(t => {
        if (t.id === transactionId) {
          return {
            ...t,
            returnDate: returnDateStr,
            status: 'returned',
            condition,
            notes,
            daysOverdue: daysLate,
            calculatedPenalty: computedPenalty,
            penaltyPaid: Number(penaltyPaid || computedPenalty)
          };
        }
        return t;
      });

      return {
        ...state,
        transactions: updatedTransactions,
        books: state.books.map(b =>
          b.id === tx.bookId
            ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) }
            : b
        ),
        notifications: [
          {
            id: `NOTIF-${Date.now()}`,
            type: 'return',
            severity: 'success',
            title: 'Return Completed',
            message: `${tx.memberName} returned "${tx.bookTitle}" in ${condition} condition.${
              computedPenalty > 0 ? ` Penalty: ₹${computedPenalty}` : ''
            }`,
            timestamp: 'Just now',
            read: false,
            actionUrl: '/catalog'
          },
          ...state.notifications
        ]
      };
    }

    // ----------------------------------------------------
    // SEND REMINDER (For Overdue / Due Soon)
    // ----------------------------------------------------
    case 'SEND_REMINDER': {
      const { transactionId } = action.payload;
      const tx = state.transactions.find(t => t.id === transactionId);
      if (!tx) return state;

      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === transactionId
            ? {
                ...t,
                remindedCount: (t.remindedCount || 0) + 1,
                lastReminded: new Date().toISOString().split('T')[0]
              }
            : t
        ),
        notifications: [
          {
            id: `NOTIF-${Date.now()}`,
            type: 'reminder',
            severity: 'info',
            title: 'Reminder Dispatched',
            message: `Automated alert dispatched to ${tx.memberName} for "${tx.bookTitle}".`,
            timestamp: 'Just now',
            read: false,
            actionUrl: '/overdue'
          },
          ...state.notifications
        ]
      };
    }

    // ----------------------------------------------------
    // ASSETS
    // ----------------------------------------------------
    case 'ADD_ASSET': {
      const newAsset = {
        ...action.payload,
        id: action.payload.id || `AST-${String(state.assets.length + 1).padStart(3, '0')}`,
        status: action.payload.status || 'Available'
      };
      return {
        ...state,
        assets: [newAsset, ...state.assets]
      };
    }

    case 'UPDATE_ASSET': {
      return {
        ...state,
        assets: state.assets.map(a => (a.id === action.payload.id ? { ...a, ...action.payload } : a))
      };
    }

    case 'DELETE_ASSET': {
      return {
        ...state,
        assets: state.assets.filter(a => a.id !== action.payload.id)
      };
    }

    // ----------------------------------------------------
    // NOTIFICATIONS
    // ----------------------------------------------------
    case 'MARK_NOTIFICATION_READ': {
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload.id ? { ...n, read: true } : n
        )
      };
    }

    case 'MARK_ALL_NOTIFICATIONS_READ': {
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      };
    }

    case 'CLEAR_NOTIFICATIONS': {
      return {
        ...state,
        notifications: []
      };
    }

    // ----------------------------------------------------
    // SETTINGS & THEME
    // ----------------------------------------------------
    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    }

    case 'TOGGLE_DARK_MODE': {
      return {
        ...state,
        settings: { ...state.settings, darkMode: !state.settings.darkMode }
      };
    }

    case 'SET_THEME_ACCENT': {
      return {
        ...state,
        settings: { ...state.settings, theme: action.payload }
      };
    }

    // ----------------------------------------------------
    // USER / WISHLIST
    // ----------------------------------------------------
    case 'SET_CURRENT_USER': {
      return {
        ...state,
        currentUser: action.payload
      };
    }

    case 'TOGGLE_WISHLIST': {
      const bookId = action.payload;
      const exists = state.wishlist.includes(bookId);
      return {
        ...state,
        wishlist: exists ? state.wishlist.filter(id => id !== bookId) : [...state.wishlist, bookId]
      };
    }

    // ----------------------------------------------------
    // TOASTS
    // ----------------------------------------------------
    case 'ADD_TOAST': {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      return {
        ...state,
        toasts: [...state.toasts, { id, ...action.payload }]
      };
    }

    case 'REMOVE_TOAST': {
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload)
      };
    }

    // ----------------------------------------------------
    // RESET ALL DATA TO FRESH DEMO STATE
    // ----------------------------------------------------
    case 'RESET_DATA': {
      return {
        ...initialState,
        toasts: [
          {
            id: Date.now().toString(),
            type: 'info',
            title: 'Data Reset',
            message: 'All library collections, members, and records reset to demo dataset.'
          }
        ]
      };
    }

    default:
      return state;
  }
}
