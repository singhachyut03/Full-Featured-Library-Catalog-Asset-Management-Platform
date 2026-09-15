import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { libraryReducer, initialState } from '../reducer/libraryReducer';

const LibraryContext = createContext(null);
const STORAGE_KEY = 'libra_platform_state_v1';

export function LibraryProvider({ children }) {
  const [state, dispatch] = useReducer(libraryReducer, initialState, (defaultVal) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultVal,
          ...parsed,
          toasts: [] // never persist temporary toasts
        };
      }
    } catch (e) {
      console.warn('Failed to load LIBRA state from localStorage:', e);
    }
    return defaultVal;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      const { toasts, ...persistableState } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistableState));
    } catch (e) {
      console.warn('Failed to save LIBRA state to localStorage:', e);
    }
  }, [state]);

  // Apply theme & dark mode to <html> tag
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.darkMode) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }

    if (state.settings.theme) {
      root.setAttribute('data-theme-accent', state.settings.theme);
    }
  }, [state.settings.darkMode, state.settings.theme]);

  // Convenience Action Creators
  const notify = (title, message, type = 'info') => {
    dispatch({
      type: 'ADD_TOAST',
      payload: { title, message, type }
    });
  };

  const notifySuccess = (title, message) => notify(title, message, 'success');
  const notifyError = (title, message) => notify(title, message, 'error');
  const notifyInfo = (title, message) => notify(title, message, 'info');

  const removeToast = (id) => dispatch({ type: 'REMOVE_TOAST', payload: id });

  const addBook = (book) => {
    dispatch({ type: 'ADD_BOOK', payload: book });
    notifySuccess('Book Added', `"${book.title}" added to the library catalog.`);
  };

  const updateBook = (book) => {
    dispatch({ type: 'UPDATE_BOOK', payload: book });
    notifySuccess('Book Updated', `Changes to "${book.title}" have been saved.`);
  };

  const deleteBook = (id, title) => {
    dispatch({ type: 'DELETE_BOOK', payload: { id } });
    notifyInfo('Book Removed', `"${title || 'Book'}" has been removed from catalog.`);
  };

  const addMember = (member) => {
    dispatch({ type: 'ADD_MEMBER', payload: member });
    notifySuccess('Member Enrolled', `${member.name} registered as a library member.`);
  };

  const updateMember = (member) => {
    dispatch({ type: 'UPDATE_MEMBER', payload: member });
    notifySuccess('Member Updated', `Profile details for ${member.name} updated.`);
  };

  const toggleMemberStatus = (id, name, currentStatus) => {
    dispatch({ type: 'TOGGLE_MEMBER_STATUS', payload: { id } });
    notifyInfo(
      'Membership Status Changed',
      `${name} is now ${currentStatus === 'active' ? 'Inactive' : 'Active'}.`
    );
  };

  const issueBook = (bookId, memberId, dueDate) => {
    dispatch({ type: 'ISSUE_BOOK', payload: { bookId, memberId, dueDate } });
    notifySuccess('Book Issued Successfully', 'Checkout registered and circulation updated.');
  };

  const returnBook = (transactionId, condition, notes, penaltyPaid) => {
    dispatch({
      type: 'RETURN_BOOK',
      payload: { transactionId, condition, notes, penaltyPaid }
    });
    notifySuccess('Return Completed', 'Book returned into catalog circulation.');
  };

  const sendReminder = (transactionId) => {
    dispatch({ type: 'SEND_REMINDER', payload: { transactionId } });
    notifySuccess('Reminder Dispatched', 'Automated SMS & Email notice sent to borrower.');
  };

  const addAsset = (asset) => {
    dispatch({ type: 'ADD_ASSET', payload: asset });
    notifySuccess('Asset Logged', `"${asset.name}" tracked in library inventory.`);
  };

  const updateAsset = (asset) => {
    dispatch({ type: 'UPDATE_ASSET', payload: asset });
    notifySuccess('Asset Updated', `Status and notes for "${asset.name}" updated.`);
  };

  const deleteAsset = (id, name) => {
    dispatch({ type: 'DELETE_ASSET', payload: { id } });
    notifyInfo('Asset Removed', `"${name || 'Asset'}" removed from records.`);
  };

  const markNotificationRead = (id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { id } });
  };

  const markAllNotificationsRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
    notifyInfo('Notifications Marked', 'All notifications marked as read.');
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const updateSettings = (newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    notifySuccess('Settings Saved', 'Library configuration and rules updated.');
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const setThemeAccent = (accent) => {
    dispatch({ type: 'SET_THEME_ACCENT', payload: accent });
  };

  const toggleWishlist = (bookId) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: bookId });
  };

  const resetData = () => {
    dispatch({ type: 'RESET_DATA' });
  };

  const setCurrentUser = (user) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  };

  const value = {
    state,
    dispatch,
    addBook,
    updateBook,
    deleteBook,
    addMember,
    updateMember,
    toggleMemberStatus,
    issueBook,
    returnBook,
    sendReminder,
    addAsset,
    updateAsset,
    deleteAsset,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    updateSettings,
    toggleDarkMode,
    setThemeAccent,
    toggleWishlist,
    resetData,
    setCurrentUser,
    notifySuccess,
    notifyError,
    notifyInfo,
    removeToast
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}
