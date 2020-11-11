const JWT = require('jsonwebtoken')
const _ = require('lodash')

class JWTutil
{
    getAccessToken(req)
    {
        const authorizationHeader = _.get(req, 'headers.authorization')
        const bodyAccessToken = _.get(req, 'body.accessToken')
        const cookieToken = _.get(req, 'cookies.token')

        if(authorizationHeader && _.includes(authorizationHeader, 'Bearer'))
            return _.get(req.headers, 'authorization').replace('Bearer ', '')
        else if(bodyAccessToken)
            return bodyAccessToken
        else if(cookieToken)
            return cookieToken    
        else
            return null
    }
    
    sign(user, jwtOptions)
    {
        const payload = { data: { user } }
        const options = { expiresIn: jwtOptions.expiresIn }

        return new Promise((resolve, reject) =>
        {
            JWT.sign(payload, jwtOptions.secret, options, ( error, accessToken ) =>
            {
                if ( !error )
                    resolve(accessToken)
                else
                    reject(error)
            });
       })
    }  
    
    verify(accessToken, jwtOptions)
    {
        return new Promise((resolve, reject) => 
        {
            JWT.verify(accessToken, jwtOptions.secret, (error,decoded) => 
            {
                if(!error)
                {
                    resolve(decoded.data.user)
                }
                else
                {
                    reject(error)
                }
            })
        })
    }
}

module.exports = new JWTutil()