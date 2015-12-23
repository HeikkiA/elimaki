import mongoose from 'mongoose'
import passport from 'passport'
import config from '../config/environment'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import compose from 'composable-middleware'
import User from '../api/user/user.model'
const validateJwt = expressJwt({ secret: config.secrets.session })

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
const isAuthenticated = () =>
  compose()
    // Validate jwt
    .use((req, res, next) => {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token
      }
      validateJwt(req, res, next)
    })
    // Attach user to request
    .use((req, res, next) => {
      User.findById(req.user._id, (err, user) => {
        if (err) return next(err)
        if (!user) return res.send(401)
        req.user = user;
        next()
      })
    })

/**
 * Checks if the user role meets the minimum requirements of the route
 */
const hasRole = roleRequired => {
  if (!roleRequired) throw new Error('Required role needs to be set')

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next()
      }
      else {
        res.send(403)
      }
    })
}

/**
 * Returns a jwt token signed by the app secret
 */
const signToken = id =>
  jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 })

/**
 * Set token cookie directly for oAuth strategies
 */
const setTokenCookie = (req, res) => {
  if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.'})
  const token = signToken(req.user._id, req.user.role)
  res.cookie('token', JSON.stringify(token))
  res.redirect('/')
}

exports.isAuthenticated = isAuthenticated
exports.hasRole = hasRole
exports.signToken = signToken
exports.setTokenCookie = setTokenCookie