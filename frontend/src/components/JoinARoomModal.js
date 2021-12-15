import React, {useState} from 'react';
import Modal from "./Modal";
import {useNavigate} from "react-router-dom";

const JoinARoomModal = ({closeModal}) => {
    const navigate = useNavigate()
    const [uuidInputed, setUuidInputed] = useState("")

    return (
        <Modal closeModal={closeModal}>
            <div className="game-id-form">
                <div className="input-wrapper">
                    <label>Room ID</label>
                    <input type="text" value={uuidInputed} onChange={e => setUuidInputed(e.target.value)}/>
                </div>
                <div className="btn-wrapper">
                    <button onClick={() => navigate(`/${uuidInputed}`)}>Join!</button>
                </div>
            </div>
        </Modal>
    );
};

export default JoinARoomModal;