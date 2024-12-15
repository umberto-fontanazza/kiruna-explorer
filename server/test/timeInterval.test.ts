import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { TimeIntervalParseFailed } from "../src/error/timeIntervalError";
import { TimeInterval } from "../src/model/timeInterval";

dayjs.extend(utc);

const expectISO = (interval: TimeInterval, begin: string, end: string) => {
  expect(interval.begin.toISOString()).toBe(begin);
  expect(interval.end.toISOString()).toBe(end);
};

describe("TimeInterval", () => {
  describe("parse", () => {
    it.each([
      ["2024-05-15", "2024-05-15T00:00:00.000Z", "2024-05-16T00:00:00.000Z"],
      ["2024-05", "2024-05-01T00:00:00.000Z", "2024-06-01T00:00:00.000Z"],
      ["2024", "2024-01-01T00:00:00.000Z", "2025-01-01T00:00:00.000Z"],
    ])(
      "should parse '%s' correctly",
      (timeString, expectedBegin, expectedEnd) => {
        const interval = TimeInterval.parse(timeString);
        expectISO(interval, expectedBegin, expectedEnd);
      },
    );

    it("should throw an error for an invalid time string", () => {
      const invalidTime = "15-05-2024";

      expect(() => TimeInterval.parse(invalidTime)).toThrow(
        TimeIntervalParseFailed,
      );
      expect(() => TimeInterval.parse(invalidTime)).toThrow(
        "Couldn't parse 15-05-2024",
      );
    });
  });

  describe("fromDatabase", () => {
    it("should create a TimeInterval from database date pairs", () => {
      const datePair: [Date, Date] = [
        new Date("2024-05-15"),
        new Date("2024-05-16"),
      ];
      const interval = TimeInterval.fromDatabase(datePair);

      expectISO(
        interval,
        "2024-05-15T00:00:00.000Z",
        "2024-05-16T00:00:00.000Z",
      );
    });
  });

  describe("toDatabase", () => {
    it("should convert a TimeInterval to a database-compatible date pair", () => {
      const interval = new TimeInterval(
        dayjs.utc("2024-05-15"),
        dayjs.utc("2024-05-16"),
      );

      const [begin, end] = interval.toDatabase();

      expect(begin).toEqual(new Date("2024-05-15T00:00:00.000Z"));
      expect(end).toEqual(new Date("2024-05-16T00:00:00.000Z"));
    });
  });
});
