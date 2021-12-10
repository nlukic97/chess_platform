var socket = io('http://localhost:3000');

socket.on('connection', (socket) => {
    console.log('connected successfully');
    socket.emit('join-room',roomId)
    
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
    
    
    
});

// probably should just use http headers, not sure how to do it manually yet
socket.on('202-connected',(token)=>{
    console.log('Successfully authenticated to the server.');
    document.cookie = `token=${token}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`
    console.log(document.cookie);
    
})

socket.on('poruka',(data)=>{
    console.log(data);
})

socket.on('redirect',(location)=>{
    window.location.href = location // '/login' is the redirect location upon auth fail
})

socket.on('disconnect',()=>{
    console.log('You have been disconnected');
})

// event is fired when a user wants to send a move
document.querySelector('button').addEventListener('click',()=>{
    let move = document.querySelector('input')
    
    let data = {
        move: move.value,
        user: socket.id
    }
    console.log(data);
    move.value = ''
    
    socket.emit('new-move',data)
})

