import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function validateDate(value: string): boolean {
  const validYear = /^\d{4}$/.test(value);
  const validYearMonth = /^\d{4}\/\d{2}$/.test(value);
  const validFullDate = dayjs(value, "YYYY/MM/DD", true).isValid();
  return validYear || validYearMonth || validFullDate;
}

export function formatDate(inputDate: string): string | undefined {
  const date = dayjs(inputDate);

  if (inputDate.match(/^\d{4}$/)) return date.format("YYYY");
  else if (inputDate.match(/^\d{4}\/\d{2}$/)) return date.format("MMMM, YYYY");
  else if (inputDate.match(/^\d{4}\/\d{2}\/\d{2}$/))
    return date.format("DD MMMM, YYYY");
  return undefined;
}
