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
    <div>
        <div>Share the room ID or send the link to your friend!</div>
        <div>
            <div>Room ID</div>
            {roomID}
        </div>
        {/*<div>*/}
        {/*    <div>Direct link</div>*/}
        {/*    <div>{`${window.location.href}`}</div>*/}
        {/*</div>*/}
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
        if (!socket) {
            console.log("not connected");
            return
        }
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
            <h1>ChessGamePage</h1>
            {!isConnected && <ConnectingLoader/>}
            {isConnected && gameStarted ? (
                <div className="game-chat-container">
                    <CustomChessBoard {...gameData} />
                    <Chat/>
                </div>
            ) : (
                <RoomLink roomID={uuid} />
            )}
        </div>
    );
}