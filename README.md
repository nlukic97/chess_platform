# Online chess multiplayer
## Goal:
- Create an online multiplayer chess game using node.js.

### Tasks to complete:
- Designing the user interface (chessboard, chat, timer, pieces)
- Implementing a chess library for handling the game status and available moves (serverside most likely)
- Server side sanitization of the legality of a submited move
- Client side validation of the legalilty of a submitted move
- Only allow 2 players to be in the room at a time
- Display of the chessboard pieces
- Animating the movement of the pieces
---
### Potential bonus tasks:
- Create multiple rooms for different players to play (custom uuid url's)
- Add a time limit for both players (perhaps running the interval on the server and updating it on the client side every second?)
- Authenticating players so they can save progress/ score
    - Saving users, scores, and games (with room id and status of 'active' or 'inactive') in a database
- Allow the 3rd+ client to be an observer
- Allow the 3rd+ client to see a computer analysis of who is curently winning
---

#### Interesting link for the chess UI:
- https://chessboardjs.com/#start

## Installation
        git clone https://github.com/nlukic97/chess_platform

        cd chess_platform 
        
        npm install

        npm run start
