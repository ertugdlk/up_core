const { createRoom, closeRoom, getRoom, getRooms } = require('./RedisUtil')
const SocketUserBuilder = require('../models/builders/SocketUserBuilder')
const GameRoom = require('../models/GameRoom')
const GameRoomInfo = require('../models/GameRoomInfo')
const _ = require('lodash')
var clients = []

async function findHostedRoom(data_nickname)
{
    const hostedRoom = await GameRoom.findOne({host: data_nickname})
    if(hostedRoom){
        //if there was any room or operation Host by this user unset expire date for them
        await GameRoom.update(hostedRoom._id, { $unset: { expireAt: 1 }})
    }
}

async function findOpenedRoom(client,data_nickname)
{
    const openedRoom = await GameRoom.findOne({users: data_nickname})
    if(openedRoom){
        client.to(openedRoom.roomId)
    }
}

class Websockets {

    connection(client) {
        //Nickname cookie den mi çekilsin yoksa client mi göndersin
        //const cookies = cookie.parse(socket.request.headers.cookie || '');

        client.on("login" , (data_nickname) => {
            //check data nickname exist or not
            console.log(data_nickname)

            const user = _.filter(clients, {nickname: data_nickname})
            console.log(user[0])
            if(!user[0] ){
                //check user host in any opened room
                findHostedRoom(data_nickname)
                //if there was any room or operation Host by this user unset expire date for them
                findOpenedRoom(client, data_nickname)

                const sockets = [client.id]
                const newUserBuilder = new SocketUserBuilder()
                                        .nickname(data_nickname)
                                        .sockets(sockets)

                const newUser = newUserBuilder.build()
                clients.push(newUser)
                console.log(clients)
            }
            else{
                user[0].sockets.push(client.id)
                //Check User's operations and apply them to new connection
                //Find roomId with nickname on MongoDB room table
                findOpenedRoom(client, data_nickname)
            }

            console.log(data_nickname + client.id + ' user connected')
        })

        client.on("create", async (gameData) => {
            //save room in MongoDB info and room

            const gameInfo = new GameRoomInfo()
            await gameInfo.save()

            const gameRoom = new GameRoom()
            await gameRoom.save()

            //send client to room 
            client.to(gameRoom.roomId)

            //on every create send set new rooms for every socket
            client.emit('newRoom' , gameInfo)
        })

        client.on("join",  (socketId) => {
            client.to("socketId")
        })

        client.on("close", () => {
            closeRoom(client.id)
        })

        client.on('disconnect', async(data) => {
            //Check running or waiting game room for user
            //if there is no exist game room just disconnect

            //delete this client id from clients array
            const user = _.filter(clients, {nickname: data.nickname})

            const openedRoom = await GameRoom.findOne({host: data.nickname})
            if(openedRoom)
            {
                //Exist game room => MongoDB keep this nickname 3-5 mins in game room data
                //Set expire date for created or hosted room
                await GameRoom.update(openedRoom._id, { expireAt: moment().add(3, 'minutes')})
                //send emit to room with 3min close message
                client.emit('')
            }
            console.log(client.id + ' disconnected')
        })
    }
}

module.exports = new Websockets()