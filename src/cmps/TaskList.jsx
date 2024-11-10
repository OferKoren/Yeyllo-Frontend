import { useState } from "react";
import { TaskPreview } from "./TaskPreview";
import { makeId } from "../services/util.service";

export function TaskList({ isAddTaskClicked, setIsAddTaskClicked, tasks, board, onUpdateBoard, groupId }) {
    const [taskTitle, setTaskTitle] = useState('')
    // const [isTaskDeleted, setIsTaskDeleted] = useState(false)

    const { groups } = board
    console.log(groups);

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
        console.log(value)
        setTaskTitle(value)
    }

    async function onAddTask(ev) {
        if (ev) ev.preventDefault()
        if (!taskTitle) return alert('Text field is required')

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


    return (
        <>

            {!isAddTaskClicked ?
                <>
                    <section className="task-list">
                        {tasks.map(task =>
                            <TaskPreview key={task.id} task={task} />
                        )}
                    </section>
                    <section>
                        <div className="add-task-btn-container">
                            <button onClick={() => setIsAddTaskClicked(isClicked => !isClicked)} className="add-task-btn"><span>+</span><span>Add a card</span></button>
                        </div>
                    </section>
                </>
                :
                    <section className="task-list">
                        {tasks.map(task =>
                            <TaskPreview key={task.id} task={task} />
                        )}

                        <div className="add-task-container">
                            <form onSubmit={onAddTask}>
                                <input onBlur={onBlurAddTaskInput} autoFocus type="text" id="title" name="title" value={taskTitle} placeholder="Enter a title..." onChange={handleChange} />
                                <div className="add-group-btns">
                                    <button>Add list</button>
                                    <button className="close-btn-x" onClick={onCloseEditTitle} type="button"><img src="\img\board-details\close-icon.png" alt="" /></button>
                                </div>
                            </form>
                        </div>
                    </section>
            }

        </>




    )
}
