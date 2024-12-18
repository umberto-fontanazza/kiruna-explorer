import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Given a typeScript enum produces a comparator which orders the enum values in
 * order of definition
 */
export function enumDefOrderComparator<T extends Record<string, string>>(
  enumType: T,
): (a: T[keyof T], b: T[keyof T]) => number {
  const values = Object.values(enumType);
  const valueOrderMap = new Map(values.map((value, index) => [value, index]));
  return (a, b) => {
    const indexA = valueOrderMap.get(a);
    const indexB = valueOrderMap.get(b);
    if (indexA === undefined || indexB === undefined) {
      throw new Error(`Invalid enum value(s): ${a}, ${b}`);
    }
    return indexA - indexB;
  };
}
export function validateDate(value: string): boolean {
  const validYear = /^\d{4}$/.test(value);
  const validYearMonth = dayjs(value, "YYYY/MM", true).isValid();
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
