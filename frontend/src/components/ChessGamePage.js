import CustomChessBoard from "./CustomChessBoard";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSocket} from "../contexts/SocketProvider";
import Chat from "./Chat";
import "./ChessGamePage.scss"

const ConnectingLoader = () => (
    <div className="connecting-loader-wrapper">
        <div className="loader-spinner" />
    </div>
)

export function ChessGamePage() {

    const {uuid} = useParams()
    const {socket, connect} = useSocket()
    const [gameStarted, setGameStarted] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [gameData, setGameData] = useState({})

    useEffect(() => {
        connect(uuid)
    }, [])

    useEffect(() => {
        console.log("socket useEffect");
        if(!socket) {
            console.log("not connected");
            return
        }
        socket.on("connect", () => {
            console.log("connected");
            setIsConnected(true)
        })
        socket.on("game-started", ({pieces, playersTurn}) => {
            console.log("game-started");
            setGameData({pieces, playersTurn})
            setGameStarted(true)
            console.log("{pieces, playersTurn} STATE", {pieces, playersTurn})
        })
        return () => {
            socket.off("game-started")
        }
    }, [socket])

    return (
        <div>
            <h1>ChessGamePage</h1>
            {
                !isConnected ? <div className="connecting-loader">Connecting...</div> :
                gameStarted ?
                <div className="game-chat-container">
                    <CustomChessBoard {...gameData} />
                    <Chat/>
                </div>
                : <h1>Waiting for the game to start</h1>
            }
        </div>
    );
}