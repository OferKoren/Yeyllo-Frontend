import { useState, useEffect, useRef } from 'react'

export function LabelEdit({ setIsEditLabels, labelToEdit, setLabelToEdit, setBoardToEdit, setIsEditLabel }) {

    function handleChangeLabelTitle({ target }) {
        setLabelToEdit(prevLabel => ({ ...prevLabel, title: target.value }))
    }

    function saveUpdatedLabel() {

        setBoardToEdit(prevBoard => {
            const labelExists = prevBoard.labels.some(l => l.id === labelToEdit.id)

            if (labelExists) {
                return {
                    ...prevBoard,
                    labels: prevBoard.labels.map(l =>
                        l.id === labelToEdit.id ? labelToEdit : l
                    )
                }
            } else {
                return {
                    ...prevBoard,
                    labels: [...prevBoard.labels, labelToEdit]
                }
            }
        })
    }

    return (
        <div className="modal-option">
            <div className="edit-labels-header option-modal-header">
                <i className="btn fa-solid fa-chevron-left" onClick={() => setIsEditLabel(false)}></i>
                <h2>Edit label</h2>
                <i className="btn fa-solid fa-xmark" onClick={() => { setIsEditLabels(false) }}></i>
            </div>

            <div className="label-preview">
                <span className="label-preview-details" style={{ background: labelToEdit.color }}>{labelToEdit.title}</span>
            </div>

            <div className="add-checklist-container">
                <div>
                    <h3>Title</h3>
                    <input
                        type="text"
                        value={labelToEdit.title}
                        onChange={handleChangeLabelTitle}
                    />
                </div>
                <button className="btn btn-dark btn-add-checklist" onClick={() => { saveUpdatedLabel(); setIsEditLabel(false) }}>
                    Save
                </button>
            </div>

        </div>
    )
}