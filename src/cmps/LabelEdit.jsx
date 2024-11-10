import { useState, useEffect, useRef } from 'react'

export function LabelEdit({ setIsEditLabels, labelToEdit, setLabelToEdit, setBoardToEdit, setIsEditLabel }) {

    const colorPalette = [
        '#BAF3DB', '#F8E6A0', '#FEDEC8', '#FFD5D2',
        '#DFD8FD', '#4BCE97', '#F5CD47', '#FEA362',
        '#F87168', '#9F8FEF', '#CCE0FF', '#C6EDFB',
        '#D3F1A7', '#FDD0EC', '#DCDFE4', '#579DFF',
        '#6CC3E0', '#94C748', '#E774BB', '#8590A2']

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
                <i className="btn fa-solid fa-chevron-left right-side" onClick={() => setIsEditLabel(false)}></i>
                <h2>Edit label</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={() => { setIsEditLabels(false); setIsEditLabel(false) }}></i>
            </div>

            <div className="label-preview">
                <p className="label-preview-details" style={{ background: labelToEdit.color }}>{labelToEdit.title || ''}</p>
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
                <div>
                    <h3>Select a color</h3>

                    <div className="color-palette">
                        {colorPalette.map(color =>
                            <div className={color === labelToEdit.color ? 'outlined' : ''} key={color} style={{ backgroundColor: color }}
                                onClick={() => setLabelToEdit(prevLabel => ({ ...prevLabel, color: color }))}></div>
                        )}
                    </div>
                </div>
                <button className="btn btn-remove-label-color btn-clear" onClick={() => setLabelToEdit(prevLabel => ({ ...prevLabel, color: '#E7E9EB' }))}>
                    <i className="btn fa-solid fa-xmark"></i>Remove color
                </button>
                <button className="btn btn-dark btn-add-checklist" onClick={() => { saveUpdatedLabel(); setIsEditLabel(false) }}>
                    Save
                </button>
            </div>

        </div>
    )
}