const {createRoom, closeRoom , getRoom} = require('./RedisUtil')

class Websockets {
    connection(client) {
        client.on("create" , (gameData) => {
            const returnMessage = createRoom(client.id, gameData)
            client.emit("createReturn" , (returnMessage))
        })

        client.on("join" , (socketId) => {
            client.to("socketId")
        })

        client.on("close", () => {
            closeRoom(client.id)
          });
    }
}

module.exports =  new Websockets()