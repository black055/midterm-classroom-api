import {
    Strategy as JwtStrategy,
    ExtractJwt,
  } from 'passport-jwt';

// load up the user model
import User from '../components/user/user.model.js';
import constant from './constant.js';

export default function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('authorization'),
  opts.secretOrKey = constant.secret;
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
};