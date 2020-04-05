var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.status(200).send("ool")
});

io.on('connection', function(socket){
  console.log('a user connected');


  socket.on('state', function(state){
    console.log(state)
    socket.broadcast.emit("state", state);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});