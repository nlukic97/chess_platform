import React, {useEffect, useState} from 'react';
import {useSocket} from "../contexts/SocketProvider";
import "./Chat.scss"

const Chat = () => {

    const [messages, setMessages] = useState([])
    const [messageInput, setMessageInput] = useState("")
    const {socket} = useSocket()

    useEffect(() => {
        console.log("socket useeffect in chat");
        console.log(socket);
        if(!socket) return
        socket.on("message-received", ({msg, timestamp}) => {
            console.log("message-received")
            setMessages(oldMsgs => [...oldMsgs, {msg: `them: ${msg}`, timestamp}])
        })
    }, [socket])

    function sendMessage() {
        if (messageInput.trim() === "") return
        console.log(messageInput);
        console.log("message-sent");
        setMessages(oldMsgs => [...oldMsgs, {msg: `me: ${messageInput}`, timestamp: new Date().getTime()}])
        socket.emit("message-sent", messageInput)
        setMessageInput("")
    }

    function handleKeyPress(e) {
        if (e.key === "Enter") {
            sendMessage()
        }
    }

    console.log("rerender chat");

    return (
        <div className="messages-wrapper">
            <div className="messages-container">
                {messages.map(msg => <div key={msg.timestamp}>{msg.msg}</div>)}
            </div>
            <div className="message-input">
                <input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyPress={handleKeyPress} />
                <button onClick={sendMessage}>Send Message!</button>
            </div>
        </div>
    );
};

export default Chat;