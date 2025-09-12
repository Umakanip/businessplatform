export function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export const isActive = (endDate: Date | null): boolean => {
  if (!endDate) return true; // null na lifetime → always active
  return endDate > new Date();
};

