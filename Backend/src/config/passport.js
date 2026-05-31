import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = process.env;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email from Google"), null);

          // Case 1: existing Google user
          let user = await User.findOne({ googleId: profile.id });
          if (user) return done(null, user);

          // Case 2: existing email/password user — link Google to it
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            user.authProvider = "google";
            user.isVerified = true;
            await user.save();
            return done(null, user);
          }

          // Case 3: new user — create account
          const baseName = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_");
          let username = baseName;
          let suffix = 1;
          while (await User.findOne({ username })) {
            username = `${baseName}${suffix++}`;
          }

          const displayName = profile.displayName || baseName;
          user = await User.create({
            fullName: displayName,
            username,
            email,
            googleId: profile.id,
            authProvider: "google",
            isVerified: true,
            avatar: displayName.slice(0, 2).toUpperCase(),
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("[AUTH] Google OAuth disabled - missing environment variables");
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
