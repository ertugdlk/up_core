const {Rcon} = require('rcon-client')
const Config = require('config')
const steamid = require('@node-steam/id')
var matchconfig = require('./matchconfig.json')
const rcon = new Rcon({ host: process.env.RCON_HOST, port: Config.get('rcon.port'), password: process.env.RCON_PASS })


const _rcon = Rcon.connect({
    host: process.env.RCON_HOST,
    port: Config.get('rcon.port'),
    password: process.env.RCON_PASS
})

async function gameStatus(){
    try{
        await rcon.connect()
        const response = await Promise.all([rcon.send("get5_status")])
        rcon.end()
        return response
    }
    catch(error)
    {
        throw error
    }
}

async function createMatch(){
    try
    {
        await rcon.connect()
        const response = await Promise.all([rcon.send("get5_creatematch")])
        rcon.end()
    }
    catch(error)
    {
        throw error
    }
}

async function setupMatch(roomId , teams , map){
    try
    {
        const url = "http://localhost:5000/rcon/matchconfig?roomId="+ roomId + "&teams="+ teams[0]+ "&teams=" + teams[1]
        await rcon.connect()

        const response = await Promise.all([rcon.send("get5_loadmatch_url" + '"'+url+'"')])
        rcon.end()
        return response

    }
    catch(error)
    {
        throw error
    }
}

async function matchSettings(roomId , teams, map){

    try
    {
        matchconfig.matchid = roomId
        matchconfig.team1.players.push(teams[0])
        matchconfig.team2.players.push(team[1])

        return matchconfig
    }
    catch(error)
    {
        throw error
    }
}

module.exports = {
    gameStatus,
    createMatch,
    matchSettings,
    setupMatch
}