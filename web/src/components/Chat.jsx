import React, {useEffect, useRef, useState} from 'react';
import {useSocket} from "../contexts/SocketProvider";
import "./Chat.scss"
import {FiSend} from "react-icons/all";

const Chat = () => {
    
    const [messages, setMessages] = useState([])
    const [messageInput, setMessageInput] = useState("")
    const {socket} = useSocket()
    const bottomOfChatRef = useRef()
    
    useEffect(() => {
        // console.log("chat init");
        setMessages([{type:"msg", msg: "The game has started! Please wait 1s before starting to speak when sending a voice message. It's a feature.", timestamp: 0}])
        
        /* Adding audio to an audio message to be added to the chat */
        socket.on('receiveAudio',async (arrayBuffer)=>{
            var blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
            /* var audio = document.createElement("audio")
            audio.src = window.URL.createObjectURL(blob)
            audio.play() */
            setMessages(oldMsgs => [...oldMsgs, {type:'voice',src:window.URL.createObjectURL(blob), timestamp: new Date().getTime()}])
        })
    }, [])
    
    useEffect(() => {
        // console.log("socket useeffect in chat");
        // console.log(socket);
        if (!socket) return
        socket.on("message-received", ({msg, timestamp}) => {
            // console.log("message-received")
            setMessages(oldMsgs => [...oldMsgs, {type:"msg", msg: `them: ${msg}`, class:'them', timestamp}])
        })
    }, [socket])
    
    useEffect(() => {
        bottomOfChatRef.current.scrollIntoView({})
    }, [messages])
    
    function sendMessage() {
        if (messageInput.trim() === "") return
        // console.log(messageInput);
        // console.log("message-sent");
        setMessages(oldMsgs => [...oldMsgs, {type:"msg", msg: `me: ${messageInput}`, class:'me', timestamp: new Date().getTime()}])
        socket.emit("message-sent", messageInput)
        setMessageInput("")
    }
    
    function handleChatFormSubmit(e) {
        e.preventDefault()
        sendMessage()
    }
    
    // console.log("rerender chat");
    
    return (
        <div className="messages-wrapper">
        <div className="messages-container">
        {
            messages.map(msg => msg.type === "msg" ?
            (<div className={msg.class + ' message'} key={msg.timestamp}>{msg.msg}</div>)
            : 
            <audio key={msg.timestamp} src={msg.src} controls style={{width:'100%'}}></audio>
            )
            
        }
        <div ref={bottomOfChatRef}/>
        </div>
        <div className="form-container">
        <form className="chat-form" onSubmit={handleChatFormSubmit}>
        <input type="text" placeholder="Enter your message here" value={messageInput}
        onChange={e => setMessageInput(e.target.value)}/>
        <button><FiSend/></button>
        </form>
        </div>
        </div>
        );
    };
    
    export default Chat;