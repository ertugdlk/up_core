const _ = require('lodash')
const Axios = require('axios')

const DetailBuilder = require('../builders/DetailBuilder')
const Detail = require('../Detail')
const Game = require('../Game')
const SteamAPI = require('./SteamAPI')

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
            const platform = '5f9a84fca1f0c0b83de7d696'
            const response = await SteamAPI.getOwnedGames({steamID})
            const SteamGames = await Game.find({platform: platform})
            const UserDetail = await Detail.findOne({ platform: platform , user: user})

            _.chain(SteamGames).map( game => {
                try
                {
                    const MatchedGame = _.chain(response).find({'appid': game.appID })
                    if(MatchedGame)
                    {
                        UserDetail.games.push(game._id)
                    }
                }
                catch(error)
                {
                    throw error
                }
            })

            return UserDetail

        }
        catch(error)
        {
            throw error
        }
    }

    toDetail({ user })
    {
        const platform = '5f9a84fca1f0c0b83de7d696'

        const builder = new DetailBuilder()
                        .name(_.get(this , 'personname'))
                        .uniqueID( _.get(this, 'steamid'))
                        .platform( platform )
                        .user( user )


        const detail = builder.build()
  
        return detail
    }

}

module.exports = SteamUserDetail