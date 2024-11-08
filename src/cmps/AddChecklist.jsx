import { useState, useEffect, useRef } from 'react'
import { makeId } from '../services/util.service.js'

export function AddChecklist({ setTask, setIsAddChecklist }) {
    const [newChecklist, setChecklist] = useState({ id: '', title: 'Checklist', todos: [] })

    function handleChangeChecklistTitle({ target }) {
        setChecklist(prevChecklist => ({ ...prevChecklist, title: target.value }))
    }
    function addChecklist() {
        const newChecklistToSave = { ...newChecklist, id: makeId() }
        setTask(prevTask => ({ ...prevTask, checklists: [...prevTask.checklists, newChecklistToSave] }))
    }

    return (
        <div className="modal-adding-checklist">
            <h4>Title</h4>
            <input
                type="text"
                placeholder="Add an item"
                value={newChecklist.title}
                onChange={handleChangeChecklistTitle}
            />
            <button className="btn btn-add-checklist"
                onClick={() => { addChecklist(); setIsAddChecklist(false); setChecklist({ id: '', title: 'Checklist', todos: [] }) }}>
                Add
            </button>
        </div>
    )
}