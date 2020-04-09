var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var {GameManager} = require('./src/GameManager.js')
var {Player} = require('./src/Player.js')

let GM = new GameManager()


app.get('/', function(req, res){
  res.status(200).send("ool")
});

io.on('connection', function(socket){

  socket.on('move', function([x, y]){
    try {
      socket.game.makeMove(x, y, socket.playerId)
      io.to(socket.game.id).emit("state", {...socket.game, player:socket.playerId});
    }catch(e){
      console.log(e)
      socket.emit("err", {error:"MOVE_FAIL", message: e});
    }
  });

  socket.on('newPlayer', function(){
    let newPlayer = new Player()
    socket.playerId = newPlayer.id
    let game = GM.addNewPlayer(newPlayer)
    socket.game = game
    socket.join(game.id);
  });

  socket.on('disconnect', function(){
    if(typeof socket.game != 'undefined'){
      try{
        if(socket.playerId == socket.game.player1.id){
          //player 1 left
          socket.game.result = 2
        }else if(socket.playerId == socket.game.player2.id){
          //player 2 left
          socket.game.result = 1
        }
      }catch(e){
        console.log(e)
      }
      io.to(socket.game.id).emit("state", {...socket.game, player:socket.playerId}); 
      socket.emit("err", {error:"OPPONENT_DISCONNECT", message: "Opponent disconnected"});
   } 
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});