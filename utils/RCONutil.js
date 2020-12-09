const rcon = require('rcon-client')
const Config = require('config')

const _rcon = await rcon.connect({
    host: process.env.RCON_HOST,
    port: Config.get('rcon.port'),
    password: process.env.RCON_PASS
})

async function gameStatus(){
    const response = await _rcon.send("get5_status")
    return response
}