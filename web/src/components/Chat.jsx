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
        setMessages([{msg: "The game has started!", timestamp: 0}])
    }, [])

    useEffect(() => {
        // console.log("socket useeffect in chat");
        // console.log(socket);
        if (!socket) return
        socket.on("message-received", ({msg, timestamp}) => {
            // console.log("message-received")
            setMessages(oldMsgs => [...oldMsgs, {msg: `them: ${msg}`, timestamp}])
        })
    }, [socket])

    useEffect(() => {
        bottomOfChatRef.current.scrollIntoView({})
    }, [messages])

    function sendMessage() {
        if (messageInput.trim() === "") return
        // console.log(messageInput);
        // console.log("message-sent");
        setMessages(oldMsgs => [...oldMsgs, {msg: `me: ${messageInput}`, timestamp: new Date().getTime()}])
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
                {messages.map(msg => <div className="message" key={msg.timestamp}>{msg.msg}</div>)}
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