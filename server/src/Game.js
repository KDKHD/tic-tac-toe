const uuidv4 = require("uuid/v4")

class Game{
    constructor (s = 3) {
        this.player1 = null
        this.player2 = null
        this.startTime = Date.now()
        this.id = uuidv4()
        this.state = []
        this.boardSize = 3
        this.turn = 0
        this.result= null
        this.history = []
        this.initializeBoard()
        console.log(`New game: ${this.id}`)
    }

    /**
     * Set initial state of board
     */
    initializeBoard(){
        let gameState = []
        for(let x = 0; x < this.boardSize; x++){
            let tempCol = []
            for(let y = 0; y < this.boardSize; y++){
                tempCol.push(-1)
            }
            gameState.push(tempCol)
        }
        this.state = gameState
    };
    
    set player1(p1) {
        this._player1 = p1
    };

    set player2(p2){
        this._player2 = p2
    };

    set id(id){
        this._id = id
    };

    set state(s){
        this._state = s
    };

    set startTime(s){
        this._startTime = s
    };

    set result(r){
        if(this._result != null) throw "Game already has result"
        if([null, 0, this.player1?this.player1.id:null, this.player2?this.player2.id:null].includes(r)){
            this._result = r
        }
        else{
            throw "Invalid result"
        }
    };

    set history(h){
        this._history = h
    }

    get player1() {
        return this._player1 
    };

    get player2(){
        return this._player2 
    };

    get id(){
        return this._id
    };

    get state(){
        return this._state
    };

    get startTime(){
        return this._startTime
    };

    get result(){
        return this._result
    }

    get history(){
        return this._history
    }

    get isFull(){
        return this.player1 && this.player2 
    }

    start(){
        if(!this.isFull){
            throw "Game must have 2 players to start"
        }
        this.turn = this.player1
    }

    /**
     * 
     * @param {*} p Player to add
     */
    addPlayer(p){
        if(this.player1 == null){
            this.player1 = p
            console.log(`Player ${p.id} added to game: ${this.id}`)
            return this.player1 && this.player2
        }
        else if(this.player2 == null){
            this.player2 = p
            console.log(`Player ${p.id} added to game: ${this.id}`)
            return this.player1 && this.player2
        }
        else{
            throw "This game already has 2 players"
        }
    }

    /**
     * 
     * @param {*} x x pos
     * @param {*} y y pos
     * @param {*} p player making move
     */
    makeMove(x, y, p){
        if(this.result!=null){ 
            throw "Game has ended"; 
        }
        if(!this.isValidCoordinate){
            throw "Move not in board range"
        }
        if(!this.isFull){ 
            throw "Game doesn't have 2 players"; 
        }

        //make sure that it is this players turn
        if(p == this.turn.id){
            if (this.state[y][x] == -1) {
                this.state[y][x] = p
                this.history.push([x, y, p])
                this.refreshResult(x, y, p)

                //make turn switch
                let newTurn = this.player1
                if(p == this.player1.id){
                    newTurn=this.player2
                }
                this.turn = newTurn
            }
            else{
                throw "A move at this square has already been made"
            }
        }
        else{
            throw "It is not this your turn"
        }
      };

    isValidCoordinate(x, y){
        return x >= 0 && x < this.boardSize && y >=0 && y < this.boardSize
    }

    refreshResult(x, y, p){
        if(this.checkWin(x, y, p)){
            this.result = p
        }
        if(this.history.length == this.boardSize * this.boardSize){
            this.result = 0
        }
    }

    checkWin(x, y, p){
        if(x == ((this.boardSize-1)/2) && x == y){
            //middle square
            return this.checkVerticalWin(x, p) || this.checkHorizontalWin(y, p) || this.checkLeftDiagonal(p) || this.checkRightDiagonal(p)
        }
        else if((x==0 && y == 0) || (x == 0 && y == this.boardSize-1) || (x == this.boardSize-1 && y == 0) || (x == this.boardSize-1 && y == this.boardSize-1)){
            //corner square
            return this.checkHorizontalWin(y, p) || this.checkVerticalWin(x, p) || (x == y?this.checkLeftDiagonal(p):this.checkRightDiagonal(p))
        }
        else{
            return this.checkHorizontalWin(y, p) || this.checkVerticalWin(x, p)
        }
    }


    checkVerticalWin(x, p){
        let win = true
        for(let y = 0; y < this.boardSize; y ++){
            if(this.state[y][x] != p){
                win = false
                break
            }
        }
        return win
    }

    checkHorizontalWin(y, p){
        let win = true
        for(let x = 0; x < this.boardSize; x ++){
            if(this.state[y][x] != p){
                win = false
                break
            }
        }
        return win
    }

    checkLeftDiagonal(p){
        let win = true
        for(let x = 0; x < this.boardSize; x ++){
            if(this.state[x][x] != p){
                win = false
                break
            }
        }
        return win
    }

    checkRightDiagonal(p){
        let win = true
        for(let x = 0; x < this.boardSize; x ++){
            if(this.state[this.boardSize-1-x][x] != p){
                win = false
                break
            }
        }
        return win
    }

}

exports.Game = Game