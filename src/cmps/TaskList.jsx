import { useState } from "react";
import { TaskPreview } from "./TaskPreview";
import { makeId } from "../services/util.service";

export function TaskList({ tasks, board, onUpdateBoard, groupId }) {
    const [isAddTaskClicked, setIsAddTaskClicked] = useState(false)
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
        ev.preventDefault()
        try {
            const currGroupIdx = board.groups.findIndex(group => group.id === groupId)
            const newTask = {
                id: makeId(),
                title: taskTitle,
            }
            board.groups[currGroupIdx].tasks.push(newTask)
            await onUpdateBoard(board)
            // toggleMenu()
            setIsAddTaskClicked(isClicked => !isClicked)
        } catch (err) {
            console.log('err: ', err);
        }
    }

    function onCloseEditTitle() {
        setIsAddTaskClicked(isClicked => !isClicked)
        setTaskTitle('')
    }


    return (
        <section className="task-list">
            {tasks.map(task =>
                <TaskPreview key={task.id} task={task} groupId={groupId} />
            )}
            {isAddTaskClicked ?
                <div className="add-task-container">
                    <form onSubmit={onAddTask}>
                        <input autoFocus type="text" id="title" name="title" value={taskTitle} placeholder="Enter a title..." onChange={handleChange} />
                        <div className="add-group-btns">
                            <button>Add list</button>
                            <button onClick={onCloseEditTitle} type="button">X</button>
                        </div>
                    </form>
                </div>
                : <div className="add-task-btn-container">
                    <button onClick={() => setIsAddTaskClicked(isClicked => !isClicked)} className="add-task-btn"><span>+</span><span>Add a card</span></button>
                </div>}



        </section>
    )
}
