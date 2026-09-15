/**
 * LIBRA - UI Formatting Utilities
 */

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-IN');
}

export function getRelativeTime(timestamp) {
  if (!timestamp) return '';
  return timestamp; // If already a string like "2 min ago"
}

export function getStatusBadgeProps(status) {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'available':
    case 'returned':
    case 'good':
      return { variant: 'success', label: status.charAt(0).toUpperCase() + status.slice(1) };
    case 'in use':
    case 'issued':
    case 'due_soon':
    case 'minor damage':
      return { variant: 'warning', label: status === 'due_soon' ? 'Due Soon' : status };
    case 'overdue':
    case 'damaged':
    case 'inactive':
      return { variant: 'danger', label: status.charAt(0).toUpperCase() + status.slice(1) };
    case 'maintenance':
      return { variant: 'purple', label: 'Maintenance' };
    default:
      return { variant: 'info', label: status || 'Unknown' };
  }
}
