import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hash-based router for seamless SPA navigation without 404 server errors
 * Supports paths like:
 * '/', '/dashboard', '/catalog', '/book/:id', '/members', '/member/:id',
 * '/borrow', '/return', '/overdue', '/assets', '/analytics', '/notifications',
 * '/settings', '/login', '/signup'
 */
export function useRouter() {
  const getHashPath = () => {
    const hash = window.location.hash.slice(1); // remove '#'
    if (!hash || hash === '') return '/dashboard';
    return hash;
  };

  const [currentPath, setCurrentPath] = useState(getHashPath);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(getHashPath());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path;
  }, []);

  // Parse path and query/params
  const [basePath, ...rest] = currentPath.split('?');
  const pathSegments = basePath.split('/').filter(Boolean);

  let routeName = pathSegments[0] || 'dashboard';
  let routeParam = pathSegments[1] || null;

  return {
    currentPath: basePath,
    routeName,
    routeParam,
    navigate
  };
}
