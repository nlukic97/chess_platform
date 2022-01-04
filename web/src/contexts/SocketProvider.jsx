import React, {createContext, useContext, useEffect, useState} from 'react';
import {io} from "socket.io-client";

export const SocketContext = createContext()
export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({children}) => {

    const [socket, setSocket] = useState(null)

    const connect = ({roomId, fen = false}) => {
        const queryParams = {roomId}
        if(fen) {
            queryParams.fen = fen
        }
        const socketConnection = io(process.env.REACT_APP_SERVER_ADDRESS, {
            query: queryParams
        })
        setSocket(socketConnection)
    }

    useEffect(() => {
        console.log("SocketProvider alive");
    }, [])

    useEffect(() => {
        console.log(`SocketProvider ${socket}`);
    }, [socket])

    return (
        <SocketContext.Provider value={{socket, connect}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;