import React, { useRef, useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export function Description({ task, setTask }) {
    const editorRef = useRef(null)
    const [editor, setEditor] = useState(null)
    const [openEditor, setOpenEditor] = useState(false)
    const [originalContent, setOriginalContent] = useState(task.description || '')

    useEffect(() => {
        setOriginalContent(task.description || '')
    }, [task.description])

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
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['clean'],
                    ]
                }
            })
            setEditor(quill)

            // Load initial content
            // quill.root.innerHTML = task.description || ''
            // setOriginalContent(task.description || '')
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
                style={{ padding: '10px' }} />
        </>
    )
}