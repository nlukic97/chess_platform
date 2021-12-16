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
            playersTurn: true
        }

Data the 2nd player will receive:

        {
            pieces:'black',
            playersTurn: false
        }

- Basically, each player is informed which piece they are and who's turn it is (white will understandably have the first turn). This info should be used to update the chessboard position, and ability to move pieces.

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

# Events to emit from from frontned
## 1. make-move
-  <del>this is mostly finished, I just need to make sure what the data being passed to the server looks like for validation</del>
- Backend and frontend are compatible. Now, if a user manages to submit an illegal move to the server, the server must return the board to its original state before the illegal move.