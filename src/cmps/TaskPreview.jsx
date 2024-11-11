import { Link, Outlet } from 'react-router-dom'
import { TaskDetails } from '../pages/TaskDetails'
import { useState } from 'react'
import { ModalTaskDetails } from '../cmps/ModalTaskDetails.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function TaskPreview({ isLabelsClicked, setIsLabelsClicked, groupId, task }) {
    const [isOpenTaskDetails, setIsOpenTaskDetails] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const navigate = useNavigate()

    const { boardId } = useParams()
    const labels = useSelector(storeState => storeState.boardModule.labels)
    console.log(labels);

    // function openTaskDetails() {
    //     setIsOpenTaskDetails(true)
    // }
    function onCloseModal() {
        setIsModalOpen(false)
        navigate(`/board/${boardId}`)
    }
    function onOpenModal() {
        setIsModalOpen(true)
        navigate(`/board/${boardId}/${groupId}/${task.id}`)
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

    function getTodosCount(task){
        const todosCount = task.checklists.reduce((acc, checklist) => acc + checklist.todos.length, 0)
        return todosCount
    }

    function getDoneTodosCount(task){
        const doneTodosCount = task.checklists.reduce((acc, checklist) => acc + checklist.todos.filter(todo => todo.isDone).length, 0)
        return doneTodosCount
    }

    return (
        <>
            <article onClick={onOpenModal} className="task-preview">
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
                <section className="left-side-bts flex align-center" style={{ marginTop: '0.5em', gap: '0.5em' }}>
                    {task.dueDate ?

                        <div className='date-btn flex align-center' style={{ gap: '0.5em' }}>
                            <img src="\img\board-details\clock.png" alt="" />
                            {
                                <span style={{ fontSize: '0.8em' }}>{formatDate(new Date(task.dueDate))}</span>
                            }
                        </div> : ''}
                    {task.description ? <img title='This card has a description' src="\img\board-details\description-icon.png" alt="description" /> : ''}
                    {task.comments ? <div className="flex"><img style={{ colo: 'blue' }} title='comments' src="\img\board-details\chat-icon.svg" alt="comments" /> {<span style={{ marginInlineStart: "0.3em", fontSize: "0.9em" }}>{task.comments.length}</span>} </div> : ''}
                    {task.checklists? <div>{`${getDoneTodosCount(task)}/${getTodosCount(task)}`}</div> : ''}
                </section>
            </article>
            <ModalTaskDetails onCloseModal={onCloseModal} isOpen={isModalOpen} isBlur={true}>
                <Outlet />
                {/* <TaskDetails groupId={groupId} setIsOpenTaskDetails={setIsOpenTaskDetails} currTask={task} /> */}
            </ModalTaskDetails>
            {/* <Modal>
            </Modal> */}
        </>
    )
}
