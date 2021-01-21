const { sendOtp, verifyOtp } = require('../utils/emailVerification')
const mongoose = require('mongoose')
const UserModel = require('../models/User')

const userdata = { nickname: 'phybarin', email: 'ertgdlk@gmail.com', password: '123456', isVerified: true, emaiVerified: true }
describe("Email Change Test", () => {


    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        })
    })

    it("Update email", async () => {
        const otp = await sendOtp("erce.test@gmail.com")
        verifyOtp("erce.test@gmail.com", otp, async (err, data) => {
            const result = data.status
            if (result) {
                const validUser = new UserModel(userData)
                const savedUser = await validUser.save()
                const update = { email: 'erce124@gmail.com' }
                await UserModel.findOneAndUpdate({ email: 'erce.test@gmail.com' }, update)
                const newuser = await UserModel.findOne({ email: 'erce124@gmail.com' })
            }
            const newmail = newuser.email
            expect(newmail).toBe('erce124@gmail.com')
        })
    })

})