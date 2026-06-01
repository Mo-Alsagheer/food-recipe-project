import passport from "passport";

// Google strategy is registered only when credentials are present
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const { Strategy: GoogleStrategy } = await import("passport-google-oauth20");
    const { default: User } = await import("../models/User.js");

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ provider: "google", providerId: profile.id });

                    if (!user) {
                        const email = profile.emails?.[0]?.value;
                        if (email) user = await User.findOne({ email });

                        if (user) {
                            user.provider = "google";
                            user.providerId = profile.id;
                            await user.save();
                        } else {
                            user = await User.create({
                                name: profile.displayName,
                                email: profile.emails?.[0]?.value,
                                provider: "google",
                                providerId: profile.id,
                                status: "active",
                            });
                        }
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err, null);
                }
            }
        )
    );
}

export default passport;
