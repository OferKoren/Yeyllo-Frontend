
import { useEffect, useState, useRef } from 'react'
import { makeId } from '../services/util.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { boardService } from '../services/board'

export function Canvas({ handleCloseModal, setTask }) {

    const canvasRef = useRef(null)
    const containerCanvasRef = useRef(null)
    let context = null
    let gLastPos = { x: 0, y: 0 }
    let isDraw = false
    const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

    useEffect(() => {
        const canvas = canvasRef.current
        const canvasContainer = containerCanvasRef.current

        function resizeCanvas() {
            if (canvas && canvasContainer) {
                canvas.width = canvasContainer.offsetWidth
                canvas.height = canvasContainer.offsetHeight
            }
        }

        if (canvas) {
            context = canvas.getContext('2d')
            canvas.width = canvasContainer.offsetWidth
            canvas.height = canvasContainer.offsetHeight
        }

        canvas.addEventListener('mousedown', onDown)
        canvas.addEventListener('mousemove', onMove)
        canvas.addEventListener('mouseup', onUp)

        canvas.addEventListener('touchstart', onDown, { passive: false })
        canvas.addEventListener('touchmove', onMove, { passive: false })
        canvas.addEventListener('touchend', onUp, { passive: false })

        window.addEventListener('resize', resizeCanvas)

        return () => {
            canvas.removeEventListener('mousedown', onDown)
            canvas.removeEventListener('mousemove', onMove)
            canvas.removeEventListener('mouseup', onUp)

            canvas.removeEventListener('touchstart', onDown)
            canvas.removeEventListener('touchmove', onMove)
            canvas.removeEventListener('touchend', onUp)

            window.removeEventListener('resize', resizeCanvas)
            document.body.style.cursor = 'default'
        }
    }, [])

    function drawLine(x, y, xEnd = 300, yEnd = 300) {
        if (!context) return
        context.beginPath()

        context.moveTo(x, y)
        context.lineTo(xEnd, yEnd)
        context.lineWidth = 3
        context.stroke()
    }

    function onDown(ev) {
        const pos = getEvPos(ev)
        gLastPos = pos

        isDraw = true

        document.body.style.cursor = 'grabbing'
    }

    function onMove(ev) {
        if (ev.type === 'mousemove' && ev.buttons !== 1) return
        if (!isDraw) return
        const pos = getEvPos(ev)

        drawLine(gLastPos.x, gLastPos.y, pos.x, pos.y)

        gLastPos = pos
    }

    function onUp() {
        isDraw = false
        document.body.style.cursor = 'grab'
    }

    function getEvPos(ev) {
        let pos = {
            x: ev.offsetX,
            y: ev.offsetY
        }

        if (TOUCH_EVS.includes(ev.type)) {
            //* Prevent triggering the mouse screen dragging event
            ev.preventDefault()
            //* Gets the first touch point
            const touch = ev.changedTouches[0]

            //* Calc the right pos according to the touch screen
            const rect = ev.target.getBoundingClientRect()
            pos = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            }
        }

        return pos
    }

    async function onSaveDrawing() {
        const dataURL = canvasRef.current.toDataURL('image/png')
        try {
            handleCloseModal()
            showSuccessMsg('Uploading in progress...')
            const uploadedImgUrl = await boardService.uploadImg(dataURL)

            const img = new Image()
            img.src = uploadedImgUrl

            img.onload = () => {
                const drawingId = makeId()
                const fileName = `Drawing_${drawingId}`
                setTask(prevTask => ({ ...prevTask, attachments: [...prevTask.attachments || [], { url: uploadedImgUrl, bgColor: '#ffffff', fileName, id: drawingId, uploadedAt: Date.now() }] }))
                showSuccessMsg('Image uploaded successfully!')
            }
        } catch (error) {
            console.error('Image upload failed:', error)
            showErrorMsg('Failed to upload image')
        }
    }

    return (
        <div className="canvas-area">
            <div className="canvas-container" ref={containerCanvasRef}>
                <canvas ref={canvasRef}></canvas>
                <div className="btn-save-task" onClick={(ev) => { ev.stopPropagation(); handleCloseModal() }}>
                    <svg className="btn-cancel-canvas" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12Z" fill="#44546f"
                        />
                    </svg>
                </div>
            </div>
            <div className="btn btn-dark save-drawing-btn" onClick={(ev) => { ev.stopPropagation(); onSaveDrawing() }}>Save</div>
        </div>
    )
}