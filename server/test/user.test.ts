import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { Database } from "../src/database";
import { User, UserRole } from "../src/model/user";

dotenv.config();

jest.mock("../src/database", () => ({
  Database: {
    query: jest.fn(),
  },
}));

describe("User class", () => {
  const mockUserData = {
    email: process.env.USER_EMAIL || "default@example.com",
    name: process.env.USER_NAME || "Default Name",
    surname: process.env.USER_SURNAME || "Default Surname",
    role: UserRole.UrbanPlanner,
  };

  const mockUser = new User(
    mockUserData.email,
    mockUserData.name,
    mockUserData.surname,
    mockUserData.role,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("insert", () => {
    it("should insert a user into the database with a hashed password", async () => {
      const hashSpy = jest.spyOn(bcrypt, "hash") as jest.Mock;
      hashSpy.mockResolvedValue("hashedPassword");

      (Database.query as jest.Mock).mockResolvedValue({ rows: [] });

      const password = process.env.USER_PASSWORD || "defaultPassword";

      await mockUser.insert(password);

      expect(hashSpy).toHaveBeenCalledWith(password, expect.any(String));
      expect(Database.query).toHaveBeenCalledWith(
        `INSERT INTO "user" (email, name, surname, password_hash, role) VALUES ($1, $2, $3, $4, $5)`,
        [
          mockUser.email,
          mockUser.name,
          mockUser.surname,
          "hashedPassword",
          mockUser.role,
        ],
      );
    });

    it("should throw an error if the database query fails", async () => {
      const password = process.env.USER_PASSWORD || "defaultPassword";

      (Database.query as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(mockUser.insert(password)).rejects.toThrow("Database error");
    });
  });

  describe("login", () => {
    it("should return a user if credentials are correct", async () => {
      const mockDbResult = {
        rows: [
          {
            email: mockUser.email,
            name: mockUser.name,
            surname: mockUser.surname,
            role: mockUser.role,
            password_hash: process.env.USER_HASHED_PASSWORD,
          },
        ],
      };

      (Database.query as jest.Mock).mockResolvedValue(mockDbResult);

      const compareSpy = jest.spyOn(bcrypt, "compare") as jest.Mock;
      compareSpy.mockResolvedValue(true);

      const password = process.env.USER_PASSWORD || "defaultPassword";
      const result = await User.login(mockUser.email, password);

      expect(result).toEqual(mockUser);
      expect(Database.query).toHaveBeenCalledWith(
        `SELECT * FROM "user" WHERE email = $1`,
        [mockUser.email],
      );
    });

    it("should return false if the email is not found", async () => {
      const mockDbResult = { rows: [] };

      (Database.query as jest.Mock).mockResolvedValue(mockDbResult);

      const password = process.env.USER_PASSWORD || "defaultPassword";

      const result = await User.login(mockUser.email, password);

      expect(result).toBe(false);
    });

    it("should return false if the password is incorrect", async () => {
      const mockDbResult = {
        rows: [
          {
            email: mockUser.email,
            name: mockUser.name,
            surname: mockUser.surname,
            role: mockUser.role,
            password_hash: process.env.USER_HASHED_PASSWORD,
          },
        ],
      };

      (Database.query as jest.Mock).mockResolvedValue(mockDbResult);

      const compareSpy = jest.spyOn(bcrypt, "compare") as jest.Mock;
      compareSpy.mockResolvedValue(false);

      const result = await User.login(mockUser.email, "wrongPassword");

      expect(result).toBe(false);
    });

    it("should throw an error if the database query fails", async () => {
      (Database.query as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      const password = process.env.USER_PASSWORD || "defaultPassword";

      await expect(User.login(mockUser.email, password)).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("getByEmail", () => {
    it("should return a user if found", async () => {
      const mockDbResult = {
        rows: [
          {
            email: mockUser.email,
            name: mockUser.name,
            surname: mockUser.surname,
            role: mockUser.role,
            password_hash: process.env.USER_HASHED_PASSWORD,
          },
        ],
      };

      (Database.query as jest.Mock).mockResolvedValue(mockDbResult);

      const result = await User.getByEmail(mockUser.email);

      expect(result).toEqual(mockUser);
      expect(Database.query).toHaveBeenCalledWith(
        `SELECT * FROM "user" WHERE email = $1`,
        [mockUser.email],
      );
    });

    it("should return undefined if the user is not found", async () => {
      const mockDbResult = { rows: [] };

      (Database.query as jest.Mock).mockResolvedValue(mockDbResult);

      const result = await User.getByEmail(mockUser.email);

      expect(result).toBeUndefined();
    });

    it("should throw an error if the database query fails", async () => {
      (Database.query as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(User.getByEmail(mockUser.email)).rejects.toThrow(
        "Database error",
      );
    });
  });
});
