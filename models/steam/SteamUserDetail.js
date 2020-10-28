const _ = require('lodash')
const Axios = require('axios')

const DetailBuilder = require('../builders/DetailBuilder')
const SteamAPI = require('./SteamAPI')

class SteamUserDetail
{
    constructor( detail )
    {
        Object.assign(this, detail)
    }

    static async find({ steamID }) 
    {
        try
        {
            const response = await SteamAPI.getDetail({steamID})
            const SteamUserDetail = new SteamUserDetail(response)

            return SteamUserDetail
        }
        catch(error)
        {
            throw error
        }
    }

    toDetail({ platform, user })
    {

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