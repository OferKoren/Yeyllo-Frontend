
import { useEffect, useState, useRef } from 'react'
import { makeId } from '../services/util.service.js'

export function Canvas({ task, handleCloseModal, setTask }) {

    const canvasRef = useRef(null)
    const containerCanvasRef = useRef(null)
    let context = null
    let gLastPos = { x: 0, y: 0 }
    let isDraw = false
    const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

    useEffect(() => {
        const canvas = canvasRef.current
        const canvasContainer = containerCanvasRef.current

        if (canvas) {
            context = canvas.getContext('2d')
            canvas.width = canvasContainer.offsetWidth
            canvas.height = canvasContainer.offsetHeight

            // if (note.info.drawingUrl) {
            //     const img = new Image()
            //     img.onload = function () {
            //         context.clearRect(0, 0, canvas.width, canvas.height)
            //         context.drawImage(img, 0, 0)
            //     }
            //     img.src = note.info.drawingUrl
            // } else {
            //     console.log('No saved drawing found.')
            // }
        }

        canvas.addEventListener('mousedown', onDown)
        canvas.addEventListener('mousemove', onMove)
        canvas.addEventListener('mouseup', onUp)

        canvas.addEventListener('touchstart', onDown, { passive: false })
        canvas.addEventListener('touchmove', onMove, { passive: false })
        canvas.addEventListener('touchend', onUp, { passive: false })

        return () => {
            canvas.removeEventListener('mousedown', onDown)
            canvas.removeEventListener('mousemove', onMove)
            canvas.removeEventListener('mouseup', onUp)

            canvas.removeEventListener('touchstart', onDown)
            canvas.removeEventListener('touchmove', onMove)
            canvas.removeEventListener('touchend', onUp)

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
            ev = ev.changedTouches[0]
            //* Calc the right pos according to the touch screen
            pos = {
                x: ev.clientX - ev.target.offsetLeft - ev.target.clientLeft,
                y: ev.clientY - ev.target.offsetTop - ev.target.clientTop,
            }
        }

        return pos
    }

    function onSaveDrawing() {
        const dataURL = canvasRef.current.toDataURL('image/png')
        const drawingId = makeId()
        const fileName = `Drawing_${drawingId}`
        setTask(prevTask => ({ ...prevTask, attachments: [...prevTask.attachments || [], { url: dataURL, bgColor: '#ffffff', fileName, id: drawingId, uploadedAt: Date.now() }] }))

        // setDrawingUrl(dataURL)
        handleCloseModal()

        console.log('Drawing saved!')
    }

    return (
        <div className="canvas-container" ref={containerCanvasRef}>
            <canvas ref={canvasRef}></canvas>
            <button className="btn btn-dark save-drawing-btn" onClick={(ev) => { ev.stopPropagation(); onSaveDrawing() }}>Save</button>
        </div>
    )
}