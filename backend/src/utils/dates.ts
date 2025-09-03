export function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function isActive(endDate: Date) {
  return new Date(endDate).getTime() >= Date.now();
}
