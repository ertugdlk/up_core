const SocketUserBuilder = require('../models/builders/SocketUserBuilder')
const GameRoom = require('../models/GameRoom')
const GameRoomInfo = require('../models/GameRoomInfo')
const ChatHistory = require('../models/ChatHistory')
const RoomBlackList = require('../models/RoomBlackList')
const Balance = require('../models/Balance')
const User = require('../models/User')
const moment = require('moment')
const _ = require('lodash')
const Game = require('../models/Game')
var clients = []
//bu array global mi

async function findHostedRoomUpdate(client, data_nickname) {
    const hostedRoom = await GameRoom.findOne({ host: data_nickname })
    if (hostedRoom) {
        //if there was any room or operation Host by this user unset expire date for them
        await GameRoom.updateOne({ _id: hostedRoom._id }, { $unset: { expireAt: 1 } })
        client.emit("openedRoom", ({ room: hostedRoom, nickname: data_nickname }))
        client.join(hostedRoom.roomId)
    }
}

async function findOpenedRoomUpdate(client, data_nickname) {
    const openedRoom = await GameRoom.findOne({ users: { $elemMatch: { nickname: data_nickname } } })
    if (openedRoom) {
        client.emit("openedRoom", ({ room: openedRoom, nickname: data_nickname }))
        client.join(openedRoom.roomId)
    }
}

async function deleteHostedRoom(data_nickname) {
    const openedRoom = await GameRoom.findOne({ host: data_nickname })
    if (openedRoom) {
        //Exist game room => MongoDB keep this nickname 3-5 mins in game room data
        //Set expire date for created or hosted room
        await GameRoom.updateOne({ _id: openedRoom._id }, { $set: { expireAt: moment().add(3, 'minutes') } })
        //send emit to room with 3min close message

        client.emit('closeRoom', 3600)
    }
}

async function checkHostedRoom(nickname) {
    const hostedRoom = await GameRoom.findOne({ host: nickname })
    if (hostedRoom) {
        return true
    }
    else {
        return false
    }
}

async function checkJoinedRoom(nickname) {
    const joinedRoom = await GameRoom.findOne({ users: { $elemMatch: { nickname: nickname } } })
    if (joinedRoom) {
        return true
    }
    else {
        return false
    }
}

async function checkBalanceIsEnough(nickname, fee) {
    const user = await User.findOne({ nickname: nickname })
    const wallet = await Balance.findOne({ user: user._id })

    if (wallet.balance >= fee) {
        return true
    }
    else {
        return false
    }
}

class Websockets {

