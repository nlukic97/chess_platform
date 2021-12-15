import {v4 as uuidv4} from 'uuid';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import "./HomePage.scss"
import GeneralInfo from "./GeneralInfo";
import JoinARoomModal from "./JoinARoomModal";

export function HomePage() {

    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)

    function handleCreateARoom() {
        const roomUuid = uuidv4()
        navigate(`/${roomUuid}`)
    }

    function handleJoinARoom() {
        console.log("join a room");
        setShowModal(true)
    }

    return (
        <div>
            <h1>HomePage</h1>
            <button onClick={handleCreateARoom}>
                Create a room
            </button>
            <button onClick={handleJoinARoom}>
                Join a room
            </button>
            {showModal && <JoinARoomModal closeModal={() => setShowModal(false)}/>}
            <GeneralInfo/>
        </div>
    )
}