import {v4 as uuidv4} from 'uuid';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import "./HomePage.scss"
import GeneralInfo from "./GeneralInfo";
import JoinARoomModal from "./JoinARoomModal";
import SetFENModal from "./SetFENModal";
import {fischerRandomPositions} from "../helpers";

export function HomePage({fen, setFen}) {

    const navigate = useNavigate()
    const [showJoinModal, setShowJoinModal] = useState(false)
    const [showFENModal, setShowFENModal] = useState(false)

    function handleCreateARoom() {
        const roomUuid = uuidv4()
        navigate(`/${roomUuid}`)
    }

    function handleJoinARoom() {
        console.log("join a room")
        setShowJoinModal(true)
    }

    function handleFischerRandom() {
        const position = fischerRandomPositions[Math.floor(Math.random() * (960 + 1))]
        setFen(position)
        handleCreateARoom()
    }

    function handleCustomFEN() {
        console.log("join a room")
        setShowFENModal(true)
    }

    return (
        <div className="HomePage">
            <div className="content-wrapper">
                <h1>Epic Multiplayer Chess</h1>
                <div>Actions:</div>
                <div>
                    <button onClick={handleCreateARoom}>
                        Create a room
                    </button>
                </div>
                <div>
                    <button onClick={handleJoinARoom}>
                        Join a room
                    </button>
                </div>
                <div>
                    <button onClick={handleFischerRandom}>
                        Create a Fischer Random room
                    </button>
                </div>
                <div>
                    <button onClick={handleCustomFEN}>
                        Create a custom room using FEN
                    </button>
                </div>
                {showJoinModal && <JoinARoomModal closeModal={() => setShowJoinModal(false)}/>}
                {showFENModal && <SetFENModal action={handleCreateARoom} fen={fen} setFen={setFen}
                                              closeModal={() => setShowFENModal(false)}/>}
                <GeneralInfo/>
            </div>
        </div>
    )
}