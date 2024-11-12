
import { useState, useEffect, useRef } from 'react'
import { LabelEdit } from '../cmps/LabelEdit.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { SET_LABELS } from '../store/reducers/board.reducer.js'

export function Labels({ task, setTask, boardToEdit, setBoardToEdit, handleCloseModal, setIsEditLabels }) {

    const [isEditLabel, setIsEditLabel] = useState(false)
    const [labelToEdit, setLabelToEdit] = useState(false)
    const gLabels = useSelector((storeState) => storeState.boardModule.labels || [])
    const dispatch = useDispatch()

    function toggleLabel(label) {
        setTask((prevTask) => {
            if (prevTask.labelIds?.includes(label.id)) {
                return { ...prevTask, labelIds: prevTask.labelIds.filter(item => item !== label.id) }
            } else {
                return { ...prevTask, labelIds: (!prevTask.labelIds) ? [label.id] : [...prevTask.labelIds, label.id] }
            }
        })
    }

    useEffect(() => {
        const updatedLabels = gLabels.map(label => {
            const existingLabel = boardToEdit.labels.find(l => l.id === label.id)
            if (existingLabel) {
                return { ...existingLabel }
            }
            else {
                return label
            }
        })

        if (boardToEdit?.labels) {
            dispatch({
                type: SET_LABELS,
                labels: updatedLabels,
            })
        }
    }, [boardToEdit?.labels, dispatch])

    return (
        <>
            <div className="modal-option task-labels">
                <div className="task-labels-header option-modal-header">
                    <h2>Labels</h2>
                    <i className="btn fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
                </div>

                <div className="labels-container">
                    <h3>Labels</h3>
                    {gLabels.map((label) => {
                        const taskLabel = task.labelIds?.find(labelId => labelId === label.id)
                        const gLabel = gLabels.find(l => l.id === label.id)
                        return (<div key={label.id} className="checkbox-label">
                            <input
                                type="checkbox"
                                id={label.id}
                                checked={taskLabel || false}
                                onChange={() => toggleLabel({ ...label, title: (gLabel?.title || '') })}
                            />
                            <label className="task-label"
                                htmlFor={label.id}
                                style={{ backgroundColor: label.color }}>
                                {<div>{gLabel?.title || ''}</div>}
                            </label>
                            <img src="/img/icons/icon-pencil.svg" onClick={() => { setIsEditLabel(prev => !prev); setLabelToEdit({ ...label, title: (gLabel?.title || '') }) }} />
                        </div>)
                    })}
                </div>
            </div>
            {isEditLabel &&
                <LabelEdit setIsEditLabels={setIsEditLabels} labelToEdit={labelToEdit} setIsEditLabel={setIsEditLabel}
                    setLabelToEdit={setLabelToEdit} setBoardToEdit={setBoardToEdit} setTask={setTask} />}
        </>
    )
}