const _ = require('lodash')

class DetailBuilder
{
    constructor()
    {
        this.detail = {}
    }

    id( id )
    {
        this.detail.id = id
        return this
    }

    name( name )
    {
        this.detail.name = name
        return this
    }

    uniqueID( uniqueID )
    {
        this.detail.uniqueID = uniqueID
        return this
    }

    user( user )
    {
        this.detail.user = typeof user == 'object' ? user._id : user
        return this
    }

    platform ( platform )
    {
        this.detail.platform = typeof platform == 'object' ? platform._id : platform
        return this
    }
  

    build ()
    {
        const clearedDetail = _.chain(this.detail)

        return clearedDetail
    }

}

module.exports = DetailBuilder