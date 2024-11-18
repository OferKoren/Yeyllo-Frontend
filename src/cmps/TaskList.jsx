import { useState } from "react";
import { TaskPreview } from "./TaskPreview";
import { makeId } from "../services/util.service";
import ClickOutside from "./ClickOutside";
import { Draggable } from "react-beautiful-dnd";
import { useSelector } from 'react-redux';

export function TaskList({ isModalOpen, setIsModalOpen, placeholder, group, isLabelsClicked, setIsLabelsClicked, taskTitle, setTaskTitle, isAddTaskClicked, setIsAddTaskClicked, tasks, board, onUpdateBoard, groupId }) {
    const user = useSelector((storeState) => storeState.userModule.user)
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
        if (isModalOpen) return
        if (!taskTitle) return onCloseEditTitle()
        // if (!taskTitle) return alert('Text field is required')

        try {
            const currGroupIdx = board.groups.findIndex(group => group.id === groupId)
            const newTaskId = makeId()
            const newTask = {
                id: newTaskId,
                title: taskTitle,
                coverSize: 'half',
            }

            const activity = {
                txt: `added task "${taskTitle}" to "${group.title}"`,
                boardId: board._id,
                groupId,
                taskId: newTaskId,
                byMember: { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl },
                createdAt: Date.now(),
            }

            board.groups[currGroupIdx].tasks.push(newTask)
            await onUpdateBoard(board, activity)
            setIsAddTaskClicked(isClicked => !isClicked)
            onCloseEditTitle()
        } catch (err) {
            console.log('err: ', err);
        }
    }

    function onCloseEditTitle() {
        if (isModalOpen) return setTaskTitle('')
        setIsAddTaskClicked(isClicked => !isClicked)
        setTaskTitle('')
    }

    function onBlurAddTaskInput(ev) {
        if (!taskTitle) return onCloseEditTitle()
        onAddTask()
    }

    return (
        <>

            {!isAddTaskClicked ?
                <>
                    <section className="task-list">
                        {tasks.map((task, index) =>
                            <Draggable isDragDisabled={isModalOpen} draggableId={task.id} index={index} key={task.id}>
                                {(provided, snapshot) => (
                                    <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                        <TaskPreview snapshot={snapshot} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} board={board} isLabelsClicked={isLabelsClicked} setIsLabelsClicked={setIsLabelsClicked} key={task.id} groupId={groupId} task={task} />
                                    </div>
                                )}
                            </Draggable>
                        )}
                        {placeholder}
                    </section>
                    <section>
                        <div className='add-task-btn-container' >
                            <button onClick={() => setIsAddTaskClicked(isClicked => !isClicked)} className={`add-task-btn ${group?.style?.backgroundColor?.substr(1)}`}><span>+</span><span>Add a card</span></button>
                        </div>
                    </section>
                </>
                :
                <section className="task-list add-task-option">
                    {tasks.map((task, index) =>
                        <Draggable isDragDisabled={isModalOpen} draggableId={task.id} index={index} key={task.id}>
                            {(provided, snapshot) => (
                                <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                    <TaskPreview snapshot={snapshot} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} board={board} isLabelsClicked={isLabelsClicked} setIsLabelsClicked={setIsLabelsClicked} onUpdateBoard={onUpdateBoard} key={task.id} task={task} groupId={groupId} />
                                </div>
                            )}
                        </Draggable>
                    )}

                    {/* <ClickOutside
                        onSubmit={onAddTask} onClick={()=>onAddTask()}
                    > */}
                    <div className="add-task-container" onBlur={onBlurAddTaskInput}>
                        <form onSubmit={onAddTask}>
                            {/* <input onBlur={onBlurAddTaskInput} autoFocus type="text" id="title" name="title" value={taskTitle} placeholder="Enter a title..." onChange={handleChange} /> */}
                            <input autoFocus type="text" id="title" name="title" value={taskTitle} placeholder="Enter a title" onChange={handleChange} />
                            <div className="add-group-btns">
                                <button>Add card</button>
                                <button className="close-btn-x add-card-close" onClick={onCloseEditTitle} type="button"><img src="\img\board-details\close-icon-dark.png" alt="" /></button>
                            </div>
                        </form>
                    </div>
                    {/* </ClickOutside> */}
                </section>
            }

        </>




    )
}
