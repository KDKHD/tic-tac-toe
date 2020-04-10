const uuidv4 = require("uuid/v4")

class Player{
    constructor(){
        this.id = uuidv4()
        this.gameid = null
        this.name = null
    }

    get gameId(){
        return this._gameID
    }

    get id(){
        return this._id
    }

    get name(){
        return this._name
    }

    set gameId(id){
        this._gamId = id
    }

    set id(id){
        this._id = id
    }

    set name(n){
        this._name = n
    }
}

exports.Player = Player