import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { loadBoard } from '../store/actions/board.actions'
import { boardService } from '../services/board'
import { Labels } from '../cmps/Labels.jsx'
import { Dates } from '../cmps/Dates.jsx'
import { makeId } from '../services/util.service.js'
import { Checklist } from '../cmps/Checklist.jsx'
import { AddChecklist } from '../cmps/AddChecklist.jsx'
import { Members } from '../cmps/Members.jsx'
import { MemberPreview } from '../cmps/MemberPreview'
import { taskService } from '../services/task/task.service.js'


export function TaskDetails() {
    // const boards = useSelector((storeState) => storeState.boardModule.boards)
    const board = useSelector((storeState) => storeState.boardModule.board)
    const gLabels = useSelector((storeState) => storeState.boardModule.labels)
    const gMembers = useSelector((storeState) => storeState.boardModule.members)

    const [boardToEdit, setBoardToEdit] = useState(null)
    const [isEditLabels, setIsEditLabels] = useState(false)
    const [isEditDates, setIsEditDates] = useState(false)
    const [isAddChecklist, setIsAddChecklist] = useState(false)
    const [isEditMembers, setIsEditMembers] = useState(false)
    const [isShowMemberPreview, setIsShowMemberPreview] = useState(false)
    const [statusTask, setStatusTask] = useState('')
    const [task, setTask] = useState({})

    // const labels = taskService.getLabels()
    const titleAreaRef = useRef(null)

    useEffect(() => {
        loadBoard('b101')
        console.log('boardToEdit', boardToEdit)
        console.log('hi2')
    }, [])

    useEffect(() => {
        setBoardToEdit(board)
        if (board?.groups?.[1]?.tasks?.[1]) {
            setTask(board?.groups[1].tasks[1])
        }
    }, [board])

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

    function onRemoveMember(memberId) {
        setTask(prevTask => ({ ...prevTask, memberIds: prevTask.memberIds.filter(mId => mId !== memberId) }))
    }

    // if (!boards.length) return <div>Loading...</div>
    if (!boardToEdit) return <div>Loading...</div>

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
                        {task.memberIds && task.memberIds.length !== 0 &&
                            <div className="members-area">
                                <h3>Members</h3>
                                <ul className="photo-member-list">
                                    {task.memberIds.map(memberId => {
                                        const memberDetails = gMembers.find(member => member._id === memberId)
                                        return (
                                            <li
                                                title={memberDetails.fullname}
                                                onClick={() => setIsShowMemberPreview(prev => !prev)}
                                                className="member"
                                                key={memberId}>
                                                <img className="member-area-photo" src={memberDetails.imgUrl} />

                                                {isShowMemberPreview &&
                                                    <MemberPreview
                                                        member={memberDetails}
                                                        setIsShowMemberPreview={setIsShowMemberPreview}
                                                        onRemoveMember={onRemoveMember} />
                                                }
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>}

                        {task.labelIds && task.labelIds.length !== 0 &&
                            <div className="labels-area">
                                <h3>Labels</h3>
                                <ul className="label-list">
                                    {task.labelIds.map(labelId => {
                                        const labelDetails = gLabels.find(label => label.id === labelId)
                                        return (
                                            <li className="label"
                                                key={labelId}
                                                style={{ backgroundColor: labelDetails.color }}>
                                                {labelDetails.title}
                                            </li>
                                        )
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
                    {console.log('boardtoedit', boardToEdit.labels)}
                    {console.log('gLabels', gLabels)}
                    {console.log('gMembers', gMembers)}

                </div>

                <div className="task-options">
                    <div>
                        <button
                            className={`btn btn-option btn-light ${isEditMembers && 'active'}`}
                            onClick={() => setIsEditMembers(prev => !prev)}><img src="img/icons/icon-members.svg" />Members</button>
                        {isEditMembers &&
                            <Members task={task} setTask={setTask} setIsEditMembers={setIsEditMembers}
                                boardMembers={boardToEdit.members} onRemoveMember={onRemoveMember} />}
                    </div>
                    <div>
                        <button
                            className={`btn btn-option btn-light ${isEditLabels && 'active'}`}
                            onClick={() => setIsEditLabels(prev => !prev)}> <img src="img/icons/icon-labels.svg" />Labels</button>
                        {isEditLabels &&
                            <Labels setTask={setTask} handleChange={handleInfoChange} setIsEditLabels={setIsEditLabels}
                                boardToEdit={boardToEdit} setBoardToEdit={setBoardToEdit} task={task} />}
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