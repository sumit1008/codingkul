import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = process.env;

console.log("[OAUTH:INIT] GOOGLE_CLIENT_ID present:", !!GOOGLE_CLIENT_ID);
console.log("[OAUTH:INIT] GOOGLE_CLIENT_SECRET present:", !!GOOGLE_CLIENT_SECRET);
console.log("[OAUTH:INIT] GOOGLE_CALLBACK_URL:", GOOGLE_CALLBACK_URL || "(NOT SET)");

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value;
        console.log("[OAUTH:VERIFY] profileId:", profile.id, "email:", email);

        try {
          if (!email) {
            console.error("[OAUTH:VERIFY] No email returned from Google");
            return done(new Error("No email from Google"), null);
          }

          // Case 1: existing Google user
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            console.log("[OAUTH:VERIFY] Found existing Google user:", user._id.toString());
            return done(null, user);
          }

          // Case 2: existing email/password user — link Google to it
          user = await User.findOne({ email });
          if (user) {
            console.log("[OAUTH:VERIFY] Linking Google to existing email user:", user._id.toString());
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

          console.log("[OAUTH:VERIFY] Created new user:", user._id.toString());
          return done(null, user);
        } catch (err) {
          console.error("[OAUTH:VERIFY] Error:", err.message, err.stack);
          return done(err, null);
        }
      }
    )
  );
  console.log("[OAUTH:INIT] Google strategy registered successfully");
} else {
  console.warn("[OAUTH:INIT] Google OAuth DISABLED — missing env vars");
}

passport.serializeUser((user, done) => {
  console.log("[OAUTH:SERIALIZE] userId:", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error("[OAUTH:DESERIALIZE] Error:", err.message);
    done(err, null);
  }
});

export default passport;
