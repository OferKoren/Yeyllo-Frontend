
export function DeleteChecklistModal({ handleCloseModal, onRemoveChecklist, checklistId }) {

    return (
        <div className="modal-option">
            <div className="option-modal-header">
                <h2>Delete checklist?</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
            </div>
            <div className="delete-task-modal-container">
                <p>
                    Deleting a checklist is permanent and there is no way to get it back.
                </p>

                <button className="btn btn-remove-task btn-delete" onClick={() => { handleCloseModal(); onRemoveChecklist(checklistId) }}>
                    Delete checklist
                </button>
            </div>
        </div>
    )
}