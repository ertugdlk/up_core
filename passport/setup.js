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
    returnURL: 'http://localhost:5000/',
    realm: 'http://localhost:3000/',
    apiKey: '3F7E7FF7EC5EC88290ECF9ED3C63F642'
  },
  function(identifier, profile, done) {
    process.nextTick(function () {
      profile.identifier = identifier
      return done(null, profile)
    });
  }
))

module.exports = passport
