const util = require('util')
const avaible = 'avaible_servers'
const busy = 'busy_servers'
var redis = require("redis-mock"),
    client = redis.createClient();

client.rpush = util.promisify(client.rpush)
client.rpop = util.promisify(client.rpop)
client.lrange = util.promisify(client.lrange)
client.set = util.promisify(client.set)
client.del = util.promisify(client.del)
client.get = util.promisify(client.get)

async function getAvaibleServer() {
    try {
        const response = await client.lrange(avaible, -1, -1)
        return response
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

async function setRCONinformation(matchid, rconinformation) {
    try {
        await client.set(matchid, rconinformation)
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

describe('Redis Util functions tests', () => {

    it('getAvaibleServer', async () => {
        try {
            await client.rpush("avaible_servers", "{host:'123', password: 123, port:123}")
            const deneme = await client.lrange("avaible_servers", -1, -1)
            expect(deneme[0]).toBe("{host:'123', password: 123, port:123}")
        }
        catch (error) {
            throw error
        }
    })

    it('RconUtil getavaibleservers empty situation', async () => {
        try {
            await client.rpush("deneme", "{host:'123', password: 123, port:123}")
            await client.rpop("deneme")
            const serverStringArrays = await client.lrange("deneme", 0, -1)
            expect(serverStringArrays.length).toBe(0)
        }
        catch (error) {
            throw error
        }
    })

    it('RconUtil tracking redis operations test', async () => {
        try {
            await client.del(avaible)
            await client.rpush(avaible, "{host:'123', password: 123, port:123}")
            await client.rpush(avaible, "{host:'124', password: 123, port:123}")

            const serverStringArray = await getAvaibleServers()
            expect(serverStringArray.length).toBe(2)

            const serverString = await getAvaibleServer()
            expect(serverString[0]).toBe("{host:'124', password: 123, port:123}")

            await setRCONinformation("roomid", serverString[0])
            await removeAvaibleServer()
            const serverStringArray2 = await getAvaibleServers()
            expect(serverStringArray2.length).toBe(1)

            const serverString2 = await getAvaibleServer()
            expect(serverString2[0]).toBe("{host:'123', password: 123, port:123}")
        }
        catch (error) {
            throw error
        }
    })

    it("AWS matchresultV2 Lambda function operations test", async () => {
        try {
            await client.del(avaible)
            await client.rpush(avaible, "{host:'123', password: 123, port:123}")
            const serverStringArray = await getAvaibleServers()
            expect(serverStringArray.length).toBe(1)

            const information = await client.get("roomid")
            expect(information).toBe("{host:'124', password: 123, port:123}")

            await client.del("roomid")
            await client.rpush(avaible, information)
        }
        catch (error) {

        }
    })

    afterEach(async () => {
        client.quit()
    })
})