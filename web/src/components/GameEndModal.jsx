import React, {useEffect} from 'react';
import Modal from "./Modal";
import {IoCloseCircleSharp} from "react-icons/all";
import "./JoinARoomModal.scss"

function GameEndModal({closeModal, winner, reason}) {

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => document.body.style.overflow = "auto"
    },[])

    return (
        <Modal closeModal={closeModal}>
            <div className="game-id-form">
                <div className="modal-close-x" onClick={closeModal}>
                    <IoCloseCircleSharp/>
                </div>
                <div>
                    <div>Game ended! Result: </div>
                    <div><b>{winner} won by {reason}</b></div>
                </div>
            </div>
        </Modal>
    );
}

export default GameEndModal