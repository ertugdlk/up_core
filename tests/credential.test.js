const mongoose = require('mongoose')
const CredentialModel = require('../models/UserCredentials')
const UserModel = require('../models/User')
const date = new Date()
date.setFullYear(1998,4,13)
const userData = { nickname: 'bluffist', email: 'aralkaraoglan@gmail.com', password:'123456'}
const {encrypt , decrypt} = require('../utils/Cryptoutil')

describe('Credential Model Test', () => {
    //connect to the mongoDB memory server 
    //using mongoose.connect
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        })
    })

    it('Create & saved credential with encryption of identityid successfully and also check true userid', async () => {
        const validUser = new UserModel(userData)
        const savedUser = await validUser.save()

        const credentialData = {user: savedUser._id, identityID: "12345678910", phone: "5313809485",  name: 'Aral', surname:'Karaoğlan',dateOfBirth:  date}
        credentialData.identityID = await encrypt(credentialData.identityID)
        const credential = new CredentialModel(credentialData)
        const savedCredential = await credential.save()
        const identity = await decrypt(savedCredential.identityID)

        expect(identity).toBe("12345678910")
        expect(savedCredential.user).toBe(savedUser._id)
        expect(savedCredential.identityID.iv).toBeDefined()
        expect(savedCredential.identityID.content).toBeDefined()
        expect(savedCredential.phone).toBe(credentialData.phone)
    })

    it('When credential created user must be verified', async() => {
        const validUser = new UserModel({ nickname: 'mrboken', email: 'mrbroken@gmail.com', password:'123456'})
        const savedUser = await validUser.save()

        const credentialData = {user: savedUser._id, identityID: "12345678910", phone: "5313809486",  name: 'Erce', surname:'Danimarka',dateOfBirth:  date}
        credentialData.identityID = await encrypt(credentialData.identityID)
        const credential = new CredentialModel(credentialData)
        const savedCredential = await credential.save()
        const finduser = await UserModel.findOne({_id : savedUser._id})
   
        expect(finduser.isVerified).toBe(true)

    })
    
})    