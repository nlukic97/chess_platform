const express = require('express')
const app = express()

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 8081
const corsRules = process.env.CORS

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {origin: corsRules} //http://localhost:3000 when developing
});

const path = require('path')
const { Chess } = require('chess.js'); //for the chess engine

const { validate: validateUuid } = require('uuid');

function ChessRoom(roomId, ...players){
  return {
    id: roomId,
    players: players,
    chess:undefined
  }
}

function Player(socketId){
  return {
    socketId: socketId,
    pieces:undefined, //assigned upon game start
    playersTurn:undefined //assigned upon game start
  }
}

function GameOutcome(reason = undefined,winner = undefined,loser=undefined){
  return {
    reason,
    winner,
    loser
  }
}

/**checks if the submitted move is amongs the possible moves.
 * Takes a chess (object from within a room) and a move(string)
 * in order to confirm if the submitted move is possible
 */
function validateMove(chess,move){
/*   console.log(move);
  console.log(chess.moves());
  console.log(chess.moves().includes(move)) */
  let moveOutcome = chess.move(move)
  return (moveOutcome === null) ? false : true;
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

function switchTurns(roomId){
  let roomIndex = rooms.findIndex(room=> room.id === roomId)
  rooms[roomIndex].players[0].playersTurn = !rooms[roomIndex].players[0].playersTurn
  rooms[roomIndex].players[1].playersTurn = !rooms[roomIndex].players[1].playersTurn
}

function handleCheckmate(roomIndex){
  let winner = rooms[roomIndex].players.find(player=> player.playersTurn === false).pieces
  let loser = rooms[roomIndex].players.find(player=> player.playersTurn === true).pieces
  
  // rooms[roomIndex].players.forEach(player=>{
  //   if(player.playersTurn === true){
  //     console.log(`${player.pieces} has lost the game due to checkmate.`);
  //   } else if(player.playersTurn === false){
  //     console.log(`${player.pieces} has won the game with a checkmate.`);
  //   }
  // })
  return GameOutcome('checkmate',winner,loser)
}

function findRoom(socketId){
  return rooms.find(room=> room.players.some(player=> player.socketId === socketId))
}

let rooms = []

/* let rooms = [
  {
    id:123,
  players:[],
  players:[{socketId:'randomSocketId',pieces:undefined, playersTurn:undefined}],
  players:[{socketId:'randomSocketId',pieces:undefined,playersTurn:undefined},{socketId:'random2',pieces:undefined,playersTurn:undefined}],
  }
] */

io.on('connection', (socket) => {
  
  socketRoomId = socket.handshake.query.roomId
  
  // If the user has not submitted a number parameter to join a room, they will be disconnected
  if(socketRoomId === undefined || socketRoomId === null){
    console.log('Disconnecting user - no roomId param found');
    return socket.disconnect()
  }
  
  if(validateUuid(socketRoomId) === false){
    console.log('Disconnecting user - roomId is not a uuid');
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
      
      rooms[roomIndex].chess = new Chess()

      //stalemate fen: '8/8/8/8/8/4k3/3p4/4K3 w - - 0 2'
      
      /**  for testing purposes */
      // rooms[roomIndex].chess = new Chess('r2k1bnr/ppp1pppp/8/1B6/3P2Q1/N7/nP1P1PPP/R1B1K1NR w KQ - 0 9');
      
      // assigning the pieces, and telling each player who is who
      let assignedData = GetPieces()   
      for(let i = 0; i <= 1;i++){
        rooms[roomIndex].players[i].pieces = assignedData[i].assignedPiece
        rooms[roomIndex].players[i].playersTurn = assignedData[i].assignedTurn
        
        // sending the game start data to each player individualy who is in a room
        let player = rooms[roomIndex].players[i];
        let payload = {
          pieces: player.pieces, 
          playersTurn: player.playersTurn,
          initialPosition: rooms[roomIndex].chess.fen()
        };
        
        io.to(player.socketId).emit('game-started',payload)
      }
      console.log(rooms[roomIndex].players);
      
      // console.log(rooms[0]);
    }
    
    // In this case, the room does not exist. Create it and add this user as the first player...
  } else {
    rooms.push(ChessRoom(socketRoomId, Player(socket.id)))
  }
  
  
  
  // Socket events and emits
  socket.on('make-move',data=>{
    // validation needed here
    console.log(data); //the moves are not validated because the data is different
    
    let submittedRoomId = socket.handshake.query.roomId
    console.log('make move');
    let roomIndex = rooms.findIndex(room => room.id === submittedRoomId)
    let player = rooms[roomIndex].players.find(player=> player.socketId === socket.id);
    


    /* -----------------------Testing purposes only  - uncomment this, and the chess game works (with no validation on the server, it just shares the payload)----------------------- */
/*     socket.emit('move-made',data) //sending to the person who submitted the move
    socket.to(rooms[roomIndex].id).emit('move-made',data) //sending to everyone but the sender in the specific room
    return */
    /* ----------------------- Testing purposes only ----------------------- */



    if(player.playersTurn === true) {
      if(validateMove(rooms[roomIndex].chess, data) === true){

        switchTurns(submittedRoomId) //change who's turn it is
        socket.emit('move-valid',{valid:true, chess: rooms[roomIndex].chess.fen()}) //sending to the person who submitted the move  ----> move-valid
        socket.to(rooms[roomIndex].id).emit('move-made',data) //sending to everyone but the sender in the specific room

        // after the switch has been made, we check if the next player is in checkmate
        // If the game is over, handle what happens
        if(rooms[roomIndex].chess.game_over()){

          // due to checkmate
          if(rooms[roomIndex].chess.in_checkmate()){
            
            // sending the game outcome to all clients
            let outcome = handleCheckmate(roomIndex)
            io.in(rooms[roomIndex].id).emit('game-over',outcome)

            // specific draw situations  
          } else if(rooms[roomIndex].chess.in_stalemate()){ // stalemate
            io.in(rooms[roomIndex].id).emit('game-over',GameOutcome('stalemate'))
            
          } else if(rooms[roomIndex].chess.in_threefold_repetition()){ // threefold_repetition
            io.in(rooms[roomIndex].id).emit('game-over',GameOutcome('threefold-repetition'))
          
          } else if(rooms[roomIndex].chess.in_draw()){
            io.in(rooms[roomIndex].id).emit('game-over',GameOutcome('draw'))
            
          } else { // other reason for game to be over
            io.in(rooms[roomIndex].id).emit('game-over',GameOutcome('other'))
          }

          for(let i = 0; i <= 1; i++){
            rooms[roomIndex].players[i].playersTurn = false
          }

          console.log(rooms[roomIndex].players);
        }
      } else {
        console.log('illegal move'); //at this point, we need reset the chessboard to be that of the current state (before the move was made)
        socket.emit('move-valid',{valid:false, chess: rooms[roomIndex].chess.fen()}) //mode-valid, false
        
      }
    } else {
      console.log('illegal move'); //at this point, we need reset the chessboard to be that of the current state (before the move was made)
      socket.emit('move-valid',{valid:false, chess: rooms[roomIndex].chess.fen()}) //mode-valid, false
    }
    
  })

  /** Chat message */
  socket.on('message-sent',(msg)=>{
    console.log(msg);
    let room = findRoom(socket.id) //returns the room where there is a player with this id
    if(room){
      socket.to(room.id).emit('message-received',{msg:msg, timestamp: new Date().getTime()}) //sends the event to all users in the room except the sender (so, to the other player)
    }
  })
  
  
  // When a user leaves ...
  socket.on('disconnect',()=>{
    console.log('user has disconnected');

    let room = findRoom(socket.id)

    // if the game has already started, remove the player emmit to the other player that the game is over due to player disconnection
    if(room.chess !== undefined){
      socket.to(room.id).emit('game-over',GameOutcome('player-disconnected'))
    }

    // remove the player from the room, and remove this room if there are no players left
    rooms = rooms.map(room=> {
      room.players = room.players.filter(player=> player.socketId !== socket.id)
      return room
    }).filter(room => room.players.length > 0)
  })
});


// ---------- just for testing purposes ----------
/* app.use(express.static('public'))
app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/public/index.html')
}) */
// ---------- just for testing purposes ----------


server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