    connection(client) {
        //Nickname cookie den mi çekilsin yoksa client mi göndersin
        //const cookies = cookie.parse(socket.request.headers.cookie || '');

        client.on("login", async (data_nickname) => {
            try {
                //check data nickname exist or not
                console.log(data_nickname)

                const user = _.filter(clients, { nickname: data_nickname })
                console.log(user[0])
                if (!user[0]) {
                    //check user host in any opened room
                    findHostedRoomUpdate(client, data_nickname)
                    //if there was any room or operation Host by this user unset expire date for them
                    findOpenedRoomUpdate(client, data_nickname)

                    const sockets = [client.id]
                    const newUserBuilder = new SocketUserBuilder()
                        .nickname(data_nickname)
                        .sockets(sockets)

                    const newUser = newUserBuilder.build()
                    clients.push(newUser)
                    console.log(clients)
                }
                else {
                    user[0].sockets.push(client.id)
                    //Check User's operations and apply them to new connection
                    //Find roomId with nickname on MongoDB room table
                    findOpenedRoomUpdate(client, data_nickname)
                }
                console.log(data_nickname + client.id + ' user connected')
            }
            catch (error) {
                throw error
            }
        })

        client.on("create", async (gameData) => {
            try {
                //check user in any room or not ?
                const result = await checkHostedRoom(gameData.host)

                const isEnoughBalance = checkBalanceIsEnough(gameData.host, gameData.fee)

                if (result == true || isEnoughBalance == false) {
                    if (result == true) {
                        client.emit('Error', 'Already have joined or hosted Room')
                    }
                    else if (isEnoughBalance == false) {
                        client.emit('Error', 'Not enough UP to create room')
                    }
                }
                else {
                    let roomUsers = [{ nickname: gameData.host, team: 1, readyStatus: 1 }]
                    //save room in MongoDB info and room
                    const gameInfo = new GameRoomInfo({ room: client.id, name: gameData.name, type: gameData.type, host: gameData.host, map: gameData.map, fee: gameData.fee, reward: gameData.fee * 2, createdAt: gameData.createdAt })
                    const savedGameInfo = await gameInfo.save()

                    const gameRoom = new GameRoom({ roomId: client.id, settings: { type: gameData.type, map: gameData.map }, team1: 1, users: roomUsers, roomInfo: savedGameInfo._id, host: gameData.host, reward: gameData.fee * 2 })
                    const savedRoom = await gameRoom.save()

                    //send client to room 
                    client.join(gameRoom.roomId)

                    client.emit('roomCreated', savedRoom)
                    client.emit("openedRoom", ({ room: savedRoom, nickname: gameData.host }))
                    //on every create send set new rooms for every socket
                    var type = "free"
                    if (gameInfo.fee != 0) {
                        type = "paid"
                    }
                    global.io.local.emit('newRoom', { gameInfo: gameInfo, type: type })

                    //create a chatlog for the room that expires in 7 days
                    const chatHistory = new ChatHistory({ room: savedRoom._id, messages: { message: "Game Room Created", nickname: "_DEFAULT_MESSAGE_SENDER" } })
                    await chatHistory.save()

                    //create a blacklist for room
                    const blackList = new RoomBlackList({ room: savedRoom._id, users: [] })
                    await blackList.save()
                }
            }
            catch (error) {
                throw error
            }
        })


        client.on("message", async (data) => {
            try {
                const room = await GameRoom.findOne({ host: data.host })
                const messageObject = { nickname: data.nickname, message: data.msg }

                //add mesages to chat history
                const chatHistory = await ChatHistory.findOne({ room: room._id })
                chatHistory.messages.push({ nickname: messageObject.nickname, message: messageObject.message })
                await chatHistory.save()

                global.io.in(room.roomId).emit("newMessage", (messageObject))
            }
            catch (error) {
                throw error
            }
        })

        client.on("join", async (data) => {
            try {

                //const joinedRoom = await checkJoinedRoom(data.nickname)
                const room = await GameRoom.findOne({ host: data.host })

                //const blackList = await RoomBlackList.findOne({ room: room._id })
                const roomUserLimit = parseInt(room.settings.type.charAt(0)) * 2
                /*
                const checkBlackList = _.find(blackList.users, (user) => {
                    return data.nickname == user.nickname
                })
                */
                const fee = room.reward / 2
                const isEnoughBalance = await checkBalanceIsEnough(data.nickname, fee)

                if (room.users.length == roomUserLimit || isEnoughBalance == false) {
                    if (room.users.length == roomUserLimit) {
                        client.emit('Error', 'Room is full')
                    }
                    else if (isEnoughBalance == false) {
                        client.emit('Error', 'Not enough UP to join')
                    }
                    else {
                        client.emit('Error', 'Error')
                    }
                }
                else {
                    let t;
                    if (room.team1 > room.team2) {
                        t = 2;
                        room.team2 += 1
                    } else {
                        t = 1;
                        room.team1 += 1
                    }
                    room.users.push({ nickname: data.nickname, team: t })

                    const savedRoom = await room.save()
                    const roomInfo = await GameRoomInfo.findOne({ host: data.host })
                    roomInfo.userCount = roomInfo.userCount + 1
                    await roomInfo.save()

                    //connect this socketId to gameroom's roomid
                    client.join(room.roomId)
                    client.emit("roomData", (savedRoom))
                    global.io.in(room.roomId).emit("newUserJoined", ({ nickname: data.nickname, team: t, readyStatus: 0 }))

                    var type = "free"
                    if (fee != 0) {
                        type = "paid"
                    }
                    global.io.local.emit("userCountChange", ({ host: data.host, positive: true, type: type }))
                    client.emit("openedRoom", ({ room: savedRoom, nickname: data.nickname }))
                }
            }
            catch (error) {
                throw error
            }
        })



        client.on("ready", async (data) => {
            try {
                const room = await GameRoom.findOne({ host: data.host })
                const user = _.find(room.users, { nickname: data.nickname })//find which user is leaving
                const ready = user.readyStatus

                if (!ready) {
                    await GameRoom.updateOne({ _id: room._id, 'users.nickname': data.nickname },
                        { "$set": { "users.$.readyStatus": 1 } })
                    const changedMember = { nickname: data.nickname }
                    const updatedRoom = await GameRoom.findOne({ _id: room._id })
                    const roomUserLimit = parseInt(updatedRoom.settings.type.charAt(0)) * 2
                    updatedRoom.readyCount += 1
                    await updatedRoom.save()
                    if (updatedRoom.readyCount == roomUserLimit) {
                        global.io.in(room.roomId).emit("GameReadyStatus", ({ host: updatedRoom.host, msg: 'all_ready' }))
                    }
                    global.io.in(room.roomId).emit("readyChange", ({ host: updatedRoom.host, member: changedMember }))
                } else {
                    await GameRoom.updateOne({ _id: room._id, 'users.nickname': data.nickname },
                        { "$set": { "users.$.readyStatus": 0 } })
                    const changedMember = { nickname: data.nickname }
                    const updatedRoom = await GameRoom.findOne({ _id: room._id })
                    updatedRoom.readyCount -= 1
                    await updatedRoom.save()
                    global.io.in(room.roomId).emit("GameReadyStatus", ({ host: updatedRoom.host, msg: 'not_ready' }))
                    global.io.in(room.roomId).emit("readyChange", ({ host: updatedRoom.host, member: changedMember }))
                }
            } catch (error) {
                throw error
            }
        })

        client.on('countdown', async (data) => {
            try {
                const gameRoom = await GameRoom.findOne({ host: data.host })
                const returnData = { msg: 'Game is starting...' }
                global.io.in(gameRoom.roomId).emit("countdownStart", (returnData))
            }
            catch (error) {
                throw error
            }
        })

        client.on('stopCountdown', async (data) => {
            try {
                const gameRoom = await GameRoom.findOne({ host: data.host })
                const returnData = { msg: 'Countdown stopped' }
                global.io.in(gameRoom.roomId).emit("countdownStop", (returnData))
            }
            catch (error) {
                throw error
            }
        })

        client.on('started', async ({ host }) => {
            try {
                const room = await GameRoom.findOneAndUpdate({ host: host }, { status: 'playing' })
                var users = room.users

                users.map(async (user) => {
                    const user_ = await User.findOne({ nickname: user.nickname })
                    var balanceOfUser = await Balance.findOne({ user: user_._id })
                    balanceOfUser.balance -= (room.reward / 2)
                    balanceOfUser.balanceOnHold += (room.reward / 2)
                    await balanceOfUser.save()
                })
                /*
                users.forEach(user => {
                    const nickname = 
                    const user_ = await User.findOne({ nickname: user.nickname })
                    var balanceOfUser = await Balance.findOne({ user: user_._id })
                    balanceOfUser.balance -= (room.reward / 2)
                    balanceOfUser.balanceOnHold += (room.reward / 2)
                    await balanceOfUser.save()
                });
                */
                //delete the blacklist when the game is started since the room will be closed after endgame
                await RoomBlackList.findOneAndDelete({ room: room._id })

                await GameRoomInfo.findByIdAndDelete({ host: host })
                //Delete room from react room list
                var type = "free"
                if (room.reward != 0) {
                    type = "paid"
                }
                global.io.local.emit("roomDeleted", ({ host: host, type: type }))
            }
            catch (error) {
                throw error
            }
        })

        client.on('mapselection', async ({ host, bannedMap, team }) => {
            try {
                const room = await GameRoom.findOne({ host: host })
                global.io.in(room.roomId).emit("nextTurn", ({ bannedMap, team }))
            }
            catch (error) {
                throw error
            }
        })

        client.on('changeTeam', async (data) => {
            try {
                const gameroom = await GameRoom.findOne({ host: data.host })

                const user = _.find(gameroom.users, (user) => {
                    return user.nickname == data.nickname
                })

                var newTeam;
                if (user.team == 1) {
                    newTeam = 2
                }
                else {
                    newTeam = 1
                }

                await GameRoom.updateOne({ _id: gameroom._id, 'users.nickname': data.nickname },
                    { "$set": { "users.$.team": newTeam } })

                const changedMember = { nickname: data.nickname, newTeam: newTeam, oldTeam: user.team }
                global.io.in(gameroom.roomId).emit("teamChange", (changedMember))
            } catch (error) {
                throw error
            }
        })

        client.on('kick', async ({ host, nickname }) => {
            try {
                const room = await GameRoom.findOne({ host: host })
                const blackList = await RoomBlackList.findOne({ room: room._id })
                const user = _.find(room.users, { nickname: nickname })
                blackList.users.push({ nickname: nickname })
                await blackList.save()

                var type = "free"
                if (room.reward != 0) {
                    type = "paid"
                }
                global.io.in(room.roomId).emit('userKicked', ({ nickname: nickname, team: user.team, host: host, type: type }))
                //const user = _.find(room.users, { nickname: nickname })//find which user kicked

            }
            catch (error) {
                throw error
            }
        })


        /*
        Blacklist i sil (oda kapanırken)
        */
        client.on("leave", async (data) => {
            try {
                const room = await GameRoom.findOne({ host: data.host })
                const user = _.find(room.users, { nickname: data.nickname })//find which user is leaving
                const t = user.team //find users team (1 or 2)

                if (t === 1) {
                    await room.update({ team1: (room.team1 - 1) })
                } else if (t === 2) {
                    await room.update({ team2: (room.team2 - 1) })
                }

                const roomInfo = await GameRoomInfo.findOne({ host: data.host })
                roomInfo.userCount -= 1
                await roomInfo.save()
                var type = "free"
                if (roomInfo.fee != 0) {
                    type = "paid"
                }

                if (user.nickname === data.host) {
                    if (roomInfo.userCount === 0) {
                        await RoomBlackList.findOneAndDelete({ room: room._id })
                        await GameRoom.findByIdAndDelete(room._id)
                        await GameRoomInfo.findByIdAndDelete(roomInfo._id)
                        global.io.local.emit("roomDeleted", ({ host: data.host, type: type }))
                    }
                    else {
                        //DB READYCOUNT
                        var newReadyCount = room.readyCount - 1
                        await GameRoom.updateOne({ _id: room._id }, { readyCount: newReadyCount })
                        await GameRoom.updateOne({ _id: room._id, 'users.nickname': data.nickname },
                            {
                                $pull: { users: { nickname: data.nickname } }//pull user out of the array
                            })
                        if (room.users[1].readyStatus == 0) {
                            newReadyCount += 1
                            await GameRoom.updateOne({ _id: room._id }, { readyCount: newReadyCount })
                        }

                        //DB HOST FIELD UPDATE
                        await GameRoom.updateOne({ _id: room._id }, { host: room.users[1].nickname })
                        await GameRoomInfo.updateOne({ host: data.host }, { host: room.users[1].nickname })

                        //NEWHOST READY STATUS
                        await GameRoom.updateOne({ _id: room._id, 'users.nickname': room.users[1].nickname },
                            { "$set": { "users.$.readyStatus": 1 } })

                        global.io.local.emit("hostChanged", { host: data.host, newHost: room.users[1].nickname, type: type })
                        global.io.in(room.roomId).emit("HostLeft", ({ host: user, newHost: room.users[1] }))
                        global.io.local.emit("userCountChange", ({ host: room.users[1].nickname, positive: false, type: type }))
                    }
                }
                else if (user.nickname !== data.host) {
                    await GameRoom.updateOne({ _id: room._id, 'users.nickname': data.nickname },
                        {
                            $pull: { users: { nickname: data.nickname } }//pull user out of the array
                        })
                    global.io.in(room.roomId).emit("UserLeft", (user))
                    global.io.local.emit("userCountChange", ({ host: data.host, positive: false, type: type }))
                }

                client.leave(room.roomId)
            }
            catch (error) {
                throw error
            }
        })

        client.on("close", () => {
            //closeRoom(client.id)
        })

        client.on('disconnect', async () => {
            //Check running or waiting game room for user
            //if there is no exist game room just disconnect
            try {
                //delete this client id from clients array
                const user = _.find(clients, function (client_user) {
                    return _.filter(client_user.sockets, client.id)
                })

                _.remove(user.sockets, function (socket) {
                    return socket == client.id
                })

                if (user.sockets.length == 0) {
                    _.remove(clients, function (client_user) {
                        return client_user.nickname == user.nickname
                    })
                }

                //deleteHostedRoom(user.nickname)
            }
            catch (error) {
                throw error
            }
        })
    }
}

module.exports = new Websockets()