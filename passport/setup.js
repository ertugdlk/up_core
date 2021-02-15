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
  returnURL: process.env.BASE_URL + 'steam/redirect',
  realm: process.env.BASE_URL,
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
