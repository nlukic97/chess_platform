import {useContext, useEffect, useState} from 'react';
import Chess from 'chess.js';
import {Chessboard} from 'react-chessboard';
import {SocketContext, useSocket} from "../contexts/SocketProvider";

export default function CustomChessBoard({pieces, playersTurn}) {
    const [game, setGame] = useState(new Chess());
    const [playerColor,] = useState(pieces)
    const [isMyTurn, setIsMyTurn] = useState(playersTurn)
    const {socket} = useSocket()

    useEffect(() => {
        console.log("{pieces, playersTurn}", {pieces, playersTurn})
    }, [])

    useEffect(() => {
        console.log(socket);
        if (!socket) return
        // socket.on("game-started", ({pieces, playersTurn}) => {
        //     console.log("game-started");
        //     console.log({pieces, playersTurn})
        //     setPlayerColor(pieces)
        //     setIsMyTurn(playersTurn)
        // })
        socket.on("move-valid", ({valid, chess}) => {
            // safeGameMutate((game) => {
            //     game.move(move);
            // });
            console.log("move-valid");
            if (valid) setIsMyTurn(false)
            else {
                setGame(chess)
                alert("1337 haxx0r")
            }
            console.log(valid, chess);
        })
        socket.on("move-made", (move) => {
            // safeGameMutate((game) => {
            //     game.move(move);
            // });
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
        safeGameMutate((game) => {
            move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q' // always promote to a queen for example simplicity
            });
            // console.log(move);
            // setTimeout(makeRandomMove, 200);
            // conn.emit("make-move", {move: algebraicMove})
            // console.log(objToAlgebraic({}));
        });
        if (move === null) return false; // illegal move
        socket.emit("make-move", {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for example simplicity
        })
        return true;
    }

    // const fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"

    return (
        <div>
            <h1>{game.turn()}</h1>
            <h1>{JSON.stringify(game.header())}</h1>
            <Chessboard
                position={game.fen()}
                areArrowsAllowed={true}
                arePiecesDraggable={isMyTurn}
                arePremovesAllowed={false}
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
