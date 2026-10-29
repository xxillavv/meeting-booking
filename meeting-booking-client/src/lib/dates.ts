const pad = (value: number) => String(value).padStart(2, "0");

export const toDateInputValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const toTimeInputValue = (date: Date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const toISO = (date: string, time: string) =>
  new Date(`${date}T${time}`).toISOString();

const timeFormatter = new Intl.DateTimeFormat("uk-UA", {
  hour: "2-digit",
  minute: "2-digit",
});

const dayFormatter = new Intl.DateTimeFormat("uk-UA", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const shortDayFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric",
  month: "long",
});

export const formatTimeRange = (start: string, end: string) =>
  `${timeFormatter.format(new Date(start))}–${timeFormatter.format(new Date(end))}`;

export const formatDayLabel = (dayKey: string) => {
  const day = new Date(`${dayKey}T00:00`);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (dayKey === toDateInputValue(today)) {
    return `Сьогодні, ${shortDayFormatter.format(day)}`;
  }

  if (dayKey === toDateInputValue(tomorrow)) {
    return `Завтра, ${shortDayFormatter.format(day)}`;
  }

  return dayFormatter.format(day);
};
