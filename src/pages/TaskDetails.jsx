import { Link, useParams, useOutletContext } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { loadBoard, updateBoard } from '../store/actions/board.actions'
import { Labels } from '../cmps/Labels.jsx'
import { Dates } from '../cmps/Dates.jsx'
import { Checklist } from '../cmps/Checklist.jsx'
import { AddChecklist } from '../cmps/AddChecklist.jsx'
import { Members } from '../cmps/Members.jsx'
import { MemberPreview } from '../cmps/MemberPreview'
import { Cover } from '../cmps/Cover.jsx'
import { DeleteTaskModal } from '../cmps/DeleteTaskModal.jsx'
import dayjs from 'dayjs'
import "react-datepicker/dist/react-datepicker.css"

export function TaskDetails() {
    const board = useSelector((storeState) => storeState.boardModule.board)
    const gLabels = useSelector((storeState) => storeState.boardModule.labels)
    const gMembers = useSelector((storeState) => storeState.boardModule.members)

    const [boardToEdit, setBoardToEdit] = useState(null)
    const [openModal, setOpenModal] = useState(null)
    const [isEditLabels, setIsEditLabels] = useState(false)
    const [statusTask, setStatusTask] = useState('')
    const [task, setTask] = useState({})

    const { onCloseModal } = useOutletContext()
    const currGroupRef = useRef(null)

    const { boardId } = useParams()
    const { groupId } = useParams()
    const { taskId } = useParams()

    useEffect(() => {
        loadBoard(boardId)
        console.log('boardToEdit', boardToEdit)
        console.log('hi2')
    }, [])

    useEffect(() => {
        setBoardToEdit(board)
        const foundGroup = board?.groups.find((group) => group.id === groupId)
        currGroupRef.current = foundGroup
        const currTask = foundGroup?.tasks.find((task) => task.id === taskId)
        if (currTask) {
            setTask(currTask)
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

    function handleOpenModal(modalName) {
        setOpenModal(modalName)
    }

    function handleCloseModal() {
        setOpenModal(null)
    }

    function handleToggleModal(modalName) {
        setOpenModal((prevModal) => (prevModal === modalName ? null : modalName))
    }


    function handleInfoChange({ target }) {
        let { value, name: field, type } = target

        switch (type) {
            case 'number':
            case 'range':
                value = +value
                break

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
        setTask((prevTask) => ({ ...prevTask, status: prevTask.status === 'inProgress' ? 'done' : 'inProgress' }))
    }

    function onRemoveMember(memberId) {
        setTask((prevTask) => ({ ...prevTask, memberIds: prevTask.memberIds.filter((mId) => mId !== memberId) }))
    }

    function renderMembersModal() {
        return (
            <Members
                task={task}
                setTask={setTask}
                handleCloseModal={handleCloseModal}
                boardMembers={boardToEdit.members}
                onRemoveMember={onRemoveMember}
            />
        )
    }

    function renderLabelsModal() {
        return (
            <Labels
                setTask={setTask}
                handleChange={handleInfoChange}
                boardToEdit={boardToEdit}
                setBoardToEdit={setBoardToEdit}
                handleCloseModal={handleCloseModal}
                setIsEditLabels={setIsEditLabels}
                task={task}
            />
        )
    }

    function renderDatesModal() {
        return (
            <Dates
                task={task}
                setTask={setTask}
                handleChange={handleInfoChange}
                handleCloseModal={handleCloseModal}
                openModal={openModal} />
        )
    }

    function formatDate(dateStr) {
        return dayjs(dateStr).format('MMM D')
    }

    function onRemoveTask() {
        const updatedTasks = currGroupRef.current.tasks.filter(groupTask => groupTask.id !== taskId)
        saveBoard(updatedTasks)
    }

    function onSaveTask() {
        console.log('currGroup', currGroupRef.current)
        const updatedTasks = currGroupRef.current.tasks.map(groupTask => groupTask.id === taskId ? task : groupTask)
        saveBoard(updatedTasks)
    }

    function saveBoard(tasksToSave) {
        const updatedGroup = { ...currGroupRef.current, tasks: tasksToSave }
        const updatedGroups = boardToEdit.groups.map(group => group.id === groupId ? updatedGroup : group)
        const boardToSave = { ...boardToEdit, groups: updatedGroups }
        console.log('boardToSave', boardToSave)
        updateBoard(boardToSave)

        onCloseModal()
    }

    if (!boardToEdit) return <div>Loading...</div>

    return (
        <article className="task-details">
            <div className="btn-save-task" onClick={onSaveTask}>
                <i className="btn fa-solid fa-xmark"></i>
            </div>

            {task.style?.backgroundColor && <div className="cover" style={{ backgroundColor: task.style.backgroundColor }}></div>}

            <div className="task-header">
                <img src="/img/icons/icon-task-title.svg" />
                <textarea
                    className="textarea-input task-title"
                    type="text"
                    name="title"
                    id="task-title"
                    placeholder="Title"
                    value={task.title}
                    onChange={handleInfoChange}
                />
            </div>

            <section className="task-main">
                <div className="task-info">
                    <div className="task-metadata">
                        {task.memberIds && task.memberIds.length !== 0 && (
                            <div className="members-area">
                                <h3>Members</h3>
                                <ul className="photo-member-list">
                                    {task.memberIds.map((memberId) => {
                                        const memberDetails = gMembers.find((member) => member._id === memberId)
                                        return (
                                            <li
                                                className="member"
                                                title={memberDetails.fullname}
                                                onClick={() => handleToggleModal(`member-preview-${memberDetails.fullname}`)}
                                                key={memberId}>

                                                <img className="member-area-photo" src={memberDetails.imgUrl} />

                                                {openModal === `member-preview-${memberDetails.fullname}` && (
                                                    <MemberPreview
                                                        member={memberDetails}
                                                        handleCloseModal={handleCloseModal}
                                                        onRemoveMember={onRemoveMember}
                                                    />
                                                )}
                                            </li>
                                        )
                                    })}
                                    {openModal === "members-plusBtn" && renderMembersModal()}

                                    <div className="add-task-action circle" onClick={() => handleToggleModal('members-plusBtn')}>
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                </ul>
                            </div>
                        )}

                        {task.labelIds && task.labelIds.length !== 0 && (
                            <div className="labels-area">
                                <h3>Labels</h3>
                                <ul className="label-list">
                                    {task.labelIds.map((labelId) => {
                                        const labelDetails = gLabels.find((label) => label.id === labelId)
                                        return (
                                            <li className="label" key={labelId} style={{ backgroundColor: labelDetails.color }}>
                                                {labelDetails.title}
                                            </li>
                                        )
                                    })}
                                    {openModal === "labels-plusBtn" && renderLabelsModal()}
                                    <div className="add-task-action square" onClick={() => handleToggleModal('labels-plusBtn')}>
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                </ul>
                            </div>
                        )}

                        {task.dueDate && (
                            <div className="due-date-area">
                                <h3>Dou date</h3>
                                <div className="due-date-details">
                                    <input type="checkbox" checked={task.status === 'done'} onChange={() => toggleTaskStatus(task._id)} />
                                    <div className="format-date-and-status">
                                        <span>{formatDate(task.dueDate)}</span>
                                        <span
                                            className={`due-date-status ${task.status === 'done' ? 'complete' : statusTask === 'Due soon' ? 'duesoon' : 'overdue'
                                                }`}>
                                            {(task.status === 'done' && 'complete') || statusTask}
                                        </span>
                                        {openModal === "dates-chevronBtn" && renderDatesModal()}

                                        <div className="add-task-action chevron" onClick={() => handleToggleModal('dates-chevronBtn')}>
                                            <i className="fa-solid fa-chevron-down"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="description-area">
                        <img className="icon-description" src="/img/icons/icon-description.svg" />
                        <h2 className="description-title">Description</h2>
                        <textarea
                            className="textarea-input task-description"
                            type="text"
                            name="description"
                            id="description-update"
                            placeholder="Add a more detailed description..."
                            value={task.description || ''}
                            onChange={handleInfoChange}
                        />
                    </div>

                    {task.checklists?.length > 0 && (
                        <div className="list-of-checklists">
                            {task.checklists.map((checklist) => (
                                <Checklist key={checklist.id} todos={checklist.todos} task={task} checklist={checklist} setTask={setTask} />
                            ))}
                        </div>
                    )}

                    {console.log(task)}
                    {console.log('boardtoedit', boardToEdit.labels)}
                    {console.log('gLabels', gLabels)}
                    {console.log('gMembers', gMembers)}
                </div>

                <div className="task-options">
                    <div>
                        <button className={`btn btn-option btn-light ${openModal === "members" && 'active'}`} onClick={() => handleToggleModal('members')}>
                            <img src="/img/icons/icon-members.svg" />
                            Members
                        </button>
                        {openModal === "members" && renderMembersModal()}
                    </div>

                    <div>
                        <button className={`btn btn-option btn-light ${openModal === "labels" && 'active'}`} onClick={() => handleToggleModal('labels')}>
                            <img src="/img/icons/icon-labels.svg" />
                            Labels
                        </button>
                        {openModal === "labels" && renderLabelsModal()}
                    </div>

                    <div>
                        <button
                            className={`btn btn-option btn-light ${openModal === "checklist" && 'active'}`}
                            onClick={() => handleToggleModal('checklist')}>
                            <img src="/img/icons/icon-checklist.svg" />
                            Checklist
                        </button>
                        {openModal === "checklist" && <AddChecklist setTask={setTask} handleCloseModal={handleCloseModal} />}
                    </div>

                    <div>
                        <button className={`btn btn-option btn-light btn-date-picker ${openModal === "dates" && 'active'}`}
                            onClick={() => handleToggleModal('dates')}>
                            <img src="/img/icons/icon-dates.svg" />
                            Dates
                        </button>
                        {openModal === "dates" && renderDatesModal()}
                    </div>

                    <div>
                        <button className={`btn btn-option btn-light ${openModal === "cover" && 'active'}`}
                            onClick={() => handleToggleModal('cover')}>
                            <img src="/img/icons/icon-cover.svg" />
                            Cover
                        </button>
                        {openModal === "cover" && <Cover setTask={setTask} handleCloseModal={handleCloseModal} />}
                    </div>

                    <hr />

                    <div>
                        <button className={`btn btn-option btn-light`}
                            onClick={() => handleToggleModal('archive')}>
                            <img src={`/img/icons/icon-${openModal === "archive" || openModal === "deleteTask" ? 'back-to-board' : 'archive'}.svg`} />
                            {openModal === "archive" || openModal === "deleteTask" ? 'Send to board' : 'Archive'}
                        </button>
                    </div>

                    <div className="archive-actions">
                        {(openModal === "archive" || openModal === "deleteTask") &&
                            <>
                                <div>
                                    <button className={`btn btn-option btn-delete`} onClick={() => handleOpenModal('deleteTask')}>
                                        <img src="/img/icons/icon-minus.svg" />
                                        Delete
                                    </button>
                                </div>
                            </>
                        }
                        {openModal === "deleteTask" && <DeleteTaskModal handleCloseModal={handleCloseModal} handleOpenModal={handleOpenModal} />}
                    </div>
                </div>
            </section>
        </article>
    )
}
