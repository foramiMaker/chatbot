require("dotenv").config();
// passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
const UserDetail = require("./db/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      //   scope: ['profile', 'email'],
      // Use environment variable for callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Access Token:", accessToken); // Log tokens
        console.log("Profile:", profile); // Log profile
        const email = profile.emails[0].value;
        let user = await UserDetail.findOne({ email });
        if (!user) {
          // If user does not exist, create new user
          user = await UserDetail.create({
            name: profile.displayName,
            email,
            password: "", // Leave password blank for OAuth users
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL, // Use environment variable for callback URL
//       profileFields: ["id", "displayName", "emails"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;
//         let user = await UserDetail.findOne({ email });
//         if (!user) {
//           // If user does not exist, create new user
//           user = await UserDetail.create({
//             name: profile.displayName,
//             email,
//             password: "",
//           });
//         }
//         return done(null, user);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// old codde
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_SECRET,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  //   done(null, user);
  try {
    const user = await UserDetail.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
