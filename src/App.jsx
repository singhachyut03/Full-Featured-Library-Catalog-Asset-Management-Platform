import React from 'react';
import { LibraryProvider } from './context/LibraryContext';
import { useRouter } from './hooks/useRouter';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { MembersPage } from './pages/MembersPage';
import { MemberDetailsPage } from './pages/MemberDetailsPage';
import { QuickBorrowPage } from './pages/QuickBorrowPage';
import { ReturnBookPage } from './pages/ReturnBookPage';
import { OverduePage } from './pages/OverduePage';
import { AssetsPage } from './pages/AssetsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

function RouterOutlet() {
  const { currentPath, routeName, routeParam, navigate } = useRouter();

  // Parse query string parameters (e.g. ?q=psychology or ?bookId=book-1)
  const fullHash = window.location.hash.slice(1);
  const queryString = fullHash.includes('?') ? fullHash.split('?')[1] : '';
  const searchParams = new URLSearchParams(queryString);
  const initialQuery = searchParams.get('q') || '';
  const preSelectedBookId = searchParams.get('bookId') || null;

  const renderPage = () => {
    switch (routeName) {
      case '':
      case 'landing':
        return <LandingPage onNavigate={navigate} />;

      case 'login':
        return <LoginPage onNavigate={navigate} />;

      case 'signup':
        return <SignUpPage onNavigate={navigate} />;

      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;

      case 'catalog':
        return <CatalogPage onNavigate={navigate} initialQuery={initialQuery} />;

      case 'book':
        return <BookDetailsPage bookId={routeParam} onNavigate={navigate} />;

      case 'members':
        return <MembersPage onNavigate={navigate} />;

      case 'member':
        return <MemberDetailsPage memberId={routeParam} onNavigate={navigate} />;

      case 'borrow':
        return (
          <QuickBorrowPage
            onNavigate={navigate}
            preSelectedBookId={preSelectedBookId || routeParam}
          />
        );

      case 'return':
        return <ReturnBookPage onNavigate={navigate} />;

      case 'overdue':
        return <OverduePage onNavigate={navigate} />;

      case 'assets':
        return <AssetsPage onNavigate={navigate} />;

      case 'analytics':
        return <AnalyticsPage onNavigate={navigate} />;

      case 'notifications':
        return <NotificationsPage onNavigate={navigate} />;

      case 'settings':
        return <SettingsPage onNavigate={navigate} />;

      default:
        // Default to dashboard for any unmapped app route
        return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <AppLayout currentPath={currentPath} onNavigate={navigate}>
      {renderPage()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <LibraryProvider>
      <RouterOutlet />
    </LibraryProvider>
  );
}
