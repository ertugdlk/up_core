const easy_soap = require('easysoap')

const identity = async (args) => {

    const params = {
        host: 'tckimlik.nvi.gov.tr',
        path: '/Service/KPSPublic.asmx',
        wsdl: "/Service/KPSPublic.asmx?WSDL",
        headers: [{
            name : "SOAPAction",
            value : "http://tckimlik.nvi.gov.tr/WS/TCKimlikNoDogrula",
            }]
    }

    var client = easy_soap(params, {secure:true})

    const response = await client.call({'method' : 'TCKimlikNoDogrula',
        attributes: {
            'xmlns': 'http://tckimlik.nvi.gov.tr/WS'
        },
        params : {
            'TCKimlikNo' : args.TCKimlikNo,
            'Ad' : args.Ad,
            'Soyad' : args.Soyad,
            'DogumYili' : args.DogumYili
        }
    })

    return response
}

module.exports = {
    identity
}