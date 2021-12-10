import CustomChessBoard from "./components/CustomChessBoard";
import SocketProvider from "./contexts/SocketProvider";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
    return (
        <SocketProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/123" element={<CustomChessBoard/>} />
                </Routes>
            </BrowserRouter>
        </SocketProvider>
    );
}

export default App;
