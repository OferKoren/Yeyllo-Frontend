import { useEffect, useRef, useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service.js'
import { boardService } from '../../services/board/index.js'
import { makeId } from '../../services/util.service.js'
import ColorThief from 'colorthief'


export function AddAttachment({ task, setTask, handleCloseModal, addActivity }) {

    function loadImageFromInput(ev) {
        const reader = new FileReader()

        reader.onload = async (event) => {
            const base64Img = event.target.result
            const fileName = ev.target.files[0].name

            try {
                showSuccessMsg('Uploading in progress...')
                const uploadedImgUrl = await boardService.uploadImg(base64Img)
                const img = new Image()
                img.crossOrigin = 'Anonymous'
                img.src = uploadedImgUrl
                img.onload = () => {
                    const colorThief = new ColorThief()
                    const dominantColor = colorThief.getColor(img)

                    const bgColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`

                    addImageToAttachments(uploadedImgUrl, bgColor, fileName)
                    showSuccessMsg('Image uploaded successfully!')
                }
            } catch (error) {
                console.error('Image upload failed:', error)
                showErrorMsg('Failed to upload image')
            }
        }

        reader.readAsDataURL(ev.target.files[0])
    }

    function addImageToAttachments(url, bgColor, fileName) {
        const updatedAttachments = [...(task.attachments || []), { url, bgColor, fileName, isCover: false, id: makeId(), uploadedAt: Date.now() }]
        setTask(prevTask => ({ ...prevTask, attachments: updatedAttachments }))
        addActivity(`attached ${fileName} to card "${task.title}"`)
    }

    return (
        <div className="modal-option task-attachments">
            <div className="task-attachments-header option-modal-header">
                <h2>Attach</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
            </div>

            <div className="option-modal-container">
                <p>Attach a file from your computer</p>
                <label htmlFor="file-upload" className="btn btn-clear custom-file-label">
                    <span>Choose a file</span></label>
                <input type="file" id="file-upload" className="file-input btn" name="file-upload"
                    onChange={(ev) => loadImageFromInput(ev)}></input>
            </div>
        </div>
    )
}