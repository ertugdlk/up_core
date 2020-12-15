const {Rcon} = require('rcon-client')
const Config = require('config')
const steamid = require('@node-steam/id')
const GameRoom = require('../models/GameRoom')
const _ = require('lodash')

var matchconfig = require('./matchconfig.json')
const rcon = new Rcon({ host: process.env.RCON_HOST, port: Config.get('rcon.port'), password: process.env.RCON_PASS })


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

async function setupMatch(host){
    try
    {
        const url = "https://98135b15f402.ngrok.io/rcon/matchconfig?host="+ host
        await rcon.connect()

        const response = await Promise.all([rcon.send("get5_loadmatch_url" + ' "'+url+'"')])
        rcon.end()
        return response

    }
    catch(error)
    {
        throw error
    }
}

async function matchSettings(host){

    try
    {
        const room = await GameRoom.findOne({host:host})

        const team1 = _.find(room.users , function(roomUser){
            return roomUser.team == 1
        })
        const team2 = _.find(room.users , function(roomUser){
            return roomUser.team == 2
        })

        matchconfig.matchid = room.roomId
        matchconfig.team1.players = team1
        matchconfig.team2.players = team2
        matchconfig.maplist = room.settings.map
        matchconfig.players_per_team = team1.length
        matchconfig.min_players_to_ready = team1.length * 2
        matchconfig.cvars.hostname = "Unknownpros" + host
        
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