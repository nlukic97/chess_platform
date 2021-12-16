import {useEffect, useState} from 'react';
import Chess from 'chess.js';
import {Chessboard} from 'react-chessboard';
import {useSocket} from "../contexts/SocketProvider";
import "./CustomChessBoard.scss"

export default function CustomChessBoard({pieces, playersTurn, initialPosition}) {
    console.log("initialPosition", initialPosition);
    const [game, setGame] = useState(initialPosition ? new Chess(initialPosition) : new Chess());
    const [playerColor,] = useState(pieces)
    const [isMyTurn, setIsMyTurn] = useState(playersTurn)
    const {socket} = useSocket()

    useEffect(() => {
        console.log("{pieces, playersTurn}", {pieces, playersTurn})
    }, [])

    useEffect(() => {
        console.log(socket);
        if (!socket) return
        socket.on("move-valid", ({valid, chess}) => {
            console.log("move-valid");
            if (!valid) {
                console.log("chess:", chess);
                console.log("MOVE IS INVALID");
                setGame(new Chess(chess))
            }
            console.log(valid, chess);
        })
        socket.on("move-made", (move) => {
            console.log("move-made");
            console.log(move);
            setGame(g => {
                const gameCopy = {...g};
                gameCopy.move(move)
                return gameCopy
            })
            setIsMyTurn(true)
            console.log(move);
        })
        socket.on("game-over", (msg) => {
            console.log(msg);
            alert(msg)
        })
        return () => {
            socket.off("make-move")
            socket.off("is-valid")
            socket.off("game-started")
        }
    }, [socket])

    function safeGameMutate(modify) {
        // await new Promise((resolve, reject) => {
        //     resolve()
        // })
        setGame((g) => {
            const update = {...g};
            modify(update);
            return update;
        });
    }

    function onDrop(sourceSquare, targetSquare) {
        let move = null;
        if(game.turn() !== playerColor[0].toLowerCase()) return
        safeGameMutate((game) => {
            move = game.move({
                from: sourceSquare,
                to: targetSquare,
                // TODO: add premove
                promotion: 'q'
            });
        });
        if (move === null) return false;
        socket.emit("make-move", {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // TODO: add premove
        })
        return true;
    }

    // const fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"

    return (
        <div className="CustomChessBoard">
            <Chessboard
                position={game.fen()}
                areArrowsAllowed={true}
                // arePiecesDraggable={isMyTurn}
                arePremovesAllowed={true}
                animationDuration={100}
                boardOrientation={playerColor}
                boardWidth={500}
                clearPremovesOnRightClick={true}
                onPieceDrop={onDrop}
                showBoardNotation={true}
            />
        </div>
    );
}
