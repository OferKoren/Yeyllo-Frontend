import { useState, useEffect, useRef } from 'react'

export function LabelEdit({ setIsEditLabels }) {


    return (
        <div className="modal-option">
            <div className="edit-labels-header option-modal-header">
                <h2>Edit label</h2>
                <i className="btn fa-solid fa-xmark" onClick={() => { setIsEditLabels(false); setIsEditLabels(false) }}></i>
            </div>

            <div className="label-preview">
                <span className="label-preview-details"></span>
            </div>

        </div>
    )
}