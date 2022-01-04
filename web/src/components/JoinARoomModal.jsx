import React, {useState} from 'react';
import Modal from "./Modal";
import {useNavigate} from "react-router-dom";
import "./JoinARoomModal.scss"
import {IoCloseCircleSharp} from "react-icons/all";

const JoinARoomModal = ({closeModal}) => {
    const navigate = useNavigate()
    const [uuidInputed, setUuidInputed] = useState("")

    return (
        <Modal closeModal={closeModal}>
            <div className="game-id-form">
                <div className="modal-close-x" onClick={closeModal}>
                    <IoCloseCircleSharp/>
                </div>
                <div>Room ID</div>
                <div className="input-wrapper">
                    <input type="text" placeholder="Enter room ID here" value={uuidInputed}
                           onChange={e => setUuidInputed(e.target.value)}/>
                </div>
                <div className="btn-wrapper">
                    <button onClick={() => navigate(`/${uuidInputed}`)}>Join!</button>
                </div>
            </div>
        </Modal>
    );
};

export default JoinARoomModal;