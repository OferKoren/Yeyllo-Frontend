import { useEffect, useRef, useState } from 'react'
import { boardService } from '../../services/board/index.js'
import { makeId } from '../../services/util.service.js'
import ColorThief from 'colorthief'


export function AddAttachment({ task, setTask, handleCloseModal }) {

    function loadImageFromInput(ev) {
        const reader = new FileReader()

        reader.onload = async (event) => {
            const base64Img = event.target.result

            try {
                const uploadedImgUrl = await boardService.uploadImg(base64Img)
                const img = new Image()
                img.crossOrigin = 'Anonymous'
                img.src = uploadedImgUrl
                img.onload = () => {
                    const colorThief = new ColorThief()
                    const dominantColor = colorThief.getColor(img)

                    const bgColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`

                    // Add the attachment along with its background color
                    addImageToAttachments(uploadedImgUrl, bgColor)
                    // End loading state
                }
            } catch (error) {
                console.error('Image upload failed:', error)
                throw error
            }
        }

        reader.readAsDataURL(ev.target.files[0])
    }

    function addImageToAttachments(url, bgColor) {
        const updatedAttachments = [...(task.attachments || []), { url, bgColor, id: makeId() }]
        setTask(prevTask => ({ ...prevTask, attachments: updatedAttachments }))
    }

    return (
        <div className="modal-option task-labels">
            <div className="task-labels-header option-modal-header">
                <h2>Attach</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
            </div>
            <p>Attach a file from your computer</p>

            <label htmlFor="file-upload" className="custom-file-label">
                <span>Choose a file</span></label>
            <input type="file" id="file-upload" class="file-input btn" name="file-upload"
                onChange={(ev) => loadImageFromInput(ev)}></input>
        </div>
    )
}