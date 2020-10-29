const _ = require('lodash')
const Axios = require('axios')
const Config = require('config')
const apiKey = Config.get('platforms.steam')


class SteamAPI 
{
    async getDetail({steamID})
    {
        try
        {
            const url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ apiKey.apiKey +'&steamids=' + steamID
            const response = await Axios.get(url)

            return _.get(response, 'players.0')
        }
        catch(error)
        {
            throw error
        }
    }

    async getOwnedGames({steamID})
    {
        try
        {
            const url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+ apiKey.apiKey +'&steamid='+ steamID +'&format=json'
            const response = await Axios.get(url)

            return _.get(response, 'games')
        }
        catch
        {
            
        }
    }

}

module.exports = new SteamAPI()