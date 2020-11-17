const { createRoom, closeRoom, getRoom, getRooms } = require('./RedisUtil')

class Websockets {
    connection(client) {
        console.log('a user connected')

        client.emit("getRooms", () => {
            getRooms((err, data) => {
                if (err) {
                    throw err
                }
                const list = data
                const rooms = []
                list.map(key => {
                    getRoom(key, (err, result) => {
                        rooms.push(result)
                    })
                })
            })
        })

        client.on("create", (gameData) => {
            const returnMessage = createRoom(client.id, gameData)
            const rooms = getRooms()
            client.emit("createReturn", (returnMessage))
        })

        client.on("join", (socketId) => {
            client.to("socketId")
        })

        client.on("close", () => {
            closeRoom(client.id)
        })
    }
}

module.exports = new Websockets()