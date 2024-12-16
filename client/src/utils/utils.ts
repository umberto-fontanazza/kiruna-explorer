export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// export function sort

// const weekdayOrder = Object.values(Weekday);

// const weekdaysToBeSorted = [Weekday.TUESDAY, Weekday.MONDAY, Weekday.FRIDAY];

// const sortedWeekdays = weekdaysToBeSorted
//   .sort((a, b) => weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b))
