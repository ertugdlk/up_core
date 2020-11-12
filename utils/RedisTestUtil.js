const redis = require('redis')
const client = redis.createClient({
    port: 6379
})

const createRoom = async (SocketId , GameRoomObject) => {
    try
    {
        const encodedGameRoom = JSON.stringify(GameRoomObject)
        const message = await client.set('room:'+SocketId, encodedGameRoom)   

        if(message === "OK"){
            return 'success'
        }
        else{
            return 'failed'
        }
    }
    catch(err)
    {
        throw error
    }
}

const getRoom = async (SocketId) => {
    try
    {
        const encodedGameRoom = await client.GET('room:'+SocketId)
        const decodedGameRoom = JSON.parse(encodedGameRoom)

        if(decodedGameRoom)
        {
            return "success"
        }
        else
        {
            return "failed"
        }
    }
    catch(error)
    {
        throw error
    }
}

const closeRoom = async (SocketId) => {
    try
    {
        await client.del('room:'+SocketId)
    }
    catch(error)
    {
        throw error
    }
}

module.exports = {
    getRoom,
    createRoom,
    closeRoom
}