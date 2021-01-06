const util = require('util')
const redis = require('redis')
const client = redis.createClient({
    port: process.env.redis_port,
    host: process.env.redis_host,
    password: process.env.redis_password
})

const avaible = 'avaible_servers'
const busy = 'busy_servers'
const listPush = util.promisify(client.RPUSH)
const listPop = util.promisify(client.RPOP)
const listElements = util.promisify(client.LRANGE)

//Avaible Servers 
async function addAvaibleServer(serverInformation) {
    try {
        await listPush(avaible, serverInformation)
    }
    catch (error) {
        throw error
    }
}

async function removeAvaibleServer() {
    try {
        await listPop(avaible)
    }
    catch (error) {
        throw error
    }
}

async function getAvaibleServers() {
    try {
        const response = await listElements(avaible, 0, -1)
        return response
    }
    catch (error) {
        throw error
    }
}

async function getAvaibleServer() {
    try {
        const response = await listElements(avaible, -1, -1)
        return response
    }
    catch (error) {
        throw error
    }
}

//Busy Servers 
async function addBusyServer(serverInformation) {
    try {
        await listPush(busy, serverInformation)
    }
    catch (error) {
        throw error
    }
}

async function removeBusyServer() {
    try {
        await listPop(busy, serverInformation)
    }
    catch (error) {
        throw error
    }
}

async function getBusyServers() {
    try {
        const response = await listElements(busy, 0, -1)
        return response
    }
    catch (error) {
        throw error
    }
}

async function getBusyServer() {
    try {
        const response = await listElements(busy, -1, -1)
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
    getBusyServer
}