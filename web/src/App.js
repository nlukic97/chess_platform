import SocketProvider from "./contexts/SocketProvider";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {HomePage} from "./components/HomePage";
import {ChessGamePage} from "./components/ChessGamePage";
import {useState} from "react";

function App() {

    const [fen, setFen] = useState("")

    return (
        <SocketProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/:uuid" element={<ChessGamePage fen={fen}/>} />
                    <Route path="/" element={<HomePage fen={fen} setFen={setFen}/>} />
                </Routes>
            </BrowserRouter>
        </SocketProvider>
    );
}

export default App;
