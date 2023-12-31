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
        const serverStringArray = await redisUtil.getAvaibleServers()
        if (serverStringArray.length == 0) {
            throw new Error('No Any Empty Server');
        }

        else {
            const room = await GameRoom.findOne({ host: host })
            room.status = 'playing'
            await room.save()
            const serverString = await redisUtil.getAvaibleServer()
            const serverJson = JSON.parse(serverString[0])

            //Redis operations to track servers
            await redisUtil.setRCONinformation(room.roomId, serverString[0])
            await redisUtil.removeAvaibleServer()


            //RCON Connection
            const rcon = await Rcon.connect({ host: serverJson.host, port: serverJson.port, password: serverJson.password })

            //RCON request to receive match config
            const url = process.env.BASE_URL + "rcon/matchconfig?host=" + host
            const response = await Promise.all([rcon.send("get5_endmatch"), rcon.send("get5_loadmatch_url" + ' "' + url + '"')])

            //socket operation
            global.io.in(room.roomId).emit("ipInfo", ({ ip: serverJson.host }))

            return serverJson.host
        }

    }
    catch (error) {
        throw error
    }
}

async function matchSettings(host) {

    try {
        const room = await GameRoom.findOne({ host: host })

        //Matchconfig preparation
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
        matchconfig.team1.name = room.roomId + ':1'
        matchconfig.team2.name = room.roomId + ':2'
        matchconfig.team1.players = gameteam1
        matchconfig.team2.players = gameteam2
        matchconfig.maplist = [room.settings.map]
        matchconfig.players_per_team = team1.length
        matchconfig.min_players_to_ready = team1.length * 2
        matchconfig.cvars.hostname = "Unknownpros" + host
        console.log(matchconfig)
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