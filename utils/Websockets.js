const { createRoom, closeRoom, getRoom, getRooms } = require('./RedisUtil')
const SocketUserBuilder = require('../models/builders/SocketUserBuilder')
const GameRoom = require('../models/GameRoom')
const GameRoomInfo = require('../models/GameRoomInfo')
const moment = require('moment')
const _ = require('lodash')
var clients = []
//bu array global mi

async function findHostedRoomUpdate(data_nickname) {
    const hostedRoom = await GameRoom.findOne({ host: data_nickname })
    if (hostedRoom) {
        //if there was any room or operation Host by this user unset expire date for them
        await GameRoom.update(hostedRoom._id, { $unset: { expireAt: 1 } })
    }
}

async function findOpenedRoomUpdate(client, data_nickname) {
    const openedRoom = await GameRoom.findOne({ users: data_nickname })
    if (openedRoom) {
        client.to(openedRoom.roomId)
    }
}

async function deleteHostedRoom(data_nickname) {
    const openedRoom = await GameRoom.findOne({ host: data_nickname })
    if (openedRoom) {
        //Exist game room => MongoDB keep this nickname 3-5 mins in game room data
        //Set expire date for created or hosted room
        await GameRoom.update(openedRoom._id, { createdAt: {expires : moment().add(3, 'minutes')} })
        //send emit to room with 3min close message
        
        client.emit('closeRoom', 3600)
    }
}

async function checkHostedRoom(nickname)
{
    const hostedRoom = await GameRoom.findOne({host: nickname})
    if(hostedRoom)
    {
        return true
    }
    else{
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
                    findHostedRoomUpdate(data_nickname)
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

        client.on("create", async (nickname, gameData) => {
            try{
                //check user in any room or not ?
                const result = checkHostedRoom(nickname)
                if(result == true)
                {
                    client.emit('Error', 'hosted_room')
                }
                else
                {
                    //save room in MongoDB info and room
                    const gameInfo = new GameRoomInfo({room: client.id, name: gameData.name , type: gameData.type, host:gameData.host,  map: gameData.map, fee: gameData.fee, reward: gameData.fee*2, createdAt: gameData.createdAt})
                    const savedGameInfo = await gameInfo.save()

                    const gameRoom = new GameRoom({roomId: client.id, roomInfo: savedGameInfo._id, host: gameData.host})
                    await gameRoom.save()

                    //send client to room 
                    client.to(gameRoom.roomId)

                    //on every create send set new rooms for every socket
                    client.broadcast.emit('newRoom' , gameInfo)
                }
            }
            catch (error) {
                throw error
            }
        })

        client.on("join", async (nickname, host) => {
            try {
                //find GameRoom and update users array with nickname
                const room = await GameRoom.findOneAndUpdate({ host: host },
                    {
                        $push: { 'users': nickname }
                    })
                await room.save()

                //find gameroominfo with socket id and update userCount field
                const roomInfo = await GameRoomInfo.findOne({ host: host })
                roomInfo.userCount = roomInfo.userCount + 1
                await roomInfo.save()

                //connect this socketId to gameroom's roomid
                client.to(room.roomId)
            }
            catch (error) {
                throw error
            }
        })

        client.on("leave", async (nickname, host) => {
            const room = await GameRoom.findOneAndUpdate({ host: host },
                {
                    $pull: { 'users': nickname }
                })
            await room.save()

            const roomInfo = await GameRoomInfo.findOne({ host: host })
            roomInfo.userCount -= 1
            await roomInfo.save()
            client.leave(room.roomId)
            client.to(room.roomId).emit('leftMessage', nickname);
        })

        client.on("close", () => {
            closeRoom(client.id)
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

                deleteHostedRoom(user.nickname)
            }
            catch (error) {
                throw error
            }
        })
    }
}

module.exports = new Websockets()