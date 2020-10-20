// app/api/auth/[...auth].ts
import { passportAuth } from "blitz"
import db from "db"
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth"

export default passportAuth({
  successRedirectUrl: "/",
  errorRedirectUrl: "/",
  authenticateOptions: { scope: "openid email profile" },
  strategies: [
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? "https://bareblitz.herokuapp.com/api/auth/google/callback"
            : "http://127.0.0.1:3000/api/auth/google/callback",

        includeEmail: true,
      },
      async function (_token, _tokenSecret, profile, done) {
        const email = profile.emails && profile.emails[0]?.value
        if (!email) {
          return done(new Error("Google OAuth response doesn't have email."))
        }
        const user = await db.user.upsert({
          where: { email },
          create: {
            email,
            name: profile.displayName,
          },
          update: { email },
        })
        const publicData = { userId: user.id, roles: [user.role], source: "google" }
        done(null, { publicData })
      }
    ),
  ],
})
