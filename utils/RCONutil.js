const { Rcon } = require('rcon-client')
const Config = require('config')
const steamid = require('@node-steam/id')
const GameRoom = require('../models/GameRoom')
const Detail = require('../models/Detail')
const User = require('../models/User')
const _ = require('lodash')
const redisUtil = require('./Redisutil')
var matchconfig = require('./matchconfig.json')

async function gameStatus() {
    try {
        const response = await Promise.all([rcon.send("get5_status")])
        return response
    }
    catch (error) {
        throw error
    }
}

async function createMatch() {
    try {
        const response = await Promise.all([rcon.send("get5_creatematch")])
        await rcon.end()
    }
    catch (error) {
        throw error
    }
}

async function setupMatch(host) {
    try {
        //Redis Operations
        const serverStringArray = redisUtil.getAvaibleServers()
        if (!serverStringArray[0]) {
            throw new Error('No Any Empty Server');
        }
        else {
            const serverJson = JSON.parse(serverStringArray[0])
            await redisUtil.removeAvaibleServer()
            await redisUtil.addBusyServer(serverStringArray[0])
            //RCON Connection
            const rcon = new Rcon({ host: serverJson.host, port: serverJson.port, password: serverJson.password })
            rcon.connect()

            //RCON request
            const url = "https://test.unknownpros.com/rcon/matchconfig?host=" + host
            const response = await Promise.all([rcon.send("get5_endmatch"), rcon.send("get5_loadmatch_url" + ' "' + url + '"')])
            return response
        }
    }
    catch (error) {
        throw error
    }
}

async function matchSettings(host) {

    try {
        const room = await GameRoom.findOne({ host: host })
        const team1 = _.filter(room.users, function (roomUser) {
            return roomUser.team == 1
        })
        const team2 = _.filter(room.users, function (roomUser) {
            return roomUser.team == 2
        })
        var gameteam1 = [];
        var gameteam2 = [];
        var maplist = [];

        for (var i = 0; i < team1.length; i++) {
            const user = await User.findOne({ nickname: team1[i].nickname })
            const detail = await Detail.findOne({ user: user._id, platform: '5f9a84fca1f0c0b83de7d696' })
            const newId = new steamid.ID(detail.uniqueID)
            const convertedId = newId.get2()
            gameteam1.push(convertedId)
        }

        for (var i = 0; i < team2.length; i++) {
            const user = await User.findOne({ nickname: team2[i].nickname })
            const detail = await Detail.findOne({ user: user._id, platform: '5f9a84fca1f0c0b83de7d696' })
            const newId = new steamid.ID(detail.uniqueID)
            const convertedId = newId.get2()
            gameteam2.push(convertedId)
        }

        matchconfig.matchid = room.host
        matchconfig.team1.name = room._id + ':1'
        matchconfig.team2.name = room._id + ':2'
        matchconfig.team1.players = gameteam1
        matchconfig.team2.players = gameteam2
        matchconfig.maplist = [room.settings.map]
        matchconfig.players_per_team = team1.length
        matchconfig.min_players_to_ready = team1.length * 2
        matchconfig.cvars.hostname = "Unknownpros" + host
        return matchconfig
    }
    catch (error) {
        throw error
    }
}

module.exports = {
    gameStatus,
    createMatch,
    matchSettings,
    setupMatch
}