import { useEffect, useRef, useState } from 'react'

export function AttachmentActions({ attachment, setTask, handleCloseModal, task }) {
    const [isEditAttachment, setIsEditAttachment] = useState(false)
    const [fileToEdit, setFileToEdit] = useState({ ...attachment })

    // useEffect(() => {
    //     setFileToEdit({ ...attachment });
    // }, [attachment])

    function handleChangeFileName({ target }) {
        setFileToEdit(prevFile => ({ ...prevFile, fileName: target.value }))
    }

    function onUpdateFileName() {
        setTask(prevTask => {
            const updatedAttachments = prevTask.attachments.map(file =>
                (file.id === attachment.id ? fileToEdit : file)
            )
            return { ...prevTask, attachments: updatedAttachments }
        })
    }

    function onRemoveAttachment(attachmentId) {
        setTask(prevTask => ({ ...prevTask, attachments: prevTask.attachments.filter(item => item.id !== attachmentId) }))
    }

    return (
        <>
            <div className="modal-option task-attachments-modal">
                <ul className="option-modal-container attachment-actions-list">
                    <li className="attachment-action-item"
                        onClick={() => setIsEditAttachment(true)}>Edit</li>
                    <li className="attachment-action-item">Make cover</li>
                    <li className="attachment-action-item"
                        onClick={() => { onRemoveAttachment(attachment.id); handleCloseModal() }}>Delete</li>
                </ul>
            </div>

            {isEditAttachment &&
                <div className="modal-option edit-attachment-modal">
                    <div className="edit-labels-header option-modal-header">
                        <i className="btn fa-solid fa-chevron-left right-side" onClick={() => setIsEditAttachment(false)}></i>
                        <h2>Edit attachment</h2>
                        <i className="btn fa-solid fa-xmark left-side" onClick={() => { setIsEditAttachment(false) }}></i>
                    </div>

                    <div className="option-modal-container edit-file">
                        <div>
                            <h3>File name</h3>
                            <input
                                type="text"
                                value={fileToEdit.fileName || ''}
                                onChange={handleChangeFileName}
                            />
                        </div>
                        <button className="btn btn-dark" onClick={() => { onUpdateFileName(); handleCloseModal() }}>Update</button>
                    </div>

                </div>}

        </>
    )
}