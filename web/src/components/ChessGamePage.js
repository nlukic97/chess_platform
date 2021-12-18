import CustomChessBoard from "./CustomChessBoard";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSocket} from "../contexts/SocketProvider";
import Chat from "./Chat";
import "./ChessGamePage.scss"
import Modal from "./Modal";

const ConnectingLoader = () => (
    <Modal>
        <div className="loader-spinner"/>
    </Modal>
)

const RoomLink = ({roomID}) => (
    <Modal>
        <div className="waiting-room">
            <div>Share the room ID or send the link to your friend!</div>
            <div>
                <div className="label">Room ID:</div>
                <div className="room-id-wrapper">
                    <div className="room-id-label">{roomID}</div>
                    <button onClick={() => navigator.clipboard.writeText(roomID)}>Copy to Clipboard!</button>
                </div>
            </div>
            <div>
                <div>Direct link:</div>
                <div className="room-id-wrapper">
                    <div className="room-id-label">{`${window.location.href}`}</div>
                    <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy to Clipboard!</button>
                </div>
            </div>
            <div>
                Waiting for the opponent to join...
            </div>
        </div>
    </Modal>
)

export function ChessGamePage({fen = false}) {

    const {uuid} = useParams()
    const {socket, connect} = useSocket()
    const [gameStarted, setGameStarted] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [gameData, setGameData] = useState({})

    useEffect(() => {
        const connectionParams = {roomId: uuid}
        if(fen) {
            connectionParams.fen = fen
        }
        connect(connectionParams)
    }, [])

    useEffect(() => {
        console.log("socket useEffect");
        if (!socket) {
            console.log("not connected");
            return
        }

        socket.on('ping-client', ()=> {
            socket.emit('pong-server');
        });

        socket.on("connect", () => {
            console.log("connected");
            setIsConnected(true)
        })
        socket.on("game-started", ({pieces, playersTurn, initialPosition}) => {
            console.log("game-started");
            setGameData({pieces, playersTurn, initialPosition})
            setGameStarted(true)
            console.log("{pieces, playersTurn, initialPosition} STATE", {pieces, playersTurn, initialPosition})
        })
        return () => {
            socket.off("game-started")
        }
    }, [socket])

    return (
        <div>
            {!isConnected && <ConnectingLoader/>}
            {isConnected && gameStarted ? (
                <div className="game-chat-wrapper">
                    <CustomChessBoard {...gameData} />
                    <Chat/>
                </div>
            ) : (
                <RoomLink roomID={uuid}/>
            )}
        </div>
    );
}