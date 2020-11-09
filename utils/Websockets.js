
class Websockets {
    connection(client) {
        client.on("join" , (msg) => {
            console.log('connected' + msg)
        })

        client.on("disconnect", () => {
            console.log('User disconnected')
          });
    }
}

module.exports =  new Websockets()