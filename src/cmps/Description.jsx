import React, { useRef, useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export function Description({ task, setTask }) {
    const editorRef = useRef(null)
    const [editor, setEditor] = useState(null)
    const [openEditor, setOpenEditor] = useState(false)
    const [originalContent, setOriginalContent] = useState(task.description || '')

    //Recording state
    const [isRecording, setIsRecording] = useState(false)
    const [recognition, setRecognition] = useState(null)
    const [taskDescription, setTaskDescription] = useState('')

    useEffect(() => {
        setOriginalContent(task.description || '')
    }, [task.description])


    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition()
            recognitionInstance.lang = 'he-IL'
            recognitionInstance.onstart = () => console.log('Recording started...')
            recognitionInstance.onresult = (event) => {
                const transcript = event.results[0][0].transcript
                console.log('transcript', transcript)
                setTaskDescription((prev) => prev + transcript)
                setTask((prevTask) => ({ ...prevTask, description: prevTask.description + '\n' + transcript }))
                // Insert the recognized text into the editor
            }
            recognitionInstance.onerror = (event) => {
                console.error("Error occurred in recognition: ", event.error)
            }
            setRecognition(recognitionInstance) // Set the recognition instance
        } else {
            alert('Speech Recognition is not supported in this browser.')
        }

        return () => {
            if (recognition) recognition.stop() // Cleanup on unmount
        }
    }, [])

    function toggleRecording() {
        if (recognition) {
            if (isRecording) {
                recognition.stop()
                setIsRecording(false)
                console.log('Recording stopped...')
            } else {
                recognition.start()
                setIsRecording(true)
            }
        }
    }

    function saveContent() {
        if (editor) {
            const htmlContent = editor.root.innerHTML
            if (htmlContent === '<p><br></p>' || htmlContent === '') {
                setTask((prevTask) => {
                    const updatedTask = { ...prevTask }
                    delete updatedTask.description
                    return updatedTask
                })
            } else {
                setTask((prevTask) => ({ ...prevTask, description: htmlContent }))
            }
        }
    }

    function cancelEdit() {
        if (editor) {
            editor.root.innerHTML = originalContent
            if (originalContent === '<p><br></p>' || originalContent === '') {
                setTask((prevTask) => {
                    const updatedTask = { ...prevTask }
                    delete updatedTask.description
                    return updatedTask
                })
            }
        }
    }

    function loadContent() {
        if (editor && task.description) {
            editor.root.innerHTML = task.description || ''
        }
    }

    useEffect(() => {
        if (!editor) {
            const quill = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        // [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['clean'],
                    ]
                }
            })
            setEditor(quill)
        }
    }, [editor, task.description, setTask])

    return (
        <>
            <div className={`text-editor-area ${openEditor ? 'show' : 'hide'}`}>
                <div className={"reach-editor-container"}>
                    <div className={`${openEditor ? 'show' : 'hide'}`}>
                        <div ref={editorRef} style={{ height: '100px', marginTop: '10px' }} />
                    </div>
                </div>

                <div className="text-editor-buttons">
                    <button className="btn btn-dark" onClick={() => { saveContent(); setOpenEditor(false) }}>Save</button>
                    <button className="btn btn-clear" onClick={() => { cancelEdit(); setOpenEditor(false) }}>Cancel</button>
                    {/* <button onClick={loadContent}>Load Content</button> */}
                </div>
            </div>

            <div className={`output-container btn-light ${openEditor ? 'hide' : 'show'}`}
                dangerouslySetInnerHTML={{ __html: task.description ? task.description : '<p style="color: #444444; font-size:0.9rem">Add a more detailed description...</p>' }}
                onClick={() => { loadContent(); setOpenEditor(true) }}
                style={{ padding: task.description ? '0' : '5px 0 25px 10px', backgroundColor: task.description ? '#f5f4f4' : '#e7e9eb' }} />

            <div onClick={toggleRecording} className="btn btn-dark btn-primary">
                {isRecording ?
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" style={{ fill: '#ffffff' }}>
                        <path d="M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" style={{ fill: '#ffffff' }}>
                        <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z" />
                    </svg>
                }
            </div>
        </>
    )
}