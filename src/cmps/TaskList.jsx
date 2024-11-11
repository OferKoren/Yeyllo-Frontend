import { useState } from "react";
import { TaskPreview } from "./TaskPreview";
import { makeId } from "../services/util.service";
import ClickOutside from "./ClickOutside";

export function TaskList({ isLabelsClicked, setIsLabelsClicked, taskTitle, setTaskTitle, isAddTaskClicked, setIsAddTaskClicked, tasks, board, onUpdateBoard, groupId }) {
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

    console.log('title:', taskTitle);

    return (
        <>

            {!isAddTaskClicked ?
                <>
                    <section className="task-list">
                        {tasks.map(task =>
                            <TaskPreview board={board} isLabelsClicked={isLabelsClicked} setIsLabelsClicked={setIsLabelsClicked} key={task.id} groupId={groupId} task={task} />
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
                        <TaskPreview key={task.id} task={task} groupId={groupId} />
                    )}

                    {/* <ClickOutside
                        onClick={() => {
                            if (taskTitle) {
                                onAddTask()
                            } else {
                                onCloseEditTitle()
                            }
                        }
                        }
                    > */}
                        <div className="add-task-container">
                            <form onSubmit={onAddTask}>
                                {/* <input onBlur={onBlurAddTaskInput} autoFocus type="text" id="title" name="title" value={taskTitle} placeholder="Enter a title..." onChange={handleChange} /> */}
                                <input autoFocus onBlur={onBlurAddTaskInput} type="text" id="title" name="title" value={taskTitle} placeholder="Enter a title" onChange={handleChange} />
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
