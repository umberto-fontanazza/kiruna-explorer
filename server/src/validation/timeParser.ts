import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { z, ZodNever } from "zod";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

type ZodContext = {
  addIssue: CallableFunction;
};

type TimePrecision = "year" | "month" | "day";

/**
 * A Dayjs object represents a single instant in time. The API accepts period of times
 * (the time elapsed between an instant called start and an instant called end)
 * lasting either a day, a month, or a full year.
 * This parser turns for example `2024-05` into a couple of Dayjs object representing namely
 * the start (2024-05-01T00:00:00Z) and end (2024-05-01T00:00:00Z) of said time period
 */
export const timeParser = (
  time: string,
  ctx: ZodContext,
): [Dayjs, Dayjs] | ZodNever => {
  let precision: TimePrecision;
  const dayRegex = /^\d{4}-\d{2}-\d{2}$/;
  const monthRegex = /^\d{4}-\d{2}$/;
  const yearRegex = /^\d{4}$/;
  while (true) {
    if (dayRegex.test(time)) {
      precision = "day";
      break;
    }
    if (monthRegex.test(time)) {
      precision = "month";
      break;
    }
    if (yearRegex.test(time)) {
      precision = "year";
      break;
    }
    ctx.addIssue({ message: `Date format not recognized: ${time}` });
    return z.NEVER;
  }
  const format = precisionFormat[precision];
  const begin: Dayjs = dayjs.utc(time, format, true);
  if (!begin.isValid()) {
    ctx.addIssue({ message: `Invalid date, expected ${format}` });
    return z.NEVER;
  }
  return [begin, begin.add(1, precision)];
};

const precisionFormat = {
  day: "YYYY-MM-DD",
  month: "YYYY-MM",
  year: "YYYY",
};

export const timeFormatter = (timeInterval: [Dayjs, Dayjs]): string => {
  const [begin, end] = timeInterval;
  let precision: TimePrecision;
  if (end.diff(begin, "month") > 1) precision = "year";
  else if (end.diff(begin, "day") > 1) precision = "month";
  else precision = "day";
  const format = precisionFormat[precision];
  return begin.format(format);
};
