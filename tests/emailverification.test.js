const {sendOtp, verifyOtp} = require('../utils/emailVerification')

describe("Email Verification Test", () => {

    it("True OTP verification" , async () => {
        const otp = await sendOtp("erce.test@gmail.com")
        verifyOtp("erce.test@gmail.com", otp, (err,data) => {
            const result = data.status
            expect(result).toBe(1)
        })
    })

})