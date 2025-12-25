const pad = (n) => String(n).padStart(2, "0");

export const toISODate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const startOfISOWeek1 = (year) => {
  const jan4 = new Date(year, 0, 4);
  const dow = jan4.getDay() || 7; // Sunday -> 7
  const monday = addDays(jan4, 1 - dow);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export const weeksForYear = (year) => {
  const start = startOfISOWeek1(year);
  const startNext = startOfISOWeek1(year + 1);
  const weeks = [];
  let weekStart = new Date(start);
  let idx = 1;

  while (weekStart < startNext) {
    weeks.push({
      weekNum: idx,
      start: new Date(weekStart),
      end: addDays(weekStart, 6),
      key: `${year}-W${String(idx).padStart(2, "0")}`,
    });
    weekStart = addDays(weekStart, 7);
    idx += 1;
  }

  return weeks;
};
