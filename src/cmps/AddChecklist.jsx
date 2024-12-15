import { useState, useEffect, useRef } from 'react'
import { makeId } from '../services/util.service.js'

export function AddChecklist({ task, setTask, handleCloseModal, addActivity }) {
    const [newChecklist, setChecklist] = useState({ id: '', title: 'Checklist', todos: [] })

    function handleChangeChecklistTitle({ target }) {
        setChecklist(prevChecklist => ({ ...prevChecklist, title: target.value }))
    }
    function addChecklist() {
        const newChecklistToSave = { ...newChecklist, id: makeId() }
        addActivity(`added ${newChecklistToSave.title} to card "${task.title}"`)

        setTask(prevTask => ({ ...prevTask, checklists: (!prevTask.checklists) ? [newChecklistToSave] : [...prevTask.checklists, newChecklistToSave] }))
    }

    return (
        <div className="modal-option modal-adding-checklist">
            <div className="option-modal-header">
                <h2>Add checklist</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
            </div>

            <div className="add-checklist-container">
                <div>
                    <h3>Title</h3>
                    <input
                        type="text"
                        placeholder="Add an item"
                        autoFocus
                        value={newChecklist.title}
                        onChange={handleChangeChecklistTitle}
                    />
                </div>
                <div className="btn btn-dark btn-add-checklist"
                    onClick={() => { addChecklist(); handleCloseModal(); setChecklist({ id: '', title: 'Checklist', todos: [] }) }}>
                    Add
                </div>
            </div>
        </div>
    )
}