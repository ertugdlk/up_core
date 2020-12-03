const nodemailer = require('nodemailer');

const redis = require('redis')
const client = redis.createClient({
    port: process.env.redis_port,
    host: process.env.redis_host,
    password: process.env.redis_password
})

function createRandom() {
    var otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    console.log(otp);
    return otp;
}


const transporter = nodemailer.createTransport({

    host: "srvm11.trwww.com",
    port: 465,
    secure: true, // true for 465, false for other ports

    auth: {
        user: "no-reply@esportimes.com", // generated ethereal user
        pass: "Sj879h9D", // generated ethereal password
    },
});

async function sendOtp(mail) {
    const rand = createRandom()
    const mailOptions = {
        from: 'no-reply@esportimes.com',
        to: mail,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + rand + "</h1>" // html body
    };


    const info = await transporter.sendMail(
        mailOptions
    );

    client.set(mail, "" + rand + "");
    client.expire(mail, 600); // setting expiry for 10 minutes.

}

//otp yi reactta string gonder
async function verifyOtp(mail, otp) {

    client.get(mail, function (err, value) {
        if (value === otp) {
            return ({ "msg": "You have been successfully registered", "status": "1" })
        } else {
            return ({ "msg": "Wrong or expired password", "status": "0" })
        }

    });

}

module.exports = {
    sendOtp,
    verifyOtp
}