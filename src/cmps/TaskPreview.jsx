import { Link, Outlet } from 'react-router-dom'
import { TaskDetails } from '../pages/TaskDetails'
import { useEffect, useState } from 'react'
import { ModalTaskDetails } from '../cmps/ModalTaskDetails.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { updateBoard } from '../store/actions/board.actions.js'

export function TaskPreview({ isModalOpen, setIsModalOpen, onUpdateBoard, board, isLabelsClicked, setIsLabelsClicked, groupId, task }) {
    const [isOpenTaskDetails, setIsOpenTaskDetails] = useState(false)
    const [isDone, setIsDone] = useState(task.status === 'done')

    function getCountIcons() {
        let count = 0

        if (task.dueDate) count += 2
        if (task.description) count++
        if (task.comments) count++
        if (task.checklists) count++
        if (task.memberIds) count += task.memberIds.length
        if (task.attachments) count++
        return count

    }


    const navigate = useNavigate()

    const { boardId } = useParams()
    const labels = useSelector(storeState => storeState.boardModule.labels)

    function onCloseModal() {
        setIsModalOpen(false)
        navigate(`/board/${boardId}`)
    }
    function onOpenModal() {
        setIsModalOpen(true)
        navigate(`/board/${boardId}/${groupId}/task/${task.id}`)
    }

    function formatDate(date) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currMonth = months[date.getMonth()]
        const currDate = date.getDate()

        const today = new Date
        // Today
        if (today.getDate() === currDate) return `${currMonth} ${currDate}`
        // This year
        else if (today.getYear() === date.getYear()) return `${currMonth} ${currDate}`
        // Above / Below year
        else if (today.getYear() !== date.getYear()) return `${currMonth} ${currDate}, ${date.getYear() - 100}`
        // else if (today.getYear() !== date.getYear()) return `${date.getMonth() + 1}/${date.getDate()}/${date.getYear() - 100}`
        // No year
        else if (!date.getYear()) return ''
    }

    function getDateColor(date) {
        const today = new Date
        const currDate = date.getDate()

        if (isDone) return { backgroundColor: '#1f845a', color: 'white', title: 'This card is complete.' }
        if ((today.getDate() === date.getDate() || today.getDate() - 1 === date.getDate() && today.getMonth() === date.getMonth())) return { backgroundColor: '#c9372c', color: 'white', title: 'This card is recently overdue!' }
        // if ((today === date && (today.getDate() === currDate && date.xmas95.getHours() <= today.xmas95.getHours()) || today.getDate() - 1 === currDate)) return { backgroundColor: '#c9372c', color: 'white' }
        if (date >= today && date <= today.setTime(today.getTime() + 24 * 60 * 60 * 1000)) return { backgroundColor: '#f5cd47', color: '#172b4d', title: 'This card is due in less than twenty-four hours.' }
        if (date < today) return { backgroundColor: '#ffd5d2', color: '#ae2e24', title: 'This card is past due.' }

        return { title: 'This card is due later.', backgroundColor: '#FFFFFF' }

    }

    function getTodosCount(task) {
        const todosCount = task.checklists.reduce((acc, checklist) => acc + checklist.todos.length, 0)
        return todosCount
    }

    function getDoneTodosCount(task) {
        const doneTodosCount = task.checklists.reduce((acc, checklist) => acc + checklist.todos.filter(todo => todo.isDone).length, 0)
        return doneTodosCount
    }

    async function onDateClick(e) {
        e.stopPropagation()

        const currGroupIdx = board.groups.findIndex(group => group.id === groupId)
        const currGroup = board.groups.find(group => group.id === groupId)
        const currTaskIdx = currGroup.tasks.findIndex(thisTask => thisTask.id === task.id)
        
        setIsDone(isDone => !isDone)

        try {
            isDone ? board.groups[currGroupIdx].tasks[currTaskIdx].status = 'inProgress' : board.groups[currGroupIdx].tasks[currTaskIdx].status = 'done'
            await updateBoard(board)
        } catch (err) {
            setIsDone(isDone => !isDone)
            console.log('err: ', err);
        }
    }

    return (
        <>
            <article onClick={onOpenModal} className="task-preview">
                {task.style ? <div className='task-color' style={{ ...task.style }}></div> : ''}
                {task.labelIds ?
                    <section style={{ marginBlockEnd: '0.5em' }} className='labels-task-preview'>
                        {task.labelIds.map(labelId => {
                            const currLabel = labels.find(label => label.id === labelId)
                            return isLabelsClicked ?
                                <div key={labelId} onClick={(ev) => {
                                    ev.stopPropagation()
                                    setIsLabelsClicked(isClicked => !isClicked)
                                }} style={{ transition: '200ms', marginRight: '0.3em', backgroundColor: currLabel.color, width: '40px', height: '8px', padding: '0px 8px', borderRadius: '4px' }}>
                                </div>
                                : <div key={labelId} onClick={(ev) => {
                                    ev.stopPropagation()
                                    setIsLabelsClicked(isClicked => !isClicked)
                                }} style={{ textAlign: 'center', transition: '200ms', fontFamily: 'roboto-bold', color:currLabel.fontColor , fontSize: '0.8em', marginRight: '0.3em', backgroundColor: currLabel.color,minWidth: '60px', maxWidth:'max-content' , height: '17px', padding: '0px 8px', borderRadius: '4px', justifyContent:'center' }}>
                                    {currLabel.title}
                                </div>


                        })}
                    </section>
                    : ''}
                {task.title}
                <div className="icons-list" style={{ justifyContent: "space-between", paddingBottom: '0.4em', display: 'flex', flexDirection: getCountIcons() <= 6 ? 'row' : 'column', gap: '0.6em' }}>
                    <section className="left-side-btns flex align-center" style={{ marginTop: '0.5em', gap: '0.6em' }}>
                        {task.dueDate ?
                            isDone ?
                                <div onClick={onDateClick} className='date-btn flex align-center' title={getDateColor(new Date(task.dueDate)).title} style={{ gap: '0.4em', ...getDateColor(new Date(task.dueDate)) }}>
                                    <svg width="17" height="17" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V6Z" fill="currentColor" /><path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill={getDateColor(new Date(task.dueDate)).color} /></svg>
                                    <div className='checkbox'><svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13C20 12.4477 19.5523 12 19 12C18.4477 12 18 12.4477 18 13V18H6V6L16 6C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4H6ZM8.73534 10.3223C8.36105 9.91618 7.72841 9.89038 7.3223 10.2647C6.91619 10.639 6.89039 11.2716 7.26467 11.6777L10.8768 15.597C11.4143 16.1231 12.2145 16.1231 12.7111 15.6264L13.0754 15.2683C13.3699 14.9785 13.6981 14.6556 14.0516 14.3075C15.0614 13.313 16.0713 12.3169 17.014 11.3848L17.0543 11.3449C18.7291 9.68869 20.0004 8.42365 20.712 7.70223C21.0998 7.30904 21.0954 6.67589 20.7022 6.28805C20.309 5.90022 19.6759 5.90457 19.2881 6.29777C18.5843 7.01131 17.3169 8.27244 15.648 9.92281L15.6077 9.96263C14.6662 10.8937 13.6572 11.8889 12.6483 12.8825L11.8329 13.6851L8.73534 10.3223Z" fill={getDateColor(new Date(task.dueDate)).color} /></svg></div>
                                    {
                                        <span style={{ fontSize: '0.9em' }}>{formatDate(new Date(task.dueDate))}</span>
                                    }
                                </div>
                                :
                                <div onClick={onDateClick} className='date-btn flex align-center' title={getDateColor(new Date(task.dueDate)).title} style={{ gap: '0.4em', ...getDateColor(new Date(task.dueDate)) }}>
                                    <svg width="17" height="17" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V6Z" fill="currentColor" /><path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill={getDateColor(new Date(task.dueDate)).color} /></svg>
                                    <div className='checkbox'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={getDateColor(new Date(task.dueDate)).color}><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z" /></svg></div>
                                    {
                                        <span style={{ fontSize: '0.9em' }}>{formatDate(new Date(task.dueDate))}</span>
                                    }
                                </div> : ''}
                        {task.description ? <img title='This card has a description' src="\img\board-details\description-icon.png" alt="description" /> : ''}
                        {task.comments ? <div title='Comments' className="flex align-center"><img src="\img\board-details\chat-icon.svg" alt="comments" /> {<span style={{ marginInlineStart: "0.3em", fontSize: "0.9em" }}>{task.comments.length}</span>} </div> : ''}
                        {task.attachments ? <div title='Attachments' className="flex align-center"><img src="\img\board-details\attachment-icon.svg" alt="attachments" /> {<span style={{ marginInlineStart: "0.3em", fontSize: "0.9em" }}>{task.attachments.length}</span>} </div> : ''}
                        {task.checklists ? <div title="Checklist items" className="flex align-center"><img src="\img\board-details\checkbox-icon.svg" alt="checkbox" /><span style={{ marginInlineStart: "0.3em", fontSize: "0.9em" }}>{`${getDoneTodosCount(task)}/${getTodosCount(task)}`}</span></div> : ''}
                    </section>
                    <section className="right-side-members flex align-center" style={{ marginTop: '0.5em', gap: '0.6em', alignContent: 'right', justifyContent: 'right', paddingBottom: '0.2em', paddingLeft: '0.4em' }}>
                        {task.memberIds?.map(memberId => {
                            const currMember = board?.members?.find(member => member._id === memberId)
                            return <img title={currMember?.fullname} key={currMember?._id} src={currMember?.imgUrl} alt="member-icon" />
                        }
                        )}
                    </section>
                </div>

            </article>
            <ModalTaskDetails onCloseModal={onCloseModal} isOpen={isModalOpen} isBlur={true}>
                <Outlet context={{ onCloseModal }} />
                {/* <TaskDetails groupId={groupId} setIsOpenTaskDetails={setIsOpenTaskDetails} currTask={task} /> */}
            </ModalTaskDetails>
            {/* <Modal>
            </Modal> */}
        </>
    )
}
