import { strict as assert } from "assert";
import crypto from "crypto";
import { Database } from "../database";

type UserDbRow = {
  email: string;
  name: string;
  surname: string;
  role: UserRole;
};

export enum UserRole {
  planner,
  resident,
  developer,
}

export class User {
  email: string;
  name: string;
  surname: string;
  role: UserRole;

  constructor(email: string, name: string, surname: string, role: UserRole) {
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.role = role;
  }

  private static fromDatabaseRow(dbRow: UserDbRow): User {
    const { email, name, surname, role } = dbRow;
    assert(typeof email === "string");
    assert(typeof name === "string");
    assert(typeof surname === "string");
    assert(typeof role === "string");
    return new User(email, name, surname, role);
  }

  /**
   * Inserts a new user into the database with a hashed password
   *
   * @param {User} user - The user to be inserted
   * @param {string} password - The user's password to be hashed and stored
   * @throws {Error} Throws an error if the insertion fails
   */
  static async insert(user: User, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16);
      crypto.scrypt(password, salt, 32, async (err, hashedPassword) => {
        if (err) return reject(err);

        try {
          await Database.query(
            `INSERT INTO "user" (email, name, surname, salt, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              user.email,
              user.name,
              user.surname,
              salt,
              hashedPassword,
              user.role,
            ],
          );
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Authenticates a user by email and password
   *
   * @param {string} email - The email of the user
   * @param {string} password - The user's password
   * @returns {Promise<User | false>} A promise that resolves to the user if authentication is successful or false if credentials don't match in the database
   */
  static async login(email: string, password: string): Promise<User | false> {
    const result = await Database.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email],
    );

    const userRow = result.rows[0];

    if (!userRow) return false;

    const user = User.fromDatabaseRow(userRow);

    return new Promise((resolve, reject) => {
      crypto.scrypt(password, userRow.salt, 32, (err, hashedPassword) => {
        if (err) return reject(err);

        if (crypto.timingSafeEqual(userRow.password_hash, hashedPassword)) {
          resolve(user);
        } else {
          resolve(false);
        }
      });
    });
  }

  /**
   * Retrieves a user by email address
   *
   * @param {string} email - The email address of the user
   * @returns {Promise<User | undefined>} A promise that resolves to the user if found, or undefined if not
   */
  static async getByEmail(email: string): Promise<User | undefined> {
    const result = await Database.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email],
    );
    const userRow = result.rows[0];

    if (userRow) return User.fromDatabaseRow(userRow);
    else return undefined;
  }
}
