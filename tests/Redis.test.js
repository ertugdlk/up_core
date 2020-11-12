const GameRoomBuilder = require('../models/builders/GameRoomBuilder');
const gameRoomData = { GameId: '123', GameName: 'CSGO', GameMap: 'DUST2', GameType: '1V1', EntryFee: '10USD', Reward: '15USD', CreatedAt: '12.11.2020', Host: 'ERCE' }
const gameRoomData2 = { GameId: '1234', GameName: 'CSGO2', GameMap: 'DUST3', GameType: '2V2', EntryFee: '100USD', Reward: '175USD', CreatedAt: '13.11.2020', Host: 'ERCECAN' }
const redis = require('redis')
const client = redis.createClient(6379);

describe("Redis Test", () => {

    it("Game Builder createRoom check", async () => {
        const builder = new GameRoomBuilder()
                        .GameId(gameRoomData.GameId)
                        .GameMap(gameRoomData.GameMap)
                        .GameName(gameRoomData.GameName)
                        .Host(gameRoomData.Host)
                        .Reward(gameRoomData.Reward)

        const gameroomobject = builder.build()
        const encoded = JSON.stringify(gameroomobject.__wrapped__)
        client.set('room:1', encoded)
        client.get('room:1', function(err, result) {
            if(err){

            }
            else{
                const decoded = JSON.parse(result)
                client.end()
                expect(gameroomobject.__wrapped__).toStrictEqual(decoded)
            }
        })
    });

    afterAll(() => redis.closeInstance())
});

