import { AttachmentIcon, DrawingIcon, CopyIcon, CoverIcon, DatesIcon, ChecklistIcon, LabelsIcon, MembersIcon, ArchiveIcon, BackToBoardIcon, DeleteIcon, CloseIcon } from '../services/svgIcons.service.jsx'
import { useParams, useOutletContext } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { updateBoard } from '../store/actions/board.actions'
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
import { Canvas } from '../cmps/Canvas.jsx'
import { ModalTaskDetails } from '../cmps/ModalTaskDetails.jsx'
import { PopupYey } from '../cmps/PopupYey.jsx'
import ClickOutside from '../cmps/ClickOutside.jsx'

export function TaskDetails() {
    const board = useSelector((storeState) => storeState.boardModule.board)
    const gLabels = useSelector((storeState) => storeState.boardModule.labels)
    const gMembers = useSelector((storeState) => storeState.boardModule.members)
    const user = useSelector((storeState) => storeState.userModule.user)

    const [boardToEdit, setBoardToEdit] = useState(null)
    const [openModal, setOpenModal] = useState(null)
    const [isEditLabels, setIsEditLabels] = useState(false)
    const [statusTask, setStatusTask] = useState('')
    const [task, setTask] = useState({})
    const [showPopup, setShowPopup] = useState(false)

    const { onCloseModal, setIsDone } = useOutletContext()
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

    function handleToggleModal(modalName) {
        setOpenModal((prevModal) => (prevModal === modalName ? null : modalName))
    }

    function handleCloseModal() {
        setOpenModal(null)
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
        setIsDone(isDone => !isDone)
        setTask((prevTask) => {
            const newStatus = prevTask.status === 'inProgress' ? 'done' : 'inProgress'

            if (newStatus === 'done') {
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false)
                }, 2000)
            }

            return { ...prevTask, status: newStatus }
        })
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
                boardToEdit={boardToEdit}
                groupId={currGroupRef.current.id}
                user={user}
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

        const activity = {
            txt: `deleted card #${taskId} from "${currGroupRef.current.title}"`,
            boardId: boardToEdit._id,
            groupId: currGroupRef.current.id,
            taskId: taskId,
            byMember: { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl },
            createdAt: Date.now(),
        }

        saveBoard(updatedTasks, activity)
    }

    function onSaveTask() {
        // console.log('currGroup', currGroupRef.current)
        const updatedTasks = currGroupRef.current.tasks.map((groupTask) => (groupTask.id === taskId ? task : groupTask))
        saveBoard(updatedTasks)
    }

    async function saveBoard(tasksToSave, activity) {
        const updatedGroup = { ...currGroupRef.current, tasks: tasksToSave }
        const updatedGroups = boardToEdit.groups.map((group) => (group.id === groupId ? updatedGroup : group))
        const boardToSave = { ...boardToEdit, groups: updatedGroups }

        console.log('activity', activity)

        try {
            await updateBoard(boardToSave, activity)
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
                    <CloseIcon />
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
                                        <CoverIcon fill={'#44546f'} active={openModal === 'cover-topBtn'} />
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
                                        <CoverIcon fill={'#44546f'} active={openModal === 'cover-topBtn'} />
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
                                                        onClick={(ev) => { handleToggleModal(`member-preview-${memberDetails.fullname}`); ev.stopPropagation() }}
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
                                        <input type="checkbox" checked={task.status === 'done'} onChange={() => toggleTaskStatus(task.id)} />
                                        <div className="format-date-and-status">
                                            <span>{formatDate(task.dueDate, task.dueTime, task.startDate || null)}</span>
                                            <span
                                                className={`due-date-status ${task.status === 'done' ? 'complete' : statusTask === 'Due soon' ? 'duesoon' : 'overdue'
                                                    }`}>
                                                {(task.status === 'done' && 'complete') || statusTask}
                                            </span>
                                            {openModal === 'dates-chevronBtn' && renderDatesModal()}
                                            {showPopup && <PopupYey />}

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
                                        boardToEdit={boardToEdit}
                                        groupId={currGroupRef.current.id}
                                        user={user}
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
                                <MembersIcon active={openModal === 'members'} />
                                <span>Members</span>
                            </button>
                            {openModal === 'members' && renderMembersModal()}
                        </div>

                        <div>
                            <button
                                className={`btn btn-option btn-light ${openModal === 'labels' && 'active'}`}
                                onClick={() => handleToggleModal('labels')}>
                                <LabelsIcon active={openModal === 'labels'} />
                                <span>Labels</span>
                            </button>
                            {openModal === 'labels' && renderLabelsModal()}
                        </div>

                        <div>
                            <button
                                className={`btn btn-option btn-light ${openModal === 'checklist' && 'active'}`}
                                onClick={() => handleToggleModal('checklist')}>
                                <ChecklistIcon active={openModal === 'checklist'} />
                                <span> Checklist</span>
                            </button>
                            {openModal === 'checklist' &&
                                <AddChecklist task={task} setTask={setTask} handleCloseModal={handleCloseModal}
                                    boardToEdit={boardToEdit} groupId={currGroupRef.current.id} user={user} />}
                        </div>

                        <div>
                            <button
                                className={`btn btn-option btn-light btn-date-picker ${openModal === 'dates' && 'active'}`}
                                onClick={() => handleToggleModal('dates')}>
                                <DatesIcon active={openModal === 'dates'} />
                                <span>Dates</span>
                            </button>
                            {openModal === 'dates' && renderDatesModal()}
                        </div>

                        <div>
                            <button
                                className={`btn btn-option btn-light ${openModal === 'cover' && 'active'}`}
                                onClick={() => handleToggleModal('cover')}>
                                <CoverIcon active={openModal === 'cover'} />
                                <span>Cover</span>
                            </button>
                            {openModal === 'cover' && renderCoverModal()}
                        </div>

                        <div>
                            <button
                                className={`btn btn-option btn-light ${openModal === 'attachment' && 'active'}`}
                                onClick={() => handleToggleModal('attachment')}>
                                <AttachmentIcon active={openModal === 'attachment'} />
                                <span>Attachment</span>
                            </button>
                            {openModal === 'attachment' && <AddAttachment handleCloseModal={handleCloseModal} task={task} setTask={setTask} />}
                        </div>

                        <div>
                            <button
                                className={`btn btn-option btn-light`}
                                onClick={() => handleToggleModal('drawing')}>
                                <DrawingIcon />
                                <span>Drawing</span>
                            </button>
                            {openModal === 'drawing' &&
                                <ModalTaskDetails onCloseModal={onCloseModal} isOpen={openModal === 'drawing'} isBlur={true}>
                                    <Canvas handleCloseModal={handleCloseModal} task={task} setTask={setTask} />
                                </ModalTaskDetails>}
                        </div>

                        <div className="task-actions-area">
                            <h3>Actions</h3>
                            <div>
                                <button className="btn btn-option btn-light" onClick={() => onCopyTask()}>
                                    <CopyIcon />
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
                                {openModal === 'archive' || openModal === 'deleteTask' ? <BackToBoardIcon /> : <ArchiveIcon />}
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
                                            <DeleteIcon />
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
