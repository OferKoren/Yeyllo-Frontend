import { useState, useEffect, useRef } from 'react'

export function Dates({ task, handleChange, setIsEditDates, setTask }) {

    function onRemoveDueDate() {
        const { dueDate, status, ...updatedTask } = task
        setTask(updatedTask)
    }

    return (
        <div className="modal-option">
            <div className="option-modal-header">
                <h2>Dates</h2>
                <i className="btn fa-solid fa-xmark" onClick={() => setIsEditDates(false)}></i>
            </div>
            <input value={task.dueDate || "2024-10-23"}
                type="date"
                id="dueDate"
                className="task-dueDate"
                name="dueDate"
                onChange={handleChange}
            ></input>
            <button className="btn btn-clear" onClick={onRemoveDueDate}>Remove</button>
        </div>
    )
}