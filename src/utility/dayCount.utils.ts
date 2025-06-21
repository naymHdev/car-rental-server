const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const dayCount = (start: Date, end: Date): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(diff / MS_PER_DAY);
  return Math.max(days, 1);
};
