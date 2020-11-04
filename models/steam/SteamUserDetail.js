const _ = require('lodash')
const Axios = require('axios')
const Config = require('config')

const DetailBuilder = require('../builders/DetailBuilder')
const Detail = require('../Detail')
const Game = require('../Game')
const SteamAPI = require('./SteamAPI')
const PlatformID = Config.get('platforms.steam._id')

class SteamUserDetail
{
    constructor( detail )
    {
        Object.assign(this, detail)
    }

    static async find({steamID}) 
    {
        try
        {
            const response = await SteamAPI.getDetail({steamID})

            return response
        }
        catch(error)
        {
            throw error
        }
    }

    static async matchGames({steamID, user})
    {
        try
        {
            const platform = PlatformID
            const response = await SteamAPI.getOwnedGames({steamID})
            const SteamGames = await Game.find({platform: platform})
            const detail = await Detail.findOne({ platform: platform , user: user})

            await SteamGames.map( game => {
                    const MatchedGame = _.find(response, {'appid':  Number(game.appID)})
                    if(MatchedGame)
                    {
                        detail.games.push(game._id)
                    }


            })

            return detail

        }
        catch(error)
        {
            throw error
        }
    }

    toDetail({ user })
    {
        const platform = PlatformID

        const builder = new DetailBuilder()
                        .name(_.get(this , 'personaname'))
                        .uniqueID( _.get(this, 'steamid'))
                        .platform( platform )
                        .user( user )


        const detail = builder.build()
  
        return detail
    }

}

module.exports = SteamUserDetail