import { useEffect, useRef, useState } from 'react'
import { TextareaAutosize } from '@mui/base/TextareaAutosize'

export function TaskHeader({ task, handleInfoChange, currGroupRef }) {
    const [lastTitle, setLastTitle] = useState(task.title)

    const handleBlur = (ev) => {
        if (ev.target.value.trim() === '') { //enable 0
            ev.target.value = lastTitle
            handleInfoChange(ev)
        }
    }

    return (
        <div className="task-header">
            <img src="/img/icons/icon-task-title.svg" alt="Task Icon" />
            <div className="task-header-left-side">
                <TextareaAutosize
                    placeholder="Title"
                    value={task.title}
                    className="textarea-input task-title"
                    name="title"
                    id="task-title"
                    onChange={handleInfoChange}
                    onBlur={handleBlur}
                />
                <h3>in list {currGroupRef.current.title.toUpperCase()}</h3>
            </div>
        </div>
    )
}