const _ = require('lodash')
const Axios = require('axios')
const Config = require('config')

class SteamAPI 
{
    async getDetail({steamID })
    {
        try
        {
            const apiKey = Config.get('platforms.steam.apiKey')
            const url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ apiKey +'&steamids=' + steamID
            const response = await Axios.get(url)

            return _.get(response, 'players.0')
        }
        catch(error)
        {
            throw error
        }
    }

}

module.exports = new SteamAPI()