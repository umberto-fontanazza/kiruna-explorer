import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { TimeIntervalParseFailed } from "../src/error/timeIntervalError";
import { TimeInterval } from "../src/model/timeInterval";

dayjs.extend(utc);

describe("TimeInterval", () => {
  describe("parse", () => {
    it("should parse a day-level precision string", () => {
      const timeString = "2024-05-15";
      const interval = TimeInterval.parse(timeString);

      expect(interval.begin.toISOString()).toBe("2024-05-15T00:00:00.000Z");
      expect(interval.end.toISOString()).toBe("2024-05-16T00:00:00.000Z");
    });

    it("should parse a month-level precision string", () => {
      const timeString = "2024-05";
      const interval = TimeInterval.parse(timeString);

      expect(interval.begin.toISOString()).toBe("2024-05-01T00:00:00.000Z");
      expect(interval.end.toISOString()).toBe("2024-06-01T00:00:00.000Z");
    });

    it("should parse a year-level precision string", () => {
      const timeString = "2024";
      const interval = TimeInterval.parse(timeString);

      expect(interval.begin.toISOString()).toBe("2024-01-01T00:00:00.000Z");
      expect(interval.end.toISOString()).toBe("2025-01-01T00:00:00.000Z");
    });

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

  describe("format", () => {
    it("should format a day-level precision interval", () => {
      const interval = new TimeInterval(
        dayjs.utc("2024-05-15"),
        dayjs.utc("2024-05-16"),
      );

      expect(interval.format()).toBe("2024-05-15");
    });

    it("should format a month-level precision interval", () => {
      const interval = new TimeInterval(
        dayjs.utc("2024-05-01"),
        dayjs.utc("2024-06-01"),
      );

      expect(interval.format()).toBe("2024-05");
    });

    it("should format a year-level precision interval", () => {
      const interval = new TimeInterval(
        dayjs.utc("2024-01-01"),
        dayjs.utc("2025-01-01"),
      );

      expect(interval.format()).toBe("2024");
    });
  });

  describe("fromDatabase", () => {
    it("should create a TimeInterval from database date pairs", () => {
      const datePair: [Date, Date] = [
        new Date("2024-05-15"),
        new Date("2024-05-16"),
      ];
      const interval = TimeInterval.fromDatabase(datePair);

      expect(interval.begin.toISOString()).toBe("2024-05-15T00:00:00.000Z");
      expect(interval.end.toISOString()).toBe("2024-05-16T00:00:00.000Z");
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

  describe("constructor", () => {
    it("should create a TimeInterval instance with the given begin and end Dayjs objects", () => {
      const begin = dayjs.utc("2024-05-15");
      const end = dayjs.utc("2024-05-16");
      const interval = new TimeInterval(begin, end);

      expect(interval.begin).toBe(begin);
      expect(interval.end).toBe(end);
    });
  });
});
