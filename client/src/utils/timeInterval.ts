import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const precisionFormat = {
  day: "YYYY/MM/DD",
  month: "YYYY/MM",
  year: "YYYY",
};

type TimePrecision = "year" | "month" | "day";

export class TimeInterval {
  begin: Dayjs;
  end: Dayjs;

  constructor(begin: Dayjs, end: Dayjs) {
    this.begin = begin;
    this.end = end;
  }

  /**
   * A Dayjs object represents a single instant in time. The API accepts period of times
   * (the time elapsed between an instant called start and an instant called end)
   * lasting either a day, a month, or a full year.
   * This parser turns for example `2024-05` into a couple of Dayjs object representing namely
   * the start (2024-05-01T00:00:00Z) and end (2024-05-01T00:00:00Z) of said time period
   */
  static parse(time: string): TimeInterval {
    let precision: TimePrecision;
    const dayRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    const monthRegex = /^\d{4}\/\d{2}$/;
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
      throw new Error(`Couldn't parse ${time}`);
    }
    const format = precisionFormat[precision];
    const begin: Dayjs = dayjs.utc(time, format, true);
    if (!begin.isValid()) {
      throw new Error(`Couldn't parse ${time}`);
    }
    return new TimeInterval(begin, begin.add(1, precision));
  }

  format(): string {
    const [begin, end] = [this.begin, this.end];
    let precision: TimePrecision;
    if (end.diff(begin, "month") > 1) precision = "year";
    else if (end.diff(begin, "day") > 1) precision = "month";
    else precision = "day";
    const format = precisionFormat[precision];
    return begin.format(format);
  }

  toDayjs(): Dayjs {
    const durationDays = this.end.diff(this.begin, "day");
    return durationDays > 1
      ? this.begin.add(durationDays / 2, "day")
      : this.begin;
  }
}
