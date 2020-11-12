const GameRoomBuilder = require('../models/builders/GameRoomBuilder');
const { createRoom, getRoom, closeRoom } = require('../utils/RedisTestUtil')
const gameRoomData = { GameId: '123', GameName: 'CSGO', GameMap: 'DUST2', GameType: '1V1', EntryFee: '10USD', Reward: '15USD', CreatedAt: '12.11.2020', Host: 'ERCE' }
const gameRoomData2 = { GameId: '1234', GameName: 'CSGO2', GameMap: 'DUST3', GameType: '2V2', EntryFee: '100USD', Reward: '175USD', CreatedAt: '13.11.2020', Host: 'ERCECAN' }
describe("Redis Test", () => {

    it("Game Builder createRoom check", async () => {
        const gameroomobject = new GameRoomBuilder(gameRoomData)
        const createdRoom = createRoom('socket_id', gameroomobject)
        expect(createdRoom.Host).toBe(gameRoomData.Host)
        //expect(createdRoom.EntryFee).toBe(gameRoomData.EntryFee)
        //expect(createdRoom.Reward).toBe(gameRoomData.Reward)
        //expect(createdRoom.GameId).toBe(gameRoomData.GameId)
    });

    it("Game Builder getRoom check", async () => {
        const gameroomobject2 = new GameRoomBuilder(gameRoomData2)
        createRoom('socket_id2', gameroomobject2)
        const room = getRoom('socket_id2')
        expect(room.Host).toBe(gameRoomData.Host)
        //expect(room.EntryFee).toBe(gameRoomData.EntryFee)
        //expect(room.Reward).toBe(gameRoomData.Reward)
        //expect(room.GameId).toBe(gameRoomData.GameId)
    });

    it("Game Builder closeRoom check", async () => {
        const gameroomobject2 = new GameRoomBuilder(gameRoomData2)
        createRoom('socket_id2', gameroomobject2)
        closeRoom('socket_id2')
        const room2 = getRoom('socket_id2')
        expect(room2).toBe(undefined)
    });
});

