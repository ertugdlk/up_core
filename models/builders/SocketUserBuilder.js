const _ = require('lodash')

class SocketUserBuilder {
    constructor() {
        this.socketUser = {}
    }
    nickname(nickname) {
        this.socketUser.nickname = nickname
        return this
    }
    sockets(sockets) {
        this.socketUser.sockets = sockets
        return this
    }

    build() {
        const createdSocketUser = _.chain(this.socketUser).value()

        return createdSocketUser
    }

}

module.exports = SocketUserBuilder