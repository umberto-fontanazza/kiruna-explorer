import { User, UserRole } from "../src/model/user";
import { Database } from "../src/database";
import crypto from "crypto";

import dotenv from "dotenv";
dotenv.config();

jest.mock("../src/database", () => ({
  Database: {
    query: jest.fn(),
  },
}));

jest.mock("crypto", () => ({
  randomBytes: jest.fn(() => Buffer.from("randomsalt")),
  scrypt: jest.fn((password, salt, keylen, callback) => {
    callback(null, Buffer.from("hashedpassword"));
  }),
  timingSafeEqual: jest.fn((a, b) => {
    return a.toString() === b.toString();
  }),
}));

describe("User Class", () => {
  const testUser = new User(
    process.env.TEST_EMAIL,
    process.env.TEST_NAME,
    process.env.TEST_SURNAME,
    UserRole.Planner,
  );
  const testPassword = process.env.TEST_PASSWORD;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("insert()", () => {
    it("should insert a user into the database with a hashed password", async () => {
      (Database.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await testUser.insert(testPassword);

      expect(Database.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO "user"'),
        expect.arrayContaining([
          process.env.TEST_EMAIL,
          process.env.TEST_NAME,
          process.env.TEST_SURNAME,
          expect.any(Buffer),
          expect.any(Buffer),
          UserRole.Planner,
        ]),
      );
    });

    it("should throw an error if insertion fails", async () => {
      (Database.query as jest.Mock).mockRejectedValueOnce(
        new Error("Database error"),
      );
      await expect(testUser.insert(testPassword)).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("login()", () => {
    it("should return a User object if login is successful", async () => {
      const dbUserRow = {
        email: process.env.TEST_EMAIL,
        name: process.env.TEST_NAME,
        surname: process.env.TEST_SURNAME,
        role: UserRole.Planner.toString(),
        salt: Buffer.from("randomsalt"),
        password_hash: Buffer.from("hashedpassword"),
      };
      (Database.query as jest.Mock).mockResolvedValueOnce({
        rows: [dbUserRow],
      });

      const user = await User.login("test@example.com", testPassword);

      expect(user).toBeInstanceOf(User);
      // expect(user?.email).toBe("test@example.com");
    });

    it("should return false if login fails due to incorrect password", async () => {
      const dbUserRow = {
        pemail: process.env.TEST_EMAIL,
        name: process.env.TEST_NAME,
        surname: process.env.TEST_SURNAME,
        role: UserRole.Planner.toString(),
        salt: Buffer.from("randomsalt"),
        password_hash: Buffer.from("wronghashedpassword"),
      };
      (Database.query as jest.Mock).mockResolvedValueOnce({
        rows: [dbUserRow],
      });

      const user = await User.login("test@example.com", "wrongpassword");

      expect(user).toBe(false);
    });

    it("should return false if user does not exist in the database", async () => {
      (Database.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const user = await User.login("nonexistent@example.com", testPassword);

      expect(user).toBe(false);
    });

    it("should throw an error if there is an issue with hashing the password", async () => {
      (crypto.scrypt as jest.Mock).mockImplementationOnce(
        (password, salt, keylen, callback) => {
          callback(new Error("Hashing error"), null);
        },
      );

      await expect(
        User.login(process.env.TEST_EMAIL, testPassword),
      ).rejects.toThrow("Hashing error");
    });
  });

  describe("getByEmail()", () => {
    it("should return a user by email", async () => {
      const dbUserRow = {
        email: process.env.TEST_EMAIL,
        name: process.env.TEST_NAME,
        surname: process.env.TEST_SURNAME,
        role: UserRole.Planner.toString(),
      };
      (Database.query as jest.Mock).mockResolvedValueOnce({
        rows: [dbUserRow],
      });

      const user = await User.getByEmail(process.env.TEST_EMAIL);

      expect(user).toBeInstanceOf(User);
      expect(user?.email).toBe(process.env.TEST_EMAIL);
    });

    it("should return undefined if no user is found", async () => {
      (Database.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const user = await User.getByEmail(process.env.TEST_NONEXISTENCE_EMAIL);

      expect(user).toBeUndefined();
    });
  });
});
