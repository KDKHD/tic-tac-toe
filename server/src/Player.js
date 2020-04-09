const uuidv4 = require("uuid/v4")

class Player{
    constructor(){
        this.id = uuidv4()
    }

    get id(){
        return this._id
    }

    set id(id){
        this._id = id
    }
}

exports.Player = Player