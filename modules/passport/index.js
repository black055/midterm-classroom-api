import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import bcrypt from "bcryptjs";
import * as dotenv from 'dotenv';
dotenv.config();

// load up the user controller
import User from '../../components/user/user.model.js';

passport.use(new LocalStrategy( 
    {
        usernameField:"email",
        passwordField:"password",
        session: false
    }, async function(username, password, done) {
    const user = await User.findOne({email: `${username}`});
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
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(),
opts.secretOrKey = process.env.AUTH_SECRET;
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


export default passport;