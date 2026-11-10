export const isGameCacheFresh = (now: Date, syncedAt: Date | null, ttlDays: number | null) => {
  if (!now || !syncedAt || !ttlDays || (ttlDays && ttlDays < 0)) return false;

  const timeDiff = now.getTime() - syncedAt.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);

  return daysDiff < ttlDays;
};
