const express = require('express')
const app = express()

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.port || 3000

const path = require('path')

const chess = require('chess'); //for the chess engine


const {Auth} = require('./server_modules/Auth.js')
const {Router} = require('./server_modules/Router.js')

//Stating that this is the public directory from which files are to be served from
app.use(express.static(path.join(__dirname,'/public'))) 

// Paths
Router(app)


let conn = 0; //nodes connected (if 2, do not allow other socket connections)

io.on('connection', (socket) => {
  if(conn >= 2){
    console.log('disconnecting user who is trying to connect');
    return socket.disconnect()
  } 

    conn++
    console.log(`There are now ${conn} users on this server.`);
    // console.log(socket.handshake.auth)
    Auth(socket)

    //right now, a player is basically playing against themselves
    const gameClient = chess.create()
    let move,status;
    status = gameClient.getStatus();
    
    
    socket.on('new-move',(data)=>{
      if(Object.keys(status.notatedMoves).includes(data.move)){
        console.log('move is valid');

        move = gameClient.move(data.move); //make the move
        status = gameClient.getStatus(); //update the current data, and then we wait for the other user to join
      } else {
        console.log('move is invalid');
      }

  })
  
  socket.on('disconnect', () => {
    conn--
    console.log(socket.id  + ' has disconnected');
  });
});




server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
