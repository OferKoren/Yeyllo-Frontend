import { Link, Outlet } from 'react-router-dom'
import { TaskDetails } from '../pages/TaskDetails'
import { useEffect, useState } from 'react'
import { ModalTaskDetails } from '../cmps/ModalTaskDetails.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function TaskPreview({ board, isLabelsClicked, setIsLabelsClicked, groupId, task }) {
    const [isOpenTaskDetails, setIsOpenTaskDetails] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // const [countIcons, setCountIcons] = useState(0)

    // useEffect(() => {
    //     // getCountIcons()
    //     // console.log(countIcons);

    // }, [])

    function getCountIcons() {
        let count = 0

        if (task.dueDate) count += 2
        if (task.description) count++
        if (task.comments) count++
        if (task.checklists) count++
        if (task.memberIds) count += task.memberIds.length

        return count
        // if (task.dueDate) setCountIcons(prev => prev += 2)
        // if (task.description) setCountIcons(prev => prev++)
        // if (task.comments) setCountIcons(prev => prev++)
        // if (task.checklists) setCountIcons(prev => prev++)
        // if (task.memberIds) setCountIcons(prev => prev += task.memberIds.length)
    }

    // const [dateColor, setDateColor] = useState('')

    const navigate = useNavigate()

    const { boardId } = useParams()
    const labels = useSelector(storeState => storeState.boardModule.labels)
    // console.log(labels);

    // function openTaskDetails() {
    //     setIsOpenTaskDetails(true)
    // }
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

        // console.log(date, date + 2);


        if ((today.getDate() === date.getDate() || today.getDate() - 1 === date.getDate() && today.getMonth() === date.getMonth())) return { backgroundColor: '#c9372c', color: 'white' }
        // if ((today === date && (today.getDate() === currDate && date.xmas95.getHours() <= today.xmas95.getHours()) || today.getDate() - 1 === currDate)) return { backgroundColor: '#c9372c', color: 'white' }
        if (date >= today && date <= today.setTime(today.getTime() + 24 * 60 * 60 * 1000)) return { backgroundColor: '#f5cd47', color: '#172b4d' }
        if (date < today) return { backgroundColor: '#ffd5d2', color: '#ae2e24' }


    }

    function getTodosCount(task) {
        const todosCount = task.checklists.reduce((acc, checklist) => acc + checklist.todos.length, 0)
        return todosCount
    }

    function getDoneTodosCount(task) {
        const doneTodosCount = task.checklists.reduce((acc, checklist) => acc + checklist.todos.filter(todo => todo.isDone).length, 0)
        return doneTodosCount
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
                                }} style={{ textAlign: 'center', transition: '200ms', fontFamily: 'roboto-bold', fontSize: '0.8em', marginRight: '0.3em', backgroundColor: currLabel.color, width: '60px', height: '18px', padding: '0px 8px', borderRadius: '4px' }}>
                                    {currLabel.title}
                                </div>


                        })}
                    </section>
                    : ''}
                {task.title}
                <div className="icons-list" style={{ paddingBottom: '0.4em', display: 'flex', flexDirection: getCountIcons() <= 6 ? 'row' : 'column', gap: '0.6em' }}>
                    <section className="left-side-btns flex align-center" style={{ marginTop: '0.5em', gap: '0.6em' }}>
                        {task.dueDate ?

                            <div className='date-btn flex align-center' style={{ gap: '0.4em', ...getDateColor(new Date(task.dueDate)) }}>
                                <svg width="17" height="17" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V6Z" fill="currentColor" /><path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill={getDateColor(new Date(task.dueDate)).color} /></svg>
                                {
                                    <span style={{ fontSize: '0.9em' }}>{formatDate(new Date(task.dueDate))}</span>
                                }
                            </div> : ''}
                        {task.description ? <img title='This card has a description' src="\img\board-details\description-icon.png" alt="description" /> : ''}
                        {task.comments ? <div className="flex align-center"><img title='comments' src="\img\board-details\chat-icon.svg" alt="comments" /> {<span style={{ marginInlineStart: "0.3em", fontSize: "0.9em" }}>{task.comments.length}</span>} </div> : ''}
                        {task.checklists ? <div className="flex align-center"><img src="\img\board-details\checkbox-icon.svg" alt="checkbox" /><span style={{ marginInlineStart: "0.3em", fontSize: "0.9em" }}>{`${getDoneTodosCount(task)}/${getTodosCount(task)}`}</span></div> : ''}
                    </section>
                    <section className="right-side-members flex align-center" style={{ marginTop: '0.5em', gap: '0.6em', alignContent: 'right', justifyContent: 'right', paddingBottom: '0.2em', paddingLeft: '0.4em' }}>
                        {task.memberIds?.map(memberId => {
                            const currMember = board?.members?.find(member => member._id === memberId)                            
                            return <img  key={currMember?._id} src={currMember?.imgUrl} alt="" />
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
