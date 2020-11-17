const redis = require('redis')
const client = redis.createClient({
    port: process.env.redis_port,
    host: process.env.redis_host,
    password: process.env.redis_password
})

const createRoom = async (SocketId, GameRoomObject) => {
    try {
        const encodedGameRoom = JSON.stringify(GameRoomObject)
        const message = await client.set('room:' + SocketId, encodedGameRoom)

        if (message === "OK") {
            return 'success'
        }
        else {
            return 'failed'
        }
    }
    catch (err) {
        throw error
    }
}

function getRooms(callback) {
    try {
        client.scan(0, (err, reply) => {
            if (err) {
                return err
            }
            callback(reply)
        })
    }
    catch (error) {
        throw error
    }

}

function getRoom(key, callback) {
    try {
        client.GET(key, (err, data) => {
            if (err) {
                return 'failed' + err
            }

            const decodedGameRoom = JSON.parse(data)
            callback(decodedGameRoom)
        })
    }
    catch (error) {
        throw error
    }
}

const closeRoom = async (SocketId) => {
    try {
        await client.del('room:' + SocketId)
    }
    catch (error) {
        throw error
    }
}

module.exports = {
    getRoom,
    createRoom,
    closeRoom,
    getRooms,
}