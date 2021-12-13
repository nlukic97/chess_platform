import {useContext, useEffect, useState} from 'react';
import Chess from 'chess.js';
import {Chessboard} from 'react-chessboard';
import {objToAlgebraic} from "../helpers";
import {SocketContext} from "../contexts/SocketProvider";

export default function CustomChessBoard() {
    const [game, setGame] = useState(new Chess());
    // const [conn, setConn] = useState(io("http://10.150.0.75:3000"))
    const [playerColor, setPlayerColor] = useState("white")
    const [isMyTurn, setIsMyTurn] = useState(true)
    const {socket} = useContext(SocketContext)
    // const [toMove, setToMove] = useState("w")
    // is-valid
    // make-move
    useEffect(() => {
        console.log(socket);
        if (!socket) return
        socket.on("is-valid", (move) => {
            // safeGameMutate((game) => {
            //     game.move(move);
            // });
            setIsMyTurn(false)
            console.log(move);
        })
        socket.on("move-made", (move) => {
            // safeGameMutate((game) => {
            //     game.move(move);
            // });
            console.log(move);
            setGame(g => {
                const gameCopy = {...g};
                gameCopy.move(move)
                return gameCopy
            })
            setIsMyTurn(true)
            console.log(move);
        })
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

    // function makeRandomMove() {
    //     const possibleMoves = game.moves();
    //     // console.log(game);
    //     // console.log(game.turn());
    //     // console.log(possibleMoves);
    //     // setToMove(game.turn())
    //     if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return; // exit if the game is over
    //     const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    //     safeGameMutate((game) => {
    //         game.move(possibleMoves[randomIndex]);
    //     });
    // }

    function onDrop(sourceSquare, targetSquare) {
        let move = null;
        safeGameMutate((game) => {
            move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q' // always promote to a queen for example simplicity
            });
        });
        // console.log(game);
        const algebraicMove = objToAlgebraic({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for example simplicity
        })
        // conn.emit("make-move", {move: algebraicMove})
        // console.log(objToAlgebraic({}));
        socket.emit("make-move", {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for example simplicity
        })
        if (move === null) return false; // illegal move
        // console.log(move);
        // setTimeout(makeRandomMove, 200);
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
