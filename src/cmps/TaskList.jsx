import { useState } from "react";
import { TaskPreview } from "./TaskPreview";
import { makeId } from "../services/util.service";
import ClickOutside from "./ClickOutside";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export function TaskList({ group, isLabelsClicked, setIsLabelsClicked, taskTitle, setTaskTitle, isAddTaskClicked, setIsAddTaskClicked, tasks, board, onUpdateBoard, groupId }) {
    // const [isTaskDeleted, setIsTaskDeleted] = useState(false)
    // const { groups } = board

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name
        let value = ev.target.value

        switch (type) {
            case 'text':
                break
            case 'number': {
                value = +ev.target.value || ''
                break
            }
        }
        setTaskTitle(value)
    }

    async function onAddTask(ev) {
        if (ev) ev.preventDefault()
        if (!taskTitle) return onCloseEditTitle()
        // if (!taskTitle) return alert('Text field is required')

        try {
            const currGroupIdx = board.groups.findIndex(group => group.id === groupId)
            const newTask = {
                id: makeId(),
                title: taskTitle,
            }
            board.groups[currGroupIdx].tasks.push(newTask)
            await onUpdateBoard(board)
            setIsAddTaskClicked(isClicked => !isClicked)
            onCloseEditTitle()
        } catch (err) {
            console.log('err: ', err);
        }
    }

    function onCloseEditTitle() {
        setIsAddTaskClicked(isClicked => !isClicked)
        setTaskTitle('')
    }

    function onBlurAddTaskInput() {
        if (!taskTitle) return onCloseEditTitle()
        onAddTask()
    }

    const handleDragDrop = async (results) => {
        const { source, destination, type } = results
        if (!destination) return
        if (source.droppableId === destination.droppableId &&
            source.index === destination.index) return
        if (type === 'group') {
            try {
                const reorderedTasks = [...group.tasks]

                const sourceIndex = source.index
                const destinationIndex = destination.index

                const [removedTask] = reorderedTasks.splice(sourceIndex, 1)
                reorderedTasks.splice(destinationIndex, 0, removedTask)
                group.tasks = reorderedTasks

                await onUpdateBoard(board)
            } catch (err) {
                console.log('err: ', err);
            }
        }
    }
    

    return (
        <DragDropContext onDragEnd={handleDragDrop}>

            {!isAddTaskClicked ?
                <>
                    <Droppable droppableId="ROOT" type="group">
                        {(provided) => (
                            <div className="task-list" {...provided.droppableProps} ref={provided.innerRef}>
                                {tasks.map((task, index) =>
                                    <TaskPreview index={index} board={board} isLabelsClicked={isLabelsClicked} setIsLabelsClicked={setIsLabelsClicked} key={task.id} groupId={groupId} task={task} />
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <section>
                        <div className='add-task-btn-container' >
                            <button onClick={() => setIsAddTaskClicked(isClicked => !isClicked)} className={`add-task-btn  ${group?.style?.backgroundColor?.substr(1)}`}><span>+</span><span>Add a card</span></button>
                        </div>
                    </section>
                </>
                :
                <section className="task-list add-task-option">
                    <Droppable droppableId="ROOT" type="group">
                        {(provided) => (

                            <div className="task-list add-task-option" {...provided.droppableProps} ref={provided.innerRef}>

                                {tasks.map(task =>
                                    <TaskPreview board={board} isLabelsClicked={isLabelsClicked} setIsLabelsClicked={setIsLabelsClicked} onUpdateBoard={onUpdateBoard} key={task.id} task={task} groupId={groupId} />
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <ClickOutside
                        onSubmit={onAddTask} onClick={onAddTask}
                    >
                        <div className="add-task-container">
                            <form onSubmit={onAddTask}>
                                {/* <input onBlur={onBlurAddTaskInput} autoFocus type="text" id="title" name="title" value={taskTitle} placeholder="Enter a title..." onChange={handleChange} /> */}
                                <input autoFocus /*onBlur={onBlurAddTaskInput}*/ type="text" id="title" name="title" value={taskTitle} placeholder="Enter a title" onChange={handleChange} />
                                <div className="add-group-btns">
                                    <button>Add card</button>
                                    <button className="close-btn-x add-card-close" onClick={onCloseEditTitle} type="button"><img src="\img\board-details\close-icon-dark.png" alt="" /></button>
                                </div>
                            </form>
                        </div>
                    </ClickOutside>
                </section>
            }

        </DragDropContext>




    )
}
