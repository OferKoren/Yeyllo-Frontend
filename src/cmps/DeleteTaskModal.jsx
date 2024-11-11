

export function DeleteTaskModal({ handleCloseModal, handleOpenModal }) {
    return (
        <div className="modal-option">
            <div className="option-modal-header">
                <h2>Delete card?</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={() => handleOpenModal('archive')}></i>
            </div>

            <div className="delete-task-modal-container">
                <p>
                    All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.
                </p>

                <button className="btn btn-remove-task btn-delete" onClick={handleCloseModal}>
                    Delete
                </button>
            </div>
        </div>
    )
}