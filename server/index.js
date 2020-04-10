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
      socket.game.makeMove(x, y, socket.player.id)
      io.to(socket.game.id).emit("state", {...socket.game});
      if(socket.game.result !== null) io.to(socket.game.id).emit("message", {message: "Game ended", variant: "success"});

    }catch(e){
      console.log(e)
      socket.emit("message", {error:"MOVE_FAIL", message: e, variant: "warning"});
    }
  });

  socket.on('newPlayer', function(){
    let newPlayer = new Player()
    socket.player = newPlayer
    let game = GM.addNewPlayer(newPlayer)
    socket.game = game
    socket.join(game.id);
    socket.emit("player", newPlayer);
    io.to(socket.game.id).emit("state", {...socket.game});
    if(game.isFull) io.to(socket.game.id).emit("message", {message: "Game started", variant: "success"});

  });

  socket.on('setName', function(n){
    socket.player.name = n
  });

  socket.on('disconnect', function(){
    if(typeof socket.game != 'undefined'){
      try{
        if(socket.player.id == socket.game.player1.id){
          //player 1 left
          socket.game.result = this.game.player2.id
        }else if(socket.player.id == socket.game.player2.id){
          //player 2 left
          socket.game.result = this.game.player1.id
        }
      }catch(e){
        
      }
      io.to(socket.game.id).emit("state", {...socket.game}); 
      io.to(socket.game.id).emit("message", {error:"OPPONENT_DISCONNECT", message: "Opponent disconnected", variant: "error"});
      io.to(socket.game.id).emit("message", {message: "Game ended", variant: "success"});
      GM.closeGame(socket.game)
   } 
  });
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});