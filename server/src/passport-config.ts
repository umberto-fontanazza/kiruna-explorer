import { Strategy } from "passport-local";
import { PassportStatic } from "passport";
import { User } from "./model/user";
import { UserError } from "./error/userError";

export default function passportInizializer(passport: PassportStatic) {
  passport.use(
    new Strategy({ usernameField: "email" }, async (email, password, done) => {
      const user = await User.login(email, password);
      if (!user)
        return done(null, false, { message: "Username and/or wrong password" });

      return done(null, user);
    }),
  );

  // serializeUser determines which data of the user object should be stored in the session
  passport.serializeUser(function (user, done) {
    console.log("Serialize", user);
    done(null, user);
  });

  // called on every access on an authenticated route
  passport.deserializeUser(async function (user: User, done) {
    const updatedUser = await User.getByEmail(user.email);
    console.log("Deserialize", updatedUser);
    return done(null, updatedUser);
  });
}
