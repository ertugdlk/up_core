const util = require('util')
const redis = require('redis')
const client = redis.createClient({
    port: process.env.redis_port,
    host: process.env.redis_host,
    password: process.env.redis_password
})

const avaible = 'avaible_servers'
const busy = 'busy_servers'
client.rpush = util.promisify(client.rpush)
client.rpop = util.promisify(client.rpop)
client.lrange = util.promisify(client.lrange)
client.set = util.promisify(client.set)

async function setRCONinformation(matchid, rconinformation) {
    try {
        await client.set(matchid, rconinformation)
    }
    catch (error) {
        throw error
    }
}

//Avaible Servers 
async function addAvaibleServer(serverInformation) {
    try {
        await client.rpush(avaible, serverInformation)
    }
    catch (error) {
        throw error
    }
}

async function removeAvaibleServer() {
    try {
        await client.rpop(avaible)
    }
    catch (error) {
        throw error
    }
}

async function getAvaibleServers() {
    try {
        const response = await client.lrange(avaible, 0, -1)
        return response
    }
    catch (error) {
        throw error
    }
}

async function getAvaibleServer() {
    try {
        const response = await client.lrange(avaible, -1, -1)
        return response
    }
    catch (error) {
        throw error
    }
}

//Busy Servers 
async function addBusyServer(serverInformation) {
    try {
        await client.rpush(busy, serverInformation)
    }
    catch (error) {
        throw error
    }
}

async function removeBusyServer() {
    try {
        await client.rpop(busy)
    }
    catch (error) {
        throw error
    }
}

async function getBusyServers() {
    try {
        const response = await client.lrange(busy, 0, -1)
        return response
    }
    catch (error) {
        throw error
    }
}

async function getBusyServer() {
    try {
        const response = await client.lrange(busy, -1, -1)
        return response
    }
    catch (error) {
        throw error
    }
}

module.exports = {
    addAvaibleServer,
    removeAvaibleServer,
    getAvaibleServers,
    getAvaibleServer,
    addBusyServer,
    removeBusyServer,
    getBusyServers,
    getBusyServer,
    setRCONinformation,
}