const _     = require('lodash')

const defaultConfig =
{
    "jwt":
	{
		"secret": "cukubik",
        "expiresIn": "7 days",
        "is": 
        {
            "active": true // To make token system disable, set this to `false`
        }
	}
}