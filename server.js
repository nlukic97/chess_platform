const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000

const path = require('path')

// Paths
app.use('/', express.static(path.join(__dirname, 'public'))) 
app.use('/login', express.static(path.join(__dirname, 'public/login.html'))) 


let conn = 0; //nodes connected (if 2, do not allow other socket connections)

io.on('connection', (socket) => {
  conn++
  console.log(socket.handshake.auth)
  Auth(socket)
  
  socket.on('disconnect', () => {
    conn--
    console.log(socket.id  + ' has disconnected');
  });
});


// Authentication method to the socket server (def not a propper auth, that could be done with this: passportjs.org/docs/downloads/html/   maybe)
function Auth(socket){
  if(socket.handshake.auth.token != 'abc'){
    socket.emit('redirect','/login')
    socket.disconnect() // just in case
  } else {
    console.log(socket.id + ' has connected');
    socket.emit('202-connected',socket.handshake.auth.token)
  }
}


server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
