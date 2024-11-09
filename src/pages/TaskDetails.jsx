import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { loadBoards } from '../store/actions/board.actions'
import { Labels } from '../cmps/Labels.jsx'
import { Dates } from '../cmps/Dates.jsx'
import { makeId } from '../services/util.service.js'
import { Checklist } from '../cmps/Checklist.jsx'
import { AddChecklist } from '../cmps/AddChecklist.jsx'

export function TaskDetails() {
    const boards = useSelector((storeState) => storeState.boardModule.boards)
    const [isEditLabels, setIsEditLabels] = useState(false)
    const [isEditDates, setIsEditDates] = useState(false)
    const [isAddChecklist, setIsAddChecklist] = useState(false)
    const [statusTask, setStatusTask] = useState('')

    const [task, setTask] = useState({})
    const labels = [
        { id: 'l101', color: '#4BCE97', title: '' },
        { id: 'l102', color: '#F5CD47', title: '' },
        { id: 'l103', color: '#FEA362', title: '' },
        { id: 'l104', color: '#F87168', title: '' },
        { id: 'l105', color: '#9F8FEF', title: '' },
        { id: 'l106', color: '#579DFF', title: '' },
    ]

    const titleAreaRef = useRef(null)

    useEffect(() => {
        loadBoards()
        console.log('hi2')
    }, [])

    useEffect(() => {
        if (boards?.[0]?.groups?.[1]?.tasks?.[1]) {
            setTask(boards[0].groups[1].tasks[1])
        }
    }, [boards])

    useEffect(() => {
        if (task.dueDate) {
            const currentDate = new Date()
            currentDate.setHours(0, 0, 0, 0)
            const taskDueDate = new Date(task.dueDate)
            taskDueDate.setHours(0, 0, 0, 0)

            if (taskDueDate < currentDate) {
                setStatusTask('Overdue')
            } else if (taskDueDate.getTime() === currentDate.getTime()) {
                setStatusTask('Due soon')
            } else {
                const timeDiff = taskDueDate - currentDate
                const oneDayInMs = 24 * 60 * 60 * 1000
                if (timeDiff <= oneDayInMs) {
                    setStatusTask('Due soon')
                } else {
                    setStatusTask('')
                }
            }
        }
    }, [task.dueDate])

    function handleInfoChange({ target }) {
        let { value, name: field, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        if (field === 'dueDate') {
            setTask((prevTask) => ({ ...prevTask, [field]: value, status: 'inProgress' }))
        } else {
            setTask((prevTask) => ({ ...prevTask, [field]: value }))
        }
    }

    function toggleTaskStatus() {
        setTask(prevTask => ({ ...prevTask, status: (prevTask.status === 'inProgress') ? 'done' : 'inProgress' }))
    }

    if (!boards.length) return <div>Loading...</div>

    return (
        <article className="task-details">
            <div className="cover">
                {task.imgUrl && <img src={task.imgUrl} />}
            </div>

            <div className="task-header">
                <img src="img/icons/icon-task-title.svg" />
                <textarea
                    ref={titleAreaRef}
                    className="textarea-input task-title"
                    type="text"
                    name="title"
                    id="task-title"
                    placeholder="Title"
                    value={task.title}
                    onChange={handleInfoChange} />
            </div>

            <section className="task-main">
                <div className="task-info">

                    <div className="task-metadata">
                        {task.labelIds && task.labelIds.length !== 0 &&
                            <div className="labels-area">
                                <h3>Labels</h3>
                                <ul className="label-list">
                                    {task.labelIds.map((labelId, i) => {
                                        const matchingLabel = labels.find(label => label.id === labelId)
                                        if (matchingLabel) {
                                            return <li className="label"
                                                key={labelId}
                                                style={{ backgroundColor: matchingLabel.color }}>
                                                {matchingLabel.txt || 'test'}
                                            </li>
                                        }
                                    })}
                                </ul>
                            </div>}

                        {task.dueDate &&
                            <div className="due-date-area">
                                <h3>Dou date</h3>
                                <div className="due-date-details">
                                    <input
                                        type="checkbox"
                                        checked={task.status === 'done'}
                                        onChange={() => toggleTaskStatus(task._id)}
                                    />
                                    <span>{task.dueDate}</span>
                                    <span
                                        className={`due-date-status ${task.status === 'done' ? 'complete' :
                                            (statusTask === 'Due soon') ? 'duesoon' : 'overdue'}`}>
                                        {(task.status === 'done') && 'complete' || statusTask}</span>
                                </div>
                            </div>}
                    </div>

                    <div className="description-area">
                        <img className="icon-description" src="img/icons/icon-description.svg" />
                        <h2 className="description-title">Description</h2>
                        <textarea
                            className="textarea-input task-description"
                            type="text"
                            name="description"
                            id="description-update"
                            placeholder="Add a more detailed description..."
                            value={task.description || ''}
                            onChange={handleInfoChange} />
                    </div>

                    {task.checklists?.length > 0 &&
                        <div className="list-of-checklists">
                            {task.checklists.map(checklist => (
                                <Checklist
                                    key={checklist.id}
                                    todos={checklist.todos}
                                    task={task}
                                    checklist={checklist}
                                    setTask={setTask} />
                            ))}
                        </div>}

                    {console.log(task)}

                </div>

                <div className="task-options">
                    <div>

                        <button
                            className={`btn btn-option btn-light ${isEditLabels && 'active'}`}
                            onClick={() => setIsEditLabels(prev => !prev)}> <img src="img/icons/icon-labels.svg" />Labels</button>
                        {isEditLabels &&
                            <Labels task={task} setTask={setTask} handleChange={handleInfoChange} setIsEditLabels={setIsEditLabels} />}
                    </div>

                    <div>
                        <button
                            className={`btn btn-option btn-light ${isEditDates && 'active'}`}
                            onClick={() => setIsEditDates(prev => !prev)}><img src="img/icons/icon-dates.svg" />Dates</button>
                        {isEditDates &&
                            <Dates task={task} setTask={setTask} handleChange={handleInfoChange} setIsEditDates={setIsEditDates} />}
                    </div>

                    <div>
                        <button
                            className={`btn btn-option btn-light ${isAddChecklist && 'active'}`}
                            onClick={() => setIsAddChecklist(prev => !prev)}><img src="img/icons/icon-checklist.svg" />Checklist</button>
                        {isAddChecklist &&
                            <AddChecklist setTask={setTask} setIsAddChecklist={setIsAddChecklist} />}
                    </div>
                </div>
            </section>

            {/* <h1>Task Details</h1>
            <p>{task.id}</p>
            <p>{task.title}</p> */}
        </article >
    )
}