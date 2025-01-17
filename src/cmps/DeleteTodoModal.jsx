
export function DeleteTodoModal({ onUpdateTodo, itemId, task, checklistId, action, handleCloseModal }) {
    return (
        <div className="modal-option" style={{ width: '15em' }}>
            <div className="option-modal-header">
                <h2>Item actions</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
            </div>

            <div className="delete-todo-modal-container">
                <button className="btn btn-remove-todo" onClick={() => onUpdateTodo(itemId, task, checklistId, action)}>
                    Delete
                </button>
            </div>
        </div>
    )
}