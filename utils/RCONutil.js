const {Rcon} = require('rcon-client')
const Config = require('config')

const _rcon = Rcon.connect({
    host: process.env.RCON_HOST,
    port: Config.get('rcon.port'),
    password: process.env.RCON_PASS
})

async function gameStatus(){
    try{
        const rcon = new Rcon({ host: process.env.RCON_HOST, port: Config.get('rcon.port'), password: process.env.RCON_PASS })
        await rcon.connect()
        const response = await Promise.all([rcon.send("get5_status")])
        return response
    }
    catch(error)
    {
        throw error
    }
}

module.exports = {
    gameStatus
}