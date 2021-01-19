
var io = require('socket.io-client')
    , ioOptions = {
        transports: ['websocket']
        , forceNew: true
        , reconnection: false
    }
    , testMsg = 'HelloWorld'
    , sender
    , receiver
    , server

const { http } = require('./socketserver')
const _ = require("lodash")
const SocketUserBuilder = require('../models/builders/SocketUserBuilder')

var clients = []

function login(client, nickname) {
    try {
        //check data nickname exist or not
        const user = _.filter(clients, { nickname: nickname })
        if (!user[0]) {
            const sockets = [client.id]
            const newUserBuilder = new SocketUserBuilder()
                .nickname(nickname)
                .sockets(sockets)

            const newUser = newUserBuilder.build()
            clients.push(newUser)
        }
        else {
            user[0].sockets.push(client.id)
        }
    }
    catch (error) {
        throw error
    }
}


describe('Chat Events', () => {
    beforeAll(async () => {
        server = http.listen(3000)
    })

    beforeEach(function (done) {

        // start the io server
        // connect two io clients
        sender = io('http://localhost:3000/', ioOptions)
        receiver = io('http://localhost:3000/', ioOptions)

        // finish beforeEach setup
        done()
    })

    it('Add new socket to global clients array when new tab oppened on dashboard', function (done) {
        try {
            const senderNickname = "ertugdilek"

            sender.emit('login', senderNickname)
            receiver.on('login', function (nickname) {
                expect(nickname).toBe(senderNickname)
                login(sender, nickname)
                expect(clients.length).toBe(1)
                done()
            })
        }
        catch (error) {
            throw error
        }

    })
    afterEach(function (done) {

        // disconnect io clients after each test
        sender.disconnect()
        receiver.disconnect()
        done()
    })

    afterAll(() => {
        server.close()
    })

})