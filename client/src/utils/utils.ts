export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const validateDate = (value: string) => {
  const validYear = /^\d{4}$/.test(value);
  const validYearMonth = /^\d{4}-\d{2}$/.test(value);
  const validFullDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
  return validYear || validYearMonth || validFullDate;
};
