const _ = require('lodash')

class GameRoomBuilder {
    constructor() {
        this.gameRoom = {}
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
    }

    EntryFee(EntryFee) {
        this.gameRoom.EntryFee = EntryFee
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