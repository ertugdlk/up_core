const OpenIDStrategy = require('passport-openid').Strategy

const SteamStrategy = new OpenIDStrategy({
    providerURL:'http://steamcommunity.com/openid',
    stateless:true,
    returnURL: 'http://localhost:5000/',
    realm: 'http://localhost:5000/',

},
    function(identifier, done) {
        process.nextTick(function () {
            const user = {
                identifier,
                steamId: identifier.match(/\d+$/)[0]
            }

            return done(user,null)
        })
    })

module.exports = SteamStrategy    