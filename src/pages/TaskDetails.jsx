import { useParams, useOutletContext } from 'react-router-dom'
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
import 'react-datepicker/dist/react-datepicker.css'
import { Description } from '../cmps/Description.jsx'
import { makeId } from '../services/util.service.js'
import { AddAttachment } from '../cmps/Attachment/AddAttachment.jsx'
import { Attachment } from '../cmps/Attachment/Attachment.jsx'
import ClickOutside from '../cmps/ClickOutside.jsx'

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

    // const { boardId } = useParams()
    const { groupId } = useParams()
    const { taskId } = useParams()

    useEffect(() => {
        if (board) {
            setBoardToEdit(board)
            const foundGroup = board?.groups.find((group) => group.id === groupId)
            currGroupRef.current = foundGroup
            const currTask = foundGroup?.tasks.find((task) => task.id === taskId)
            if (currTask) {
                setTask(currTask)
            }
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
        return <Dates task={task} setTask={setTask} handleChange={handleInfoChange} handleCloseModal={handleCloseModal} openModal={openModal} />
    }

    function renderCoverModal() {
        return <Cover setTask={setTask} handleCloseModal={handleCloseModal} task={task} />
    }

    function formatDate(dueDate, dueTime, startDate) {
        const currentYear = dayjs().year()
        const formattedDueDate = dayjs(dueDate)

        if (!formattedDueDate.isValid()) {
            return "Invalid Date"
        }

        const formattedStartDate = startDate ? dayjs(startDate) : null

        let formattedDue = ''
        if (formattedDueDate.year() !== currentYear) {
            if (dueTime) {
                const formattedDueTime = dayjs(dueTime, 'hh:mm A').format('hh:mm A')
                const dateTimeStr = `${formattedDueDate.format('YYYY-MM-DD')} ${formattedDueTime}`
                formattedDue = dayjs(dateTimeStr).format('MMM D, YYYY, hh:mm A')
            } else {
                formattedDue = formattedDueDate.format('MMM D, YYYY')
            }
        } else {
            if (dueTime) {
                const formattedDueTime = dayjs(dueTime, 'hh:mm A').format('hh:mm A')
                const dateTimeStr = `${formattedDueDate.format('YYYY-MM-DD')} ${formattedDueTime}`
                formattedDue = dayjs(dateTimeStr).format('MMM D, hh:mm A')
            } else {
                formattedDue = formattedDueDate.format('MMM D')
            }
        }

        let formattedStart = ''
        if (formattedStartDate && formattedStartDate.isValid()) {
            if (formattedStartDate.year() !== currentYear) {
                formattedStart = formattedStartDate.format('MMM D, YYYY')
            } else {
                formattedStart = formattedStartDate.format('MMM D')
            }
        }
        return formattedStart ? `${formattedStart} - ${formattedDue}` : formattedDue;
    }

    function onToggleArchivedTask() {
        if (task.archivedAt) {
            setTask((prevTask) => {
                const updatedTask = { ...prevTask }
                delete updatedTask.archivedAt
                return updatedTask
            })
        } else {
            setTask((prevTask) => ({ ...prevTask, archivedAt: Date.now() }))
        }
    }

    function onCopyTask() {
        const updatedTasks = [...currGroupRef.current.tasks]
        currGroupRef.current.tasks.forEach((item, i) => {
            if (item.id === taskId) {
                updatedTasks.splice(i, 0, { ...task, id: makeId() })
            }
        })

        saveBoard(updatedTasks)
    }

    function onRemoveTask() {
        const updatedTasks = currGroupRef.current.tasks.filter((groupTask) => groupTask.id !== taskId)
        saveBoard(updatedTasks)
    }

    function onSaveTask() {
        // console.log('currGroup', currGroupRef.current)
        const updatedTasks = currGroupRef.current.tasks.map((groupTask) => (groupTask.id === taskId ? task : groupTask))
        saveBoard(updatedTasks)
    }

    async function saveBoard(tasksToSave) {
        const updatedGroup = { ...currGroupRef.current, tasks: tasksToSave }
        const updatedGroups = boardToEdit.groups.map((group) => (group.id === groupId ? updatedGroup : group))
        const boardToSave = { ...boardToEdit, groups: updatedGroups }

        try {
            await updateBoard(boardToSave)
        } catch (err) {
            console.error('can not save board', err)
        } finally {
            onCloseModal()
        }
    }

    if (!boardToEdit)
        return (
            <div className="trello-loader">
                <img src="\img\general\trello-loader.svg" alt="" />
            </div>
        )

    return (
        <>
            <div onClick={onSaveTask} className='task-details-backdrop' style={{ position: 'absolute', width: '100vw', height: '100vh', zIndex: '-1', backgroundColor: 'transparent' }}></div>
            <article className="task-details" style={{ zIndex: '1' }}>
                <div className="btn-save-task" onClick={onSaveTask}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12Z" fill="#44546f"
                        />
                    </svg>
                </div>

                {task.style && (
                    <>
                        {task.style.backgroundImage && (
                            <div
                                className="cover"
                                style={{
                                    backgroundImage: task.style.backgroundImage.url,
                                    backgroundColor: task.style.backgroundImage.bgColor || 'rgb(154, 139, 127)',
                                    height: '11em',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div className="cover-btn-top">
                                    <div className={`btn cover-options ${openModal === 'cover-topBtn' && 'active'}`} onClick={() => handleToggleModal(`cover-topBtn`)}>
                                        <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5 5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5ZM19 7H5V13H19V7Z"
                                                style={{ fill: openModal === 'cover-topBtn' ? '#ffffff' : '#44546f' }}
                                            />
                                        </svg>
                                        <span>Cover</span>
                                    </div>
                                    {openModal === 'cover-topBtn' && renderCoverModal()}
                                </div>
                            </div>
                        )}

                        {task.style?.backgroundColor && (
                            <div className="cover" style={{ backgroundColor: task.style.backgroundColor, height: '8em' }}>
                                <div className="cover-btn-top">
                                    <div className={`btn cover-options ${openModal === 'cover-topBtn' && 'active'}`} onClick={() => handleToggleModal(`cover-topBtn`)}>
                                        <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5 5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5ZM19 7H5V13H19V7Z"
                                                style={{ fill: openModal === 'cover-topBtn' ? '#ffffff' : '#44546f' }}
                                            />
                                        </svg>
                                        <span>Cover</span>
                                    </div>
                                    {openModal === 'cover-topBtn' && renderCoverModal()}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {task.archivedAt && (
                    <div
                        className="archive-banner"
                        style={{
                            borderTopLeftRadius: task.style?.backgroundColor ? 0 : '11px',
                            borderTopRightRadius: task.style?.backgroundColor ? 0 : '11px',
                        }}
                    >
                        <img src="/img/icons/icon-archive.svg" />
                        <p>This card is archived.</p>
                    </div>
                )}

                <div className="task-header">
                    <img src="/img/icons/icon-task-title.svg" />
                    <div className="task-header-left-side">
                        <textarea
                            className="textarea-input task-title"
                            type="text"
                            name="title"
                            id="task-title"
                            placeholder="Title"
                            value={task.title}
                            onChange={handleInfoChange}
                        />
                        <h3>in list {currGroupRef.current.title.toUpperCase()}</h3>
                    </div>
                </div>

                <section className="task-main">
                    <div className="task-info">
                        <div className="task-metadata">
                            {task.memberIds && task.memberIds.length !== 0 && (
                                <div className="members-area">
                                    <h3>Members</h3>
                                    <div>
                                        <ul className="photo-member-list">
                                            {task.memberIds.map((memberId) => {
                                                const memberDetails = gMembers.find((member) => member._id === memberId)
                                                return (
                                                    <li
                                                        className="member"
                                                        title={memberDetails.fullname}
                                                        onClick={() => handleToggleModal(`member-preview-${memberDetails.fullname}`)}
                                                        key={memberId}
                                                    >
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
                                            <div className="add-task-action circle" onClick={() => handleToggleModal('members-plusBtn')}>
                                                <i className="fa-solid fa-plus"></i>
                                            </div>
                                        </ul>
                                        {openModal === 'members-plusBtn' && renderMembersModal()}
                                    </div>
                                </div>
                            )}

                            {task.labelIds && task.labelIds.length !== 0 && (
                                <div className="labels-area">
                                    <h3>Labels</h3>
                                    <div>
                                        <ul className="label-list">
                                            {task.labelIds.map((labelId) => {
                                                const labelDetails = gLabels.find((label) => label.id === labelId)
                                                return (
                                                    <li className="label" key={labelId} onClick={() => { handleToggleModal('labels-plusBtn') }}
                                                        style={{ backgroundColor: labelDetails.color }}>
                                                        {labelDetails.title}
                                                    </li>
                                                )
                                            })}

                                            <div className="add-task-action square" onClick={() => handleToggleModal('labels-plusBtn')}>
                                                <i className="fa-solid fa-plus"></i>
                                            </div>
                                        </ul>
                                        {openModal === 'labels-plusBtn' && renderLabelsModal()}
                                    </div>
                                </div>

                            )}

                            {task.dueDate && (
                                <div className="due-date-area">
                                    <h3>Due date</h3>
                                    <div className="due-date-details">
                                        <input type="checkbox" checked={task.status === 'done'} onChange={() => toggleTaskStatus(task._id)} />
                                        <div className="format-date-and-status">
                                            <span>{formatDate(task.dueDate, task.dueTime, task.startDate || null)}</span>
                                            <span
                                                className={`due-date-status ${task.status === 'done' ? 'complete' : statusTask === 'Due soon' ? 'duesoon' : 'overdue'
                                                    }`}>
                                                {(task.status === 'done' && 'complete') || statusTask}
                                            </span>
                                            {openModal === 'dates-chevronBtn' && renderDatesModal()}

                                            <div className="add-task-action chevron" onClick={() => handleToggleModal('dates-chevronBtn')}>
                                                <i className="fa-solid fa-chevron-down"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="description-area area-layout">
                            <img className="icon-description icon-area" src="/img/icons/icon-description.svg" />
                            <h2 className="description-title title-area">Description</h2>
                            <Description task={task} setTask={setTask} />
                        </div>

                        {task.attachments?.length > 0 && (
                            <div className="attachments-area area-layout">
                                <img className="icon-area" src="/img/board-details/attachment-icon.svg" />
                                <h2 className="attachment-title title-area">
                                    <span> Attachments</span>
                                    <div className="add-attachment">
                                        <button className="btn btn-light btn-add-attachment" onClick={() => handleToggleModal('attachment-addBtn')}>
                                            <span>Add</span>
                                        </button>
                                        {openModal === 'attachment-addBtn' && (
                                            <AddAttachment handleCloseModal={handleCloseModal} task={task} setTask={setTask} />
                                        )}
                                    </div>
                                </h2>
                                <div className="list-of-attachments container-area">
                                    <h3>Files</h3>
                                    {task.attachments.map((attachment) => (
                                        <Attachment
                                            key={attachment.id}
                                            attachment={attachment}
                                            setTask={setTask}
                                            task={task}
                                            handleToggleModal={handleToggleModal}
                                            handleCloseModal={handleCloseModal}
                                            handleOpenModal={handleOpenModal}
                                            openModal={openModal}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {task.checklists?.length > 0 && (
                            <div className="list-of-checklists">
                                {task.checklists.map((checklist) => (
                                    <Checklist
                                        key={checklist.id}
                                        todos={checklist.todos}
                                        task={task}
                                        checklist={checklist}
                                        setTask={setTask}
                                        handleToggleModal={handleToggleModal}
                                        openModal={openModal}
                                        handleCloseModal={handleCloseModal}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="task-options">
                        <div>
                            <button
                                className={`btn btn-option btn-light ${openModal === 'members' && 'active'}`}
                                onClick={() => handleToggleModal('members')}>
                                <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.0254 3C9.25613 3 7.01123 5.23858 7.01123 8C7.01123 10.7614 9.25613 13 12.0254 13C14.7946 13 17.0395 10.7614 17.0395 8C17.0395 5.23858 14.7946 3 12.0254 3ZM9.01688 8C9.01688 9.65685 10.3638 11 12.0254 11C13.6869 11 15.0338 9.65685 15.0338 8C15.0338 6.34315 13.6869 5 12.0254 5C10.3638 5 9.01688 6.34315 9.01688 8Z"
                                        style={{ fill: openModal === 'members' ? '#ffffff' : '#333333' }} />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.0254 11C16.7803 11 20.6765 14.6667 21.0254 19.3194C20.8721 20.2721 20.0439 21 19.0452 21H18.9741C18.9741 21 18.9741 21 18.9741 21L5.0767 21C5.07671 21 5.0767 21 5.0767 21L5.00562 21C4.00691 21 3.1787 20.2721 3.02539 19.3193C3.37428 14.6667 7.27038 11 12.0254 11ZM5.0767 19H18.9741C18.4875 15.6077 15.5618 13 12.0254 13C8.48892 13 5.56331 15.6077 5.0767 19ZM19.0451 19.9769V20.0231C19.0452 20.0154 19.0452 20.0077 19.0452 20C19.0452 19.9923 19.0452 19.9846 19.0451 19.9769Z"
                                        style={{ fill: openModal === 'members' ? '#ffffff' : '#333333' }} />
                                </svg>
                                <span>Members</span>
                            </button>
                            {openModal === 'members' && renderMembersModal()}
                        </div>

                        <div>
                            <button
                                className={`btn btn-option btn-light ${openModal === 'labels' && 'active'}`}
                                onClick={() => handleToggleModal('labels')}>
                                <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.1213 2.80762C12.3403 2.02657 11.0739 2.02657 10.2929 2.80762L3.92891 9.17158C1.19524 11.9052 1.19524 16.3374 3.92891 19.0711C6.66258 21.8047 11.0947 21.8047 13.8284 19.0711L20.1924 12.7071C20.9734 11.9261 20.9734 10.6597 20.1924 9.87869L13.1213 2.80762ZM18.7782 11.2929L11.7071 4.22183L5.34313 10.5858C3.39051 12.5384 3.39051 15.7042 5.34313 17.6569C7.29575 19.6095 10.4616 19.6095 12.4142 17.6569L18.7782 11.2929ZM10 14C10 14.5523 9.55228 15 9 15C8.44772 15 8 14.5523 8 14C8 13.4477 8.44772 13 9 13C9.55228 13 10 13.4477 10 14ZM12 14C12 15.6569 10.6569 17 9 17C7.34315 17 6 15.6569 6 14C6 12.3431 7.34315 11 9 11C10.6569 11 12 12.3431 12 14Z" style={{ fill: openModal === 'labels' ? '#ffffff' : '#333333' }}
                                    />
                                </svg>
                                <span>Labels</span>
                            </button>
                            {openModal === 'labels' && renderLabelsModal()}
                        </div>

                        <div>
                            <button
                                className={`btn btn-option btn-light ${openModal === 'checklist' && 'active'}`}
                                onClick={() => handleToggleModal('checklist')}>
                                <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13C20 12.4477 19.5523 12 19 12C18.4477 12 18 12.4477 18 13V18H6V6L16 6C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4H6ZM8.73534 10.3223C8.36105 9.91618 7.72841 9.89038 7.3223 10.2647C6.91619 10.639 6.89039 11.2716 7.26467 11.6777L10.8768 15.597C11.4143 16.1231 12.2145 16.1231 12.7111 15.6264L13.0754 15.2683C13.3699 14.9785 13.6981 14.6556 14.0516 14.3075C15.0614 13.313 16.0713 12.3169 17.014 11.3848L17.0543 11.3449C18.7291 9.68869 20.0004 8.42365 20.712 7.70223C21.0998 7.30904 21.0954 6.67589 20.7022 6.28805C20.309 5.90022 19.6759 5.90457 19.2881 6.29777C18.5843 7.01131 17.3169 8.27244 15.648 9.92281L15.6077 9.96263C14.6662 10.8937 13.6572 11.8889 12.6483 12.8825L11.8329 13.6851L8.73534 10.3223Z" style={{ fill: openModal === 'checklist' ? '#ffffff' : '#333333' }}
                                    />
                                </svg>
                                <span> Checklist</span>
                            </button>
                            {openModal === 'checklist' && <AddChecklist setTask={setTask} handleCloseModal={handleCloseModal} />}
                        </div>

                        <div>
                            <button
                                className={`btn btn-option btn-light btn-date-picker ${openModal === 'dates' && 'active'}`}
                                onClick={() => handleToggleModal('dates')}>
                                <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V6Z"
                                        style={{ fill: openModal === 'dates' ? '#ffffff' : '#333333' }}
                                    />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" style={{ fill: openModal === 'dates' ? '#ffffff' : '#333333' }}
                                    />
                                </svg>
                                <span>Dates</span>
                            </button>
                            {openModal === 'dates' && renderDatesModal()}
                        </div>

                        <div>
                            <button
                                className={`btn btn-option btn-light ${openModal === 'cover' && 'active'}`}
                                onClick={() => handleToggleModal('cover')}>
                                <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5 5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5ZM19 7H5V13H19V7Z" style={{ fill: openModal === 'cover' ? '#ffffff' : '#333333' }}
                                    />
                                </svg>
                                <span>Cover</span>
                            </button>
                            {openModal === 'cover' && renderCoverModal()}
                        </div>

                        <div>
                            <button
                                className={`btn btn-option btn-light ${openModal === 'attachment' && 'active'}`}
                                onClick={() => handleToggleModal('attachment')}>
                                <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.6426 17.9647C10.1123 19.46 7.62736 19.4606 6.10092 17.9691C4.57505 16.478 4.57769 14.0467 6.10253 12.5566L13.2505 5.57184C14.1476 4.6952 15.5861 4.69251 16.4832 5.56921C17.3763 6.44184 17.3778 7.85135 16.4869 8.72199L9.78361 15.2722C9.53288 15.5172 9.12807 15.5163 8.86954 15.2636C8.61073 15.0107 8.60963 14.6158 8.86954 14.3618L15.0989 8.27463C15.4812 7.90109 15.4812 7.29546 15.0989 6.92192C14.7167 6.54838 14.0969 6.54838 13.7146 6.92192L7.48523 13.0091C6.45911 14.0118 6.46356 15.618 7.48523 16.6163C8.50674 17.6145 10.1511 17.6186 11.1679 16.6249L17.8712 10.0747C19.5274 8.45632 19.5244 5.83555 17.8676 4.2165C16.2047 2.59156 13.5266 2.59657 11.8662 4.21913L4.71822 11.2039C2.42951 13.4404 2.42555 17.083 4.71661 19.3218C7.00774 21.5606 10.7323 21.5597 13.0269 19.3174L19.7133 12.7837C20.0956 12.4101 20.0956 11.8045 19.7133 11.431C19.331 11.0574 18.7113 11.0574 18.329 11.431L11.6426 17.9647Z" style={{ fill: openModal === 'attachment' ? '#ffffff' : '#333333' }}
                                    />
                                </svg>
                                <span>Attachment</span>
                            </button>
                            {openModal === 'attachment' && <AddAttachment handleCloseModal={handleCloseModal} task={task} setTask={setTask} />}
                        </div>

                        <div className="task-actions-area">
                            <h3>Actions</h3>
                            <div>
                                <button className="btn btn-option btn-light" onClick={() => onCopyTask()}>
                                    <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5 16V4.99188C5 3.8918 5.90195 3 7.00853 3H14.9915L15 3.00002V5H7V16H5ZM8 19C8 20.1046 8.89543 21 10 21H18C19.1046 21 20 20.1046 20 19V8C20 6.89543 19.1046 6 18 6H10C8.89543 6 8 6.89543 8 8V19ZM10 8V19H18V8H10Z" fill="currentColor"
                                        />
                                    </svg>
                                    <span>Copy</span>
                                </button>
                            </div>
                        </div>

                        <hr />

                        <div>
                            <button
                                className={`btn btn-option btn-light`}
                                onClick={() => {
                                    handleToggleModal('archive')
                                    onToggleArchivedTask()
                                }}>
                                {openModal === 'archive' || openModal === 'deleteTask' ? (
                                    <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                            d="M6.41147 14.6064C5.93123 14.8792 5.76301 15.4896 6.03574 15.9698C7.43928 18.4413 10.0483 20 12.9283 20C16.0259 20 18.799 18.1958 20.1021 15.4268C20.2136 15.1851 20.3641 14.7943 20.512 14.2831C20.9098 12.9079 21.0444 11.481 20.7475 10.1098C20.5471 9.18477 20.1545 8.33681 19.5479 7.59632C17.6868 5.32366 15.487 4 12.9283 4C10.0142 4 7.38651 5.59842 6 8.094V7.0003C6 6.44802 5.55228 6.0003 5 6.0003C4.44772 6.0003 4 6.44802 4 7.0003V10.9003C4 11.5047 4.48877 12.0003 5.099 12.0003H8.954C9.50628 12.0003 9.954 11.5526 9.954 11.0003C9.954 10.448 9.50628 10.0003 8.954 10.0003H7.32865C7.39632 9.80693 7.47457 9.61558 7.56276 9.42743C8.53951 7.35107 10.6143 6 12.9283 6C14.8015 6 16.4854 7.01323 18.0006 8.86357C18.3991 9.34999 18.6573 9.90771 18.7928 10.5332C19.0091 11.5322 18.9043 12.6434 18.5907 13.7274C18.473 14.1343 18.358 14.4332 18.2893 14.5821C17.3156 16.6511 15.2422 18 12.9283 18C10.7768 18 8.82724 16.8353 7.77486 14.9822C7.50213 14.5019 6.89172 14.3337 6.41147 14.6064Z"
                                            fill="currentColor" />
                                    </svg>
                                ) : (
                                    <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3.03418 5.59621C2.98604 5.04603 3.39303 4.56099 3.94322 4.51286L19.8823 3.11837C20.4325 3.07023 20.9175 3.47722 20.9657 4.02741L21.0528 5.0236L3.12133 6.5924L3.03418 5.59621Z"
                                            fill="currentColor" />
                                        <path
                                            d="M9 12.9999C9 12.4476 9.44772 11.9999 10 11.9999H14C14.5523 11.9999 15 12.4476 15 12.9999C15 13.5522 14.5523 13.9999 14 13.9999H10C9.44772 13.9999 9 13.5522 9 12.9999Z"
                                            fill="currentColor" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3 18.9999V7.99993H21V18.9999C21 20.1045 20.1046 20.9999 19 20.9999H5C3.89543 20.9999 3 20.1045 3 18.9999ZM5 9.99993H19V18.9999H5L5 9.99993Z" fill="currentColor"
                                        />
                                    </svg>
                                )}
                                <span> {openModal === 'archive' || openModal === 'deleteTask' ? 'Send to board' : 'Archive'}</span>
                            </button>
                        </div>

                        <div className="archive-actions">
                            {(openModal === 'archive' || openModal === 'deleteTask') && (
                                <>
                                    <div>
                                        <button
                                            className={`btn btn-option btn-delete`}
                                            onClick={() => {
                                                handleOpenModal('deleteTask')
                                            }}>
                                            <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="3" y="11" width="18" height="2" rx="1" style={{ fill: '#ffffff' }} />
                                            </svg>
                                            <span> Delete</span>
                                        </button>
                                    </div>
                                </>
                            )}
                            {openModal === 'deleteTask' && (
                                <DeleteTaskModal handleCloseModal={handleCloseModal} handleOpenModal={handleOpenModal} onRemoveTask={onRemoveTask} />
                            )}
                        </div>
                    </div>
                </section>
            </article>
        </>
    )
}
