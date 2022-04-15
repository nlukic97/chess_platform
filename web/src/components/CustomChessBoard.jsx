import {useEffect, useState} from 'react';
import Chess from 'chess.js';
import {Chessboard} from 'react-chessboard';
import {useSocket} from "../contexts/SocketProvider";
import "./CustomChessBoard.scss"
import GameEndModal from "./GameEndModal";
import SoundBoard from './SoundBoard';
import { playCheckAudio } from '../helpers';

export default function CustomChessBoard({pieces, playersTurn, game, setGame, safeGameMutate}) {
    const [playerColor,] = useState(pieces)
    // const [isMyTurn, setIsMyTurn] = useState(playersTurn)
    const [gameEnded, setGameEnded] = useState(false)
    const [gotADrawOffer, setGotADrawOffer] = useState(false)
    const [cbWidth, setCbWidth] = useState(Math.min(500, window.outerWidth * .95))
    const {socket} = useSocket()

    console.log("Math.min(500, window.outerWidth * .95)", Math.min(500, window.outerWidth * .95));

    useEffect(() => {
        // console.log("{pieces, playersTurn}", {pieces, playersTurn})
        const resizeListener = () => {
            setCbWidth(Math.min(500, window.outerWidth * .95))
        }
        window.addEventListener("resize", resizeListener)
        return () => window.removeEventListener("resize", resizeListener)
    }, [])

    useEffect(() => {
        // console.log(socket);
        if (!socket) return
        socket.on("move-valid", ({valid, chess}) => {
            // console.log("move-valid");
            if (!valid) {
                // console.log("chess:", chess);
                // console.log("MOVE IS INVALID");
                setGame(new Chess(chess))
            }
            if(game.in_check()) {
                playCheckAudio()
            }
            // console.log(valid, chess);
        })
        socket.on("move-made", (move) => {
            // console.log("move-made");
            setGame(g => {
                const gameCopy = {...g};
                gameCopy.move(move)
                
                if(gameCopy.in_check()) {
                    playCheckAudio()
                }
                return gameCopy
            })

            // setIsMyTurn(true)
            // console.log(move);
        })
        socket.on("game-over", (msg) => {
            setGameEnded(msg)
            setGotADrawOffer(false)
        })

        socket.on('draw-declined',()=>{
            alert('draw declined!');
        })
        
        socket.on('draw-offered',()=>{
            alert('draw offered!');
            setGotADrawOffer(true)
        })

        return () => {
            socket.off("make-move")
            socket.off("is-valid")
            socket.off("game-started")
        }
    }, [socket])

    useEffect(() => {
        document.title = ((game.turn() === "b") === playersTurn) ? "🔥 C H E S S 🔥" : "YOUR MOVE!"
        console.log({playersTurn})
        console.log("game.turn():", game.turn())
        return () => document.title = "🔥 C H E S S 🔥"
    }, [game])

    function onDrop(sourceSquare, targetSquare) {
        let move = null;
        if (game.turn() !== playerColor[0].toLowerCase()) return
        safeGameMutate((game) => {
            move = game.move({
                from: sourceSquare,
                to: targetSquare,
                // TODO: add promotion
                promotion: 'q'
            });
        });
        if (move === null) return false;
        socket.emit("make-move", {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // TODO: add promotion
        })
        return true;
    }

    // const fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"

    return (
        <div>
            <div className="CustomChessBoard">
                <Chessboard
                    position={game?.fen()}
                    areArrowsAllowed={true}
                    // arePiecesDraggable={isMyTurn}
                    arePremovesAllowed={true}
                    animationDuration={100}
                    boardOrientation={playerColor}
                    boardWidth={cbWidth}
                    clearPremovesOnRightClick={true}
                    onPieceDrop={onDrop}
                    showBoardNotation={true}
                />
            </div>
            {gameEnded && <GameEndModal winner={gameEnded.winner} reason={gameEnded.reason}
                                        closeModal={() => setGameEnded(false)}/>}
            <div>
                <button onClick={()=>{socket.emit('resign')}}>Resign</button>
                <button onClick={()=>{socket.emit('offer-draw')}}>Draw</button>
            </div>
            <div>
                {gotADrawOffer && (
                    <>
                        <button onClick={()=>{socket.emit('accept-draw')}}>accept Draw</button>
                        <button onClick={()=>{socket.emit('decline-draw'); setGotADrawOffer(false)}}>decline Draw</button>
                    </>
                )}
            </div>
            <SoundBoard />
        </div>
    );
}
