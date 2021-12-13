# Events to listen for in the frontend
## 1. game-started

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
---
Basically, each player is informed which piece they are and who's turn it is (white will understandably have the first turn). This info should be used to update the chessboard position, and ability to move pieces.

### Event listener for frontned:


            socket.on('game-started', data=>{
                console.log(data)
            })


---

## 2. move-made
- When one user emits the 'make-move' event, the server will emit the 'move-made' event to both users (may need to change data being passed down to include who's turn it is so the frontend can update it).

        socket.on('move-made', data=>{
            console.log(data)
        })


----

## 3. illegal-move
- If a user makes a move when it is not their turn, or try to submit an illegal move, the server will emit this event informing the user who made the submission that the move is not permitted and will not be registered.

        socket.on('illegal-move',message=>{
            console.log(message);
        })
----
# Events to emit from from frontned
## 1. make-move
-  <del>this is mostly finished, I just need to make sure what the data being passed to the server looks like for validation</del>
- Backend and frontend are compatible. Now, if a user manages to submit an illegal move to the server, the server must return the board to its original state before the illegal move.