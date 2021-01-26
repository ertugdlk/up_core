const util = require('util')
const avaible = 'avaible_servers'
const busy = 'busy_servers'
var redis = require("redis-mock"),
    client = redis.createClient();

client.rpush = util.promisify(client.rpush)
client.rpop = util.promisify(client.rpop)
client.lrange = util.promisify(client.lrange)
client.set = util.promisify(client.set)

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

    afterEach(async () => {
        client.quit()
    })
})