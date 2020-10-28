const _ = require('lodash')

const defaultConfig =
{
    "jwt":
	{
		"secret": "Rst.!bJTQEdf79",
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
            apiKey: "3F7E7FF7EC5EC88290ECF9ED3C63F642"
        }
    }
}