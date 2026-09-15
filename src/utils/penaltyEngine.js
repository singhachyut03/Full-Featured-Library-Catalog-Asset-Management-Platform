/**
 * LIBRA - Automatic Penalty & Date Engine
 * Dynamic date difference, grace period, damage adjustments, and overdue calculation.
 */

/**
 * Calculates due date given an issue date and borrowing duration.
 * @param {string|Date} issueDate - ISO string or Date
 * @param {number} durationDays - Standard borrowing days (default 14)
 * @returns {string} ISO Date string YYYY-MM-DD
 */
export function calculateDueDate(issueDate = new Date(), durationDays = 14) {
  const date = new Date(issueDate);
  date.setDate(date.getDate() + Number(durationDays));
  return date.toISOString().split('T')[0];
}

/**
 * Calculates how many days late a book is.
 * @param {string|Date} dueDate - The target due date
 * @param {string|Date} [returnDate] - Actual return date, or current date if not returned
 * @param {number} [gracePeriod=0] - Grace period in days
 * @returns {number} Non-negative integer representing days late
 */
export function calculateDaysLate(dueDate, returnDate = new Date(), gracePeriod = 0) {
  if (!dueDate) return 0;
  
  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);

  const returned = returnDate ? new Date(returnDate) : new Date();
  returned.setHours(0, 0, 0, 0);

  const diffMs = returned.getTime() - due.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const effectiveLate = diffDays - Number(gracePeriod);
  return effectiveLate > 0 ? effectiveLate : 0;
}

/**
 * Dynamically computes monetary penalty based on days late, penalty per day, and condition.
 * @param {string|Date} dueDate - The due date
 * @param {string|Date} [returnDate] - The return date (null if not yet returned)
 * @param {number} [penaltyPerDay=10] - Rate per day in ₹
 * @param {number} [gracePeriod=0] - Grace period in days
 * @param {string} [condition='Good'] - 'Good' | 'Minor Damage' | 'Damaged'
 * @returns {number} Calculated penalty in ₹
 */
export function calculatePenalty(
  dueDate,
  returnDate = new Date(),
  penaltyPerDay = 10,
  gracePeriod = 0,
  condition = 'Good'
) {
  const daysLate = calculateDaysLate(dueDate, returnDate, gracePeriod);
  const overduePenalty = daysLate * Number(penaltyPerDay);

  // Optional condition damage fee
  let damageFee = 0;
  if (condition === 'Minor Damage') {
    damageFee = 50;
  } else if (condition === 'Damaged') {
    damageFee = 150;
  }

  return Math.max(0, overduePenalty + damageFee);
}

/**
 * Returns formatted Indian Rupee string
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount = 0) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

/**
 * Checks if a transaction is currently overdue, due soon, or safe.
 * @param {string} dueDate
 * @returns {'overdue' | 'due_soon' | 'issued'}
 */
export function getBorrowStatus(dueDate) {
  if (!dueDate) return 'issued';
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays <= 2) return 'due_soon';
  return 'issued';
}
