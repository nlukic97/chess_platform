const express = require('express')
const app = express()

const port = process.env.port || 3000
// const frontEndUrl = 'http://localhost:3000'
const frontEndUrl = '*'

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {origin: frontEndUrl} //http://localhost:3000 when developing
});

// const { uuid, isUuid } = require('uuidv4');

const path = require('path')
const { Chess } = require('chess.js'); //for the chess engine
const { uuid } = require('uuidv4');

function ChessRoom(roomId){
  this.roomId = roomId
  this.players = []
}

function Player(socketId){
  this.socketId = socketId
}

let rooms = []

// let rooms = [
//   {
//     id:123,
//     players:[]
//   }
// ]

io.on('connection', (socket) => {
  console.log('connected',socket.id);
  socketRoomId = (socket.handshake.query.roomId)

  if(socketRoomId === undefined){
    return socket.disconnect()
  }

  if(rooms.includes(room=> room.id === socketRoomId)){

    rooms = rooms.map(room => {
      if(room.id === socketRoomId){
        room.players.push(new Player(socket.id))
        if(room.players.length === 2){
          console.log('Two players are in the game, start it !');
        }
       }
      return room
    })
    
  } else {
    rooms.push({
      id: socketRoomId,
      players:[new Player(socket.id)]
    })
  }
  
  socket.on('make-move',data=>{
    console.log('make move');
    socket.emit('move-made',data)
    socket.broadcast.emit('move-made',data)
  })
  
  socket.on('disconnect',()=>{
    console.log('user has disconnected');
  })
});




server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
