async function getToken(){
    if(document.cookie != ''){
        return document.cookie.replace('token=','');
    } else {
        return await prompt('What is the token?') // it's:  'abc'
    }
    
}

getToken().then(ans=>{
    connectToServer(ans)
})


function connectToServer(token){
    var socket = io({
        auth: {
            token: token
        }
    });
    
    socket.on('connection', (socket) => {
        console.log('connected to the server');
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
        });
        
        
        
    });
    
    socket.on('202-connected',(token)=>{
        console.log('Successfully authenticated to the server.', token);
        document.cookie = `token=${token}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`
        console.log(document.cookie);
    })

    socket.on('redirect',(location)=>{
        window.location.href = location
    })
    
    socket.on('disconnect',()=>{
        console.log('You have been disconnected');
    })
}