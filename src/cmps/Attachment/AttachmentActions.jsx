
export function AttachmentActions({ attachment, setTask }) {

    function onRemoveAttachment(attachmentId) {
        setTask(prevTask => ({ ...prevTask, attachments: prevTask.attachments.filter(item => item.id !== attachmentId) }))
    }

    return (
        <div className="modal-option task-attachments">

            <ul className="option-modal-container attachment-actions-list">
                <li className="attachment-action-item">Edit</li>
                <li className="attachment-action-item">Make cover</li>
                <li className="attachment-action-item" onClick={() => onRemoveAttachment(attachment.id)}>Delete</li>
            </ul>

        </div>
    )
}