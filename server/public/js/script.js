var socket = io('http://localhost:1234',{
    query: {
        roomId:123,
        // landscape:'backend'
    }
});

socket.on('connection', (socket) => {
    console.log('connected successfully');
    
});

socket.on('game-started',data=>{
    console.log('The game has started, here is your data:',data);
})

socket.on('move-made',data=>{
    console.log('server-data',data);
})

socket.on('illegal-move',message=>{
    console.log(message);
})

socket.on('disconnect',()=>{
    console.log('You have been disconnected');
})

// event is fired when a user wants to send a move
document.querySelector('button').addEventListener('click',()=>{
    let move = document.querySelector('input')
    
    let data = {
        move: move.value,
        // user: socket.id
    }
    console.log('my-data',data);
    // move.value = ''e
    
    socket.emit('make-move',data)
})
