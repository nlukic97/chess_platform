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

function ChessRoom(roomId, ...players){
  return {
    id: roomId,
    players: players
  }
}

function Player(socketId){
  return {
    socketId: socketId,
    pieces:undefined, //assigned upon game start
    playersTurn:undefined //assigned upon game start
  }
}


/**
 * Returns an array of objects.
 * Each object contains data to be assigned to players who are about to start a game.
 * The data is: which piece the player is, and if it's their turn. ('white' pieces go first, so the turn will be 'true')
 * */
function GetPieces(){
  let randNum = Math.floor(Math.random() * (2 - 0) + 0); // 0 or 1

  if(randNum === 0){
    return [
      {assignedPiece:'black', assignedTurn:false},
      {assignedPiece:'white', assignedTurn:true}
    ]
  } else {
    return [
      {assignedPiece:'white', assignedTurn:true},
      {assignedPiece:'black', assignedTurn:false},
    ];

  }
}

let rooms = []

// let rooms = [
//   {
//     id:123,
    // players:[],
    // players:[{socketId:'randomSocketId',pieces:undefined, playersTurn:undefined}],
    // players:[{socketId:'randomSocketId',pieces:undefined},{socketId:'random2',pieces:undefined}],
  // }
// ]

io.on('connection', (socket) => {

  socketRoomId = parseInt(socket.handshake.query.roomId)
  
  // If the user has not submitted a number parameter to join a room, they will be disconnected
  if(socketRoomId === undefined || isNaN(socketRoomId)){
    console.log('Disconnecting user - no roomId param found');
    return socket.disconnect()
  }
  console.log('connected',socket.id);
  
  socket.join(socketRoomId) //subscribing the user to the room id which they provided

  // potential for a little backdoor fun here, ide gas
  if(socket.handshake.query.landscape === 'backend'){
    console.log('Someone special has joined, give them backdoor chess privileges');
  }
  
  
  // checking if a room with the submitted socketRoomId exists
  let roomIndex = rooms.findIndex(room=> room.id === socketRoomId)

  // if room already exists...
  if(roomIndex > -1){
    //...check if there are already 2 players in there (which will disconnect player 3)
    if(rooms[roomIndex].players.length >= 2){
      // console.log(rooms[roomIndex]);
      console.log('To many players in the game, disconnecting new player.');
      return socket.disconnect()
    }
    
    // ... otherwise, add the player to the room
    rooms[roomIndex].players.push(Player(socket.id))

    // If there are two players in here at this point, its time to start the game. Otherwise, wait for player 2 to join...
    if(rooms[roomIndex].players.length === 2){
      console.log('Two players are in the game, start it !');
      
      // assigning the pieces, and telling each player who is who
      let assignedData = GetPieces()   
      for(let i = 0; i <= 1;i++){
        rooms[roomIndex].players[i].pieces = assignedData[i].assignedPiece
        rooms[roomIndex].players[i].playersTurn = assignedData[i].assignedTurn

        // sending the game start data to each player individualy who is in a room
        io.to(rooms[roomIndex].players[i].socketId).emit('game-started',rooms[roomIndex].players[i])
      }

      // console.log(rooms[0]);
    }
    
  // In this case, the room does not exist. Create it and add this user as the first player...
  } else {
    rooms.push(ChessRoom(socketRoomId, Player(socket.id)))
  }
  


  // Socket events and emits
  socket.on('make-move',data=>{
    // validation needed here

    console.log('make move');
    socket.emit('move-made',data) //sending to the person who submitted the move
    socket.broadcast.emit('move-made',data) //sending to everyone but the sender
  })
  

  // When a user leaves ...
  socket.on('disconnect',()=>{
    console.log('user has disconnected');

    // remove the player from the room, and remove this room if there are no players left
    rooms = rooms.map(room=> {
      room.players = room.players.filter(player=> player.socketId !== socket.id)
      return room
    }).filter(room => room.players.length > 0)
  })
});


// ---------- just for testing purposes ----------
app.use(express.static('public'))
app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/public/index.html')
})
// ---------- just for testing purposes ----------


server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
