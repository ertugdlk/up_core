const io = require('socket.io-client')
const iobackend = require('socket.io')
const http = require('http')
const Websockets = require('../utils/Websockets')

let httpServer;
let httpServerAdr;
let ioServer;
let socket;

describe("Socket.io  Test" , () => {
    beforeAll(async (done) => {
        httpServer = http.createServer().listen()
        httpServerAdr = httpServer.address()
        ioServer = iobackend(httpServer)
        done()
    })

    beforeEach(async (done) => {
        socket = io('http://'+ httpServerAdr.address + ':' + httpServerAdr.port + '/' , {
            transports: ['websocket'],
          })

        done();
    })

    it("test" , async() => {
        socket.emit('msg' , 'deneme')

        setTimeout(() => {
            ioServer.on('msg' , (data) => {
                const msg = data
                expect(msg).toBe('deneme')
            })

        } , 50)
    })

    afterEach(async (done) => {
        if(socket.conneted){
            socket.disconnect()
        }
        done();
    })

    afterAll(async (done) => {
        ioServer.close()
        httpServer.close()
        done()
    })

})