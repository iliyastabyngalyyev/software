/** First reason a same-day request fails, or null when the room is available. */
export function bookingIssue({ start, end, now, blocked, bookings }) {
  if (![start, end, now].every(Number.isFinite)) return 'invalidTime';
  if (start < 0 || end > 1440) return 'invalidTime';
  if (start >= end) return 'interval';
  if (start <= now) return 'past';
  if (end - start > 120) return 'duration';
  if (blocked) return 'blocked';

  // Intervals are [start, end), so equality at either endpoint is allowed.
  if (bookings.some(booking => start < booking.end && end > booking.start)) {
    return 'overlap';
  }
  return null;
}

export function canBook(request) {
  return bookingIssue(request) === null;
}
