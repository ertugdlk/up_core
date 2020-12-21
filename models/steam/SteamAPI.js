const _ = require('lodash')
const Axios = require('axios')
const Config = require('config')
const apiKey = process.env.STEAM_APIKEY


class SteamAPI 
{
    async getDetail({steamID})
    {
        try
        {
            const url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ apiKey +'&steamids=' + steamID
            const response = await Axios.get(url)

            return _.get(response, 'data.response.players.0')
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
            const url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+ apiKey  +'&steamid='+ steamID +'&format=json'
            const response = await Axios.get(url)

            return _.get(response, 'data.response.games')
        }
        catch(error)
        {
            throw error
        }
    }

    async controlVac({steamID})
    {
        try
        {
            const url = 'http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key='+ apiKey +'&steamids=' + steamID
            const response = await Axios.get(url)

            return _.get(response, 'data.players.0')
        }
        catch(error)
        {
            throw error
        }
    }

}

module.exports = new SteamAPI()