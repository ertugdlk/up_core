const passport = require('passport')
  , util = require('util')
  , SteamStrategy = require('passport-steam').Strategy

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:5000/steam/redirect',
  realm: 'http://localhost:5000/',
  apiKey: process.env.STEAM_APIKEY
},
  function (identifier, profile, done) {
    process.nextTick(function () {
      profile.identifier = identifier
      return done(null, profile)
    });
  }
))

module.exports = passport
