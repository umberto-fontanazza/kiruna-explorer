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

  static async insert(user: User, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString("hex");
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
              hashedPassword.toString("hex"),
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

  static async get(email: string, password: string): Promise<User | false> {
    const result = await Database.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email],
    );
    const userRow = result.rows[0];
    const user = User.fromDatabaseRow(userRow);

    return new Promise((resolve, reject) => {
      crypto.scrypt(password, userRow.salt, 32, (err, hashedPassword) => {
        if (err) return reject(err);

        if (
          crypto.timingSafeEqual(
            Buffer.from(userRow.password, "hex"),
            hashedPassword,
          )
        ) {
          resolve(user);
        } else {
          resolve(false);
        }
      });
    });
  }
}
