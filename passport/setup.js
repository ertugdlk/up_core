const passport = require('passport')
    , util = require('util')
    , SteamStrategy = require('passport-steam').Strategy

passport.serializeUser(function(user, done) {
        done(null, user)
      })
      
passport.deserializeUser(function(obj, done) {
        done(null, obj)
      })

passport.use(new SteamStrategy({
    returnURL: 'https://test.unknownpros.com/steam/redirect',
    realm: 'https://test.unknownpros.com/',
    apiKey: process.env.STEAM_APIKEY
  },
  function(identifier, profile, done) {
    process.nextTick(function () {
      profile.identifier = identifier
      return done(null, profile)
    });
  }
))

module.exports = passport
