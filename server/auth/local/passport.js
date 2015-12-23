import passport from 'passport'
import {Strategy} from 'passport-local'

exports.setup = (User, config) => {
  passport.use(new Strategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    (email, password, done) => {
      User.findOne({
        email: email.toLowerCase()
      }, (err, user) => {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, { message: 'This email is not registered.', field: 'email' })
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'This password is not correct.', field: 'password' })
        }
        return done(null, user)
      })
    }
  ))
}
