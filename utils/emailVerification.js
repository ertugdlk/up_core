const nodemailer = require('nodemailer');
const Config = require('config')

const redis = require('redis')
const client = redis.createClient({
    port: process.env.redis_port,
    host: process.env.redis_host,
    password: process.env.redis_password
})

function createRandom() {
    var otp = Math.floor(1000 + Math.random() * 9000)
    otp = parseInt(otp);
    return otp;
}


const transporter = nodemailer.createTransport({

    host: "srvm11.trwww.com",
    port: 465,
    secure: true, // true for 465, false for other ports

    auth: {
        user: "no-reply@unknownpros.com", // generated ethereal user
        pass: "Sj879h9D", // generated ethereal password
    },
});

async function sendOtp(mail) {
    try {
        const rand = createRandom()

        await transporter.sendMail({
            from: 'no-reply@unknownpros.com',
            to: mail,
            subject: "Unknownpros OTP for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + rand + "</h1>" // html body
        });

        await client.set(mail, "" + rand + "");
        client.expire(mail, 600); // setting expiry for 10 minutes.

        return '' + rand + ''
    }
    catch (error) {
        throw error
    }

}

//otp yi reactta string gonder
function verifyOtp(mail, otp, callback) {
    try {
        client.get(mail, function (err, value) {
            if (value === otp) {
                callback(err, { code: value, status: 1 })
            } else {
                callback(err, { code: otp, status: 0 })
            }

        });
    }
    catch (error) {
        throw error
    }

}

module.exports = {
    sendOtp,
    verifyOtp
}