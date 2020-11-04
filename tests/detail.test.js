const Mongoose = require('mongoose')
const User = require('../models/User')
const Platform = require('../models/Platform')
const Detail = require('../models/Detail')
const userData = { nickname: 'bazuqa2', email: 'bazuqa2@gmail.com', password:'123456'}
const platformData = {name: 'steam'}

describe('Detail Model Test', ()=> {
    //connect to the mongoDB memory server 
    //using mongoose.connect
    beforeAll(async () => {
        await Mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        })
    })

    it('Detail Platform check', async () => {
        const user = new User(userData)
        const savedUser = await user.save()
        const platform = new Platform(platformData)
        const savedPlatform = await platform.save()
        const detailData = {name:"MrBroken", uniqueID:"76561198066336952", platform: savedPlatform._id , user: savedUser._id }
        const detail = new Detail(detailData)
        const savedDetail = await detail.save()
        
        const filteredPlatform = await Platform.findById(savedDetail.platform)
        expect(filteredPlatform.name).toBe(platformData.name)
        }
    )

})
