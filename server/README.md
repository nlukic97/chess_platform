# Events to listen for in the frontend
## 1. game-started
- When two users join a room, this will be emited. 
- Clientside listener:
    
        socket.on('game-started', data=>{
            console.log(data)
        })

Data 1 player will receive:

        {
            pieces:'white',
            playersTurn: true,
            initialPosition: ChessboardObject
        }

Data the 2nd player will receive:

        {
            pieces:'black',
            playersTurn: false,
            initialPosition: ChessboardObject
        }

- Basically, each player is informed which piece they are and who's turn it is (white will understandably have the first turn) allong with the initial setup for the board. All this info should be used to initialize the chessboard on the client, update the chessboard position/orientation, and ability to move pieces.

---

## 2. move-valid
- When a user submits a move, if it is valid, the server will emit 'move-made' to the user who sent the move. 
- Listener on the frontend:

        socket.on('move-valid', data=>{
            console.log(data) 
        })
- The data returned will be an object like this:  
        
        {
            valid:false,  //or true
            chess: chess //the valid chess object saved to the server
        }

## 3. move-made
- When a user submits a move, if it is valid, the other user in the room will be informed about which move it is with the emit 'move-made'.

        socket.on('move-made', data=>{
            console.log(data)
        })

- the data submitted is of an object notation for moves in chess.js

## 4. message-received
- When a user emits the event with 'message-sent', the server will check which room this user is in, and will emit the event 'message-received' to all the users in the room except the sender.

        socket.on('message-received',(msg)=>{
            console.log(msg)
        })

## 5. game-over
- When the game is over, this event will be emmited to users who are in the room. The data sent to the clients will look as so:
            
        {
            reason: 'checkmate',
            winner: 'white',
            loser: 'black'
        }

- If the reason for the game ending is a 'draw', 'stalemate', 'threefold-repetition', 'player-disconnected', or 'other',then the data sent to the users will look like this (winner and loser are only sent when a player has won the against the other):

        {
            reason: 'disconnected'
        }

## 6. draw-offered
- A user who receives this has just been offered a draw, and has the ability to either emit 'accept-draw' or 'decline-draw'.

## 7. draw-declined
- When this event is emmited from the server, it means that the user you have offered a draw to has declined your request.

## 8. dame-dameyu
- Both players will receive this emit at the same time when one player emits an event of the same name. Do as you please with it. 😎
---
# Events to emit from from frontned


## 1. make-move
- Backend and frontend are compatible. Now, if a user manages to submit an illegal move to the server, the server must return the board to its original state before the illegal move. A user who emits 'make-move' will also decline any active draw offers they may have received.

## 2. resign
-  Tells the server that the player who clicks it wishes to resign. This will end the game by emitting the 'game-over' event to both players.

## 3. offer-draw
- Offers a draw to the other user. Handled by server only if there is no current draw offer in the game.

## 4. accept-draw
- A user who is offered a draw will accept it, ending the game (end game message should be adjusted). Server will only handle this when the player to whom the draw has been offered emits this event.

## 5. decline-draw
- A user who is offered a draw will decline it. Server will only handle this when the player to whom the draw has been offered emits this event.

## 6. dame-dameyu
- A player who emits this to the server will cause the server to emit an event of the same name to both players in the room, including themself. Do as you please with it. 😎