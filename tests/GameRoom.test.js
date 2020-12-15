const GameRoom = require('../models/GameRoom')
const Mongoose = require('mongoose')
const roomData = {roomId: "12h3u21l", host: "ertugdilek", users: [{nickname:"ertugdilek" , team:1},{nickname:"erce", team:1}, {nickname:"mert", team:2}] ,
settings:{type:"1v1", map:"redline"}}
const _ = require('lodash')

describe("GameRoom Model Test" , () => {
    beforeAll(async () => {
        await Mongoose.connect(
          global.__MONGO_URI__,
          { useNewUrlParser: true, useCreateIndex: true },
          (err) => {
            if (err) {
              console.error(err)
              process.exit(1)
            }
          }
        )
      })
    
    it("Model Schema settings and users format test" , async () => {
        try{
            const newRoom = new GameRoom(roomData)
            const savedRoom = await newRoom.save()
            const team1User = _.find(roomData.users, (user) => {
                return user.nickname == "erce"
            })

            const team1UserTest = _.find(savedRoom.users, (user) => {
                return user.nickname == "erce"
            })

            expect(roomData.settings.type).toBe(savedRoom.settings.type)
            expect(roomData.settings.map).toBe(savedRoom.settings.map)
            expect(team1UserTest.team).toBe(1)
            expect(team1User.team).toBe(team1UserTest.team)
        }
        catch(error){
            throw error
        }
    })
})