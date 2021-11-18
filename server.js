const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000

const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public'))) 

app.use('/login', express.static(path.join(__dirname, 'public/login.html'))) 


let conn = 0;

io.on('connection', (socket) => {
  conn++
  console.log(socket.handshake.auth)

  if(socket.handshake.auth.token != 'abc'){
    socket.emit('redirect','/login')
  } else {
    console.log(socket.id + ' has connected');
    socket.emit('202-connected',socket.handshake.auth.token)
  }

  
  socket.on('disconnect', () => {
    conn--
    console.log(socket.id  + ' has disconnected');
  });
});


server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
