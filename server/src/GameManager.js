var {Game} = require('./Game.js')


class GameManager{
    constructor(){
        this.openGames = []
        this.onGoingGames = {}
        this.playerToGame = {}
    }

    addNewPlayer(p){
        if(this.openGames.length == 0){
            //no open games, create new one
            var newGame = new Game(3)
            this.addPlayerToGame(p, newGame)
            !newGame.isFull?this.openGames.push(newGame):null
            return newGame
        }
        else{
            var openGame = this.openGames.shift()
            try{
                this.addPlayerToGame(p, openGame)
                var isFull = openGame.isFull
            }catch(e){
                console.error(e)
                console.log(openGame)
                return false
            }

            if(!isFull){
                //if the game is not full, wait for another player
                this.openGames.push(openGame)
            }
            return openGame
        }
    }

    closeGame(g){
        delete this.onGoingGames[g.id]
        for(let i = 0; i < this.openGames.length; i ++){
            if(this.openGames[i].id == g.id) this.openGames.splice(i, 1);
        }

    }

    addGameToOngoing(g){
        if(g.isFull){
            this.onGoingGames[g.id] = g
            g.start()
            console.log(`Started game ${g.id}`)
        }
        else{
            throw "Game must have 2 players to start"
        }
    }

    addPlayerToGame(p, g){
        try{
            g.addPlayer(p)
            this.playerToGame[p.id] = g.id
            p.gameId = g.id
            if(g.isFull){
                this.addGameToOngoing(g)
                return true
            }
        }catch(e){
            console.log(e)
            return false
        }
    }



}

exports.GameManager = GameManager