import { Link } from 'react-router-dom'
import { TaskDetails } from '../pages/TaskDetails'
import { useState } from 'react'
import { ModalTaskDetails } from '../cmps/ModalTaskDetails.jsx'

export function TaskPreview({ groupId, task }) {
    const [isOpenTaskDetails, setIsOpenTaskDetails] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    // function openTaskDetails() {
    //     setIsOpenTaskDetails(true)
    // }
    function onCloseModal() {
        setIsModalOpen(false)
    }
    function onOpenModal() {
        setIsModalOpen(true)
    }
    return (
        <>
            <article onClick={onOpenModal} className="task-preview">
                {task.title}
            </article>
            <ModalTaskDetails onCloseModal={onCloseModal} isOpen={isModalOpen} isBlur={true}>
                <TaskDetails groupId={groupId} setIsOpenTaskDetails={setIsOpenTaskDetails} currTask={task} />
            </ModalTaskDetails>
            {/* <article className="task-preview">
                <Link to={`${groupId}/${task.id}`}>
                    {task.title}
                </Link>
            </article> */}
            {/* <Modal>
            </Modal> */}
        </>
    )
}