const _ = require('lodash')

const defaultConfig =
{
    "jwt":
    {
        "secret": 'Rst.!bJTQEdf79',
        "expiresIn": "7 days",
        "is": 
        {
            "active": true // To make token system disable, set this to `false`
        }
    },
    "platforms":
    {
        "steam":
        {
            name:"Steam",
            _id : '5f9a84fca1f0c0b83de7d696'
        }
    },
    "rcon":
    {
        port:27015,
    }
}