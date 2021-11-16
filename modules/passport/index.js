import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import bcrypt from "bcryptjs";

// load up the user controller
import userController from '../../components/user/user.controller.js';

passport.use(new LocalStrategy( 
    {
        usernameField:"email",
        passwordField:"password",
        session: false
    }, async function(username, password, done) {
    const user = await userController.getUser(username);
    if (user) {
        let check = false;
        check = await bcrypt.compareSync(password, user.password);
        if (check) {
            return done(null, user);
        } else {
            return done(null, false, {message: 'Mật khẩu không đúng!'});
        }
    } else return done(null, false, {message: 'Email không đúng!'});
} ));



var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('authorization'),
opts.secretOrKey = "nodeauthsecret";
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
}));

passport.use(
    new GoogleStrategy(
      {
        clientID: '363623650683-5asnak0qhe873go03791oh3ln35uae26.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        console.log(accessToken);
        console.log(profile);
        done(null, profile);
      }
    )
  );


export default passport;