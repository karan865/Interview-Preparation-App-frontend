/**
 * Utility functions for local calendar date operations and streak calculation
 */

/**
 * Returns local calendar date formatted as YYYY-MM-DD
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Given a YYYY-MM-DD string, returns the preceding calendar day YYYY-MM-DD
 */
export function getYesterdayDateString(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return getLocalDateString(date);
}

/**
 * Human-friendly date formatting: "Sep 11" or "Today, Sep 11"
 */
export function formatDisplayDate(dateStr: string, includeTodayCheck: boolean = true): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[date.getMonth()];
  const formatted = `${monthName} ${date.getDate()}`;

  if (includeTodayCheck && dateStr === getLocalDateString()) {
    return `Today, ${formatted}`;
  }
  return formatted;
}

/**
 * Updates streak upon passing today's Daily Challenge.
 * Ensures completing multiple times in the same day never multiplies the streak.
 */
export function computeUpdatedStreak(
  lastCompletedDate: string | null,
  todayStr: string,
  currentStreak: number,
  longestStreak: number
): { currentStreak: number; longestStreak: number; lastCompletedDate: string } {
  // If already completed today, do not increment streak again
  if (lastCompletedDate === todayStr) {
    return {
      currentStreak,
      longestStreak,
      lastCompletedDate: todayStr,
    };
  }

  const yesterday = getYesterdayDateString(todayStr);
  let newCurrentStreak = 1;

  if (lastCompletedDate === yesterday) {
    newCurrentStreak = currentStreak + 1;
  } else {
    // Gap detected; restart streak at 1
    newCurrentStreak = 1;
  }

  const newLongestStreak = Math.max(longestStreak, newCurrentStreak);

  return {
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    lastCompletedDate: todayStr,
  };
}
