import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Admin from '../../models/Admin';

passport.serializeUser((user, done) => {
    done(null, user.id); // or user._id
});

passport.deserializeUser(async (id, done) => {
    try {
        const admin = await Admin.findById(id);
        done(null, admin);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            if (!req.user) {
                // Not logged in – check if Google account is already connected
                let admin = await Admin.findOne({ googleId: profile.id });
                if (admin) return done(null, admin);

                // Optional: Check if admin exists by email to prevent duplicate accounts
                admin = await Admin.findOne({ email: profile.emails[0].value });
                if (admin) {
                    // Optionally prevent login if Google not yet linked
                    return done(null, false, { message: 'Admin exists but Google not linked. Log in with password first.' });
                }

                // Otherwise, block or create new account logic (if you allow it)
                return done(null, false, { message: 'No admin account found. Please log in first.' });

            } else {
                // Logged in as Admin → connect Google account
                const admin = await Admin.findById(req.user.id);
                if (!admin) return done(null, false, { message: 'Admin not found.' });

                admin.googleId = profile.id;
                admin.profilePicture = profile.photos?.[0]?.value || '';
                await admin.save();

                return done(null, admin);
            }
        } catch (err) {
            done(err, null);
        }
    }
));
