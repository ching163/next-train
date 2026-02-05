/**
 * Get remaining seconds from now to target time in HKT
 * @param targetTime date time string in HKT "2026-02-04 17:28:01"
 * @returns {number} remaining seconds from now to target time
 */
const getRemainingSeconds = (targetTime: string): number | undefined => {
  if (!targetTime) return undefined;

  const now = new Date();
  // convert now to HKT
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const hktOffset = 8; // HKT is UTC+8
  const hktNow = new Date(utc + (3600000 * hktOffset));

  const [datePart, timePart] = targetTime.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  const targetDate = new Date(year, month - 1, day, hours, minutes, seconds);

  const diffMs = targetDate.getTime() - hktNow.getTime();
  return Math.ceil(diffMs / 1000);
}

export { getRemainingSeconds };