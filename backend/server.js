const express = require('express')
const app = express()

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.port || 3000

const path = require('path')

const chess = require('chess'); //for the chess engine


// const {Auth} = require('./server_modules/Auth.js')
const { Router } = require('./server_modules/Router.js')

//Stating that this is the public directory from which files are to be served from
app.use(express.static(path.join(__dirname,'/public'))) 

// Paths
Router(app, __dirname);


let conn = 0; //nodes connected (if 2, do not allow other socket connections)
let move,status;
let gameClient;

io.on('connection', (socket) => {
  if(conn >= 2){
    console.log('disconnecting user who is trying to connect');
    return socket.disconnect()
  } 
  socket.join('game1')
  conn++
  
  console.log(`User ${socket.id} has connected to the sevrer`);
  io.in('game1').emit('poruka',`A new player has joined. Curr num: ${conn}`)

  

    // console.log(`There are now ${conn} users on this server.`);
    // console.log(socket.handshake.auth)
    // Auth(socket)

    //right now, a player is basically playing against themselves
    
    

    if(conn === 2){
      gameClient = chess.create()
      status = gameClient.getStatus();

      io.in('game1').emit('poruka','GAME HAS STARTED !')
    }
    

    socket.on('new-move',(data)=>{
      console.log(status);
      if(Object.keys(status.notatedMoves).includes(data.move)){
        console.log('move is valid');

        move = gameClient.move(data.move); //make the move
        status = gameClient.getStatus(); //update the current data, and then we wait for the other user to join

        io.in('game1').emit('poruka','New move: ' + data.move)
        io.in('game1').emit('poruka',status)
      } else {
        console.log('move is invalid');
        io.in('game1').emit('poruka',`The move is invalid`)
      }

  })
  
  socket.on('disconnect', () => {
    conn--
    console.log(socket.id  + ' has disconnected');
    io.in('game1').emit('poruka','A user has disconnected. ' + conn + ' users left' )
  });
});




server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
