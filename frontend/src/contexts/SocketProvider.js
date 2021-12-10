import React, {createContext, useEffect, useState} from 'react';
import {io} from "socket.io-client";

export const SocketContext = createContext()

const SocketProvider = ({children}) => {

    const [socket, setSocket] = useState(null)

    useEffect(()=> {
        setSocket(io(process.env.REACT_APP_SERVER_ADDRESS,{
            query: {
                roomId:123
            }
        }))
    },[])

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;