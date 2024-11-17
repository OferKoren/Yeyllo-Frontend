import { useState } from 'react'
import { boardService } from '../../../services/board'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { TaskPreview } from '../../TaskPreview'

export function ArchiveMenu({ board, onUpdateBoard }) {
    const [archivedItems, setArchivedItems] = useState(boardService.getArchivedItems(board))
    if (!archivedItems) return

    function onDelete(taskId) {
        const task = archivedItems.filter((task) => task.id === taskId)[0]
        const boardToUpdate = { ...board }
        const group = boardToUpdate.groups.find((group) => group.id === task.groupId)

        group.tasks = group.tasks.filter((task) => task.id !== taskId)
        onUpdateBoard(boardToUpdate)
        setArchivedItems((prevItems) => prevItems.filter((task) => task.id !== taskId))
    }

    function onReturnToBoard(taskId) {
        const task = archivedItems.filter((task) => task.id === taskId)[0]
        const boardToUpdate = { ...board }
        const group = boardToUpdate.groups.find((group) => group.id === task.groupId)
        const taskIdX = group.tasks.findIndex((task) => task.id === taskId)

        group.tasks[taskIdX].archivedAt = null
        onUpdateBoard(boardToUpdate)
        setArchivedItems((prevItems) => prevItems.filter((task) => task.id !== taskId))
    }

    return (
        <div className="archive-menu">
            <Droppable droppableId="ROOT" type="group" direction="horizontal">
                {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} className="archive-list">
                        {archivedItems.map((task, index) => (
                            <li key={task.id}>
                                <Draggable isDragDisabled={true} draggableId={task.id} index={index} key={task.id}>
                                    {(provided, snapshot) => (
                                        <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                            <TaskPreview
                                                snapshot={snapshot}
                                                isModalOpen={false}
                                                setIsModalOpen={() => {}}
                                                board={board}
                                                isLabelsClicked={false}
                                                setIsLabelsClicked={() => {}}
                                                onUpdateBoard={() => {}}
                                                key={task.id}
                                                task={task}
                                                groupId={'archived'}
                                                archive={true}
                                            />
                                        </div>
                                    )}
                                </Draggable>

                                <div className="btns">
                                    <button className="btn2" onClick={() => onDelete(task.id)}>
                                        delete
                                    </button>
                                    •
                                    <button className="btn2" onClick={() => onReturnToBoard(task.id)}>
                                        return to board
                                    </button>
                                </div>
                            </li>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </div>
    )
}
