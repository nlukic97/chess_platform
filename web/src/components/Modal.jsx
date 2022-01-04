import "./Modal.scss"
import ReactDOM from "react-dom";

export default function Modal({children, closeModal = null}) {
    return ReactDOM.createPortal(
        <div className="modal" onClick={closeModal}>
            <div onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.getElementById("portal")
    )
}