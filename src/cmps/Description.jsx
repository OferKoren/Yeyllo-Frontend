import React, { useRef, useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export function Description({ task, setTask }) {
    const editorRef = useRef(null)
    const [editor, setEditor] = useState(null)
    const [openEditor, setOpenEditor] = useState(false)
    const [originalContent, setOriginalContent] = useState(task.description || '')
    const micBtn = useRef()

    //Recording state
    const [isRecording, setIsRecording] = useState(false)
    const [recognition, setRecognition] = useState(null)

    useEffect(() => {
        setOriginalContent(task.description || '')
    }, [task.description])


    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition()
            recognitionInstance.lang = 'he-IL'
            recognitionInstance.onstart = () => console.log('Recording started...')
            recognitionInstance.onresult = (event) => {
                const transcript = event.results[0][0].transcript
                setTask((prevTask) => ({ ...prevTask, description: !prevTask.description ? transcript + '\n' : prevTask.description + '\n' + transcript }))
            }
            recognitionInstance.onerror = (event) => {
                console.error('Error occurred in recognition: ', event.error)
            }
            setRecognition(recognitionInstance) // Set the recognition instance
        } else {
            alert('Speech Recognition is not supported in this browser.')
        }

        return () => {
            if (recognition) recognition.stop()
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
            const htmlContent = editor.root.innerHTML.trim()
            const isEmptyContent = ['<p><br></p>', '', '<p>\n</p>', '<p></p>'].includes(htmlContent)

            if (isEmptyContent) {
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
            const normalizedContent = originalContent.trim()
            const isEmptyContent = ['<p><br></p>', '', '<p>\n</p>', '<p></p>'].includes(normalizedContent)

            if (isEmptyContent) {
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

    function onToggleMic() {
        micBtn.current.classList.toggle('active')
    }

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
                </div>
            </div>

            <div className={`output-container-and-recording-btn ${openEditor ? 'hide' : 'show'}`}>
                <div className={`output-container btn-light ${openEditor ? 'hide' : 'show'}`}
                    dangerouslySetInnerHTML={{ __html: task.description ? task.description : '<p style="color: #444444; font-size:0.9rem">Add a more detailed description...</p>' }}
                    onClick={() => { loadContent(); setOpenEditor(true) }}
                    style={{ padding: task.description ? '0' : '5px 0 25px 10px', backgroundColor: task.description ? '#f5f4f4' : '#e7e9eb' }} />

                <div style={{ position: 'absolute', top: '-45px', right: '-3px', display: 'flex', gap: '10px' }}>
                    <div className="mic-container mic" >
                        <div ref={micBtn} className="circle" onClick={() => { toggleRecording(); onToggleMic() }}>
                            <i className="fas fa-microphone"></i>
                        </div>
                    </div>

                    <div className="mic-container pencil" onClick={() => { loadContent(); setOpenEditor(true) }}>
                        <button className="btn btn-light btn-edit-description">Edit</button>
                    </div>
                </div>
            </div>
        </>
    )
}