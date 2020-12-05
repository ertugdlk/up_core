const RCON = require('rcon-client')
const Config = require('config')

const rcon = await RCON.connect({
    host: Config.get("rcon.host"),
    port: Config.get('rcon.port'),
    password: Config.get('rcon.password')
})

async function gameStatus(){
    const response = await rcon.send("get5_status")
    return response
}