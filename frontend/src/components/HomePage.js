import {v4 as uuidv4} from 'uuid';
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export function HomePage() {

    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [uuidInputed, setUuidInputed] = useState("")

    function handleCreateARoom() {
        const roomUuid = uuidv4()
        navigate(`/${roomUuid}`)
    }

    function handleJoinARoom(){
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
            <div>
                <input type="text" value={uuidInputed} onChange={e => setUuidInputed(e.target.value)}/>
                <button onClick={navigate(`/${uuidInputed}`)}>Dzojn</button>
            </div>
        </div>
    )
}