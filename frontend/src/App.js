import SocketProvider from "./contexts/SocketProvider";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {HomePage} from "./components/HomePage";
import {ChessGamePage} from "./components/ChessGamePage";

function App() {
    return (
        <SocketProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/:uuid" element={<ChessGamePage/>} />
                    <Route path="/" element={<HomePage/>} />
                </Routes>
            </BrowserRouter>
        </SocketProvider>
    );
}

export default App;
