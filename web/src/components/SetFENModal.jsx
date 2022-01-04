import React, {useState} from "react";
import Modal from "./Modal";
import {IoCloseCircleSharp} from "react-icons/all";
import "./JoinARoomModal.scss"
import validateFEN from 'fen-validator';

export default function SetFENModal({fen, setFen, closeModal, action}) {

    const [error, setError] = useState(false)

    function handleInputChange(e) {
        setFen(e.target.value)
        if (!validateFEN(e.target.value)) {
            setError(true)
            return
        } else {
            setError(false)
        }
    }


    function handleCreateRoomClick() {
        if (!validateFEN(fen)) {
            setError(true)
            return
        }
        action()
    }

    return (
        <Modal closeModal={closeModal}>
            <div className="game-id-form">
                <div className="modal-close-x" onClick={closeModal}>
                    <IoCloseCircleSharp/>
                </div>
                <div>
                    <div>Custom FEN {error && <span>Invalid FEN!</span>}</div>
                    <div className="input-wrapper">
                        <input className="FEN" type="text" placeholder="Enter FEN here" value={fen}
                               onChange={handleInputChange}/>
                    </div>
                </div>
                <div className="btn-wrapper">
                    <button onClick={handleCreateRoomClick}>Create!</button>
                </div>
            </div>
        </Modal>
    );
}