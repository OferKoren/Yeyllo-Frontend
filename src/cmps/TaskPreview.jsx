import { Link, Outlet } from 'react-router-dom'
import { TaskDetails } from '../pages/TaskDetails'
import { useState } from 'react'
import { ModalTaskDetails } from '../cmps/ModalTaskDetails.jsx'
import { useNavigate, useParams } from 'react-router-dom'

export function TaskPreview({ groupId, task }) {
    const [isOpenTaskDetails, setIsOpenTaskDetails] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate()
    const { boardId } = useParams()
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
    return (
        <>
            <article onClick={onOpenModal} className="task-preview">
                {task.title}
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
