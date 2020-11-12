const _ = require('lodash')

class GameRoomBuilder {
    constructor() {
        this.gameRoom = {}
    }
    GameId(GameId){
        this.gameRoom.GameId = GameId
        return this
    }

    GameName(GameName) {
        this.gameRoom.GameName = GameName
        return this
    }

    GameMap(GameMap) {
        this.gameRoom.GameMap = GameMap
        return this
    }

    GameType(GameType) {
        this.gameRoom.GameType = GameType
        return this
    }

    EntryFee(EntryFee) {
        this.gameRoom.EntryFee = EntryFee
        return this
    }

    Reward(Reward) {
        this.gameRoom.Reward = Reward
        return this
    }

    CreatedAt(CreatedAt) {
        this.gameRoom.CreatedAt = CreatedAt
        return this
    }

    Host(Host) {
        this.gameRoom.Host = Host
        return this
    }

    build() {
        const clearedGameRoom = _.chain(this.gameRoom)

        return clearedGameRoom
    }

}

module.exports = GameRoomBuilder