import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { loadBoards } from '../store/actions/board.actions'
import { Labels } from '../cmps/Labels.jsx'
import { Dates } from '../cmps/Dates.jsx'
import { makeId } from '../services/util.service.js'
import { Checklist } from '../cmps/Checklist.jsx'

export function TaskDetails() {
    const boards = useSelector((storeState) => storeState.boardModule.boards)
    const [isEditLabels, setIsEditLabels] = useState(false)
    const [isEditDates, setIsEditDates] = useState(false)
    const [isAddChecklist, setIsAddChecklist] = useState(false)
    const [isAddingTodo, setIsAddingTodo] = useState(false)
    const [newTodoValue, setNewTodoValue] = useState('')
    const [newChecklist, setChecklist] = useState({ id: '', title: 'Checklist', todos: [] })
    const [checklistIdToEdit, setChecklistIdToEdit] = useState('')
    const [task, setTask] = useState({})
    const labels = [
        { id: 'l101', color: '#4BCE97', title: '' },
        { id: 'l102', color: '#F5CD47', title: '' },
        { id: 'l103', color: '#FEA362', title: '' },
        { id: 'l104', color: '#F87168', title: '' },
        { id: 'l105', color: '#9F8FEF', title: '' },
        { id: 'l106', color: '#579DFF', title: '' },
    ]

    const titleAreaRef = useRef(null)

    useEffect(() => {
        loadBoards()
        console.log('hi2')
    }, [])

    useEffect(() => {
        if (boards?.[0]?.groups?.[1]?.tasks?.[1]) {
            setTask(boards[0].groups[1].tasks[1])
        }
    }, [boards])

    function handleInfoChange({ target }) {
        let { value, name: field, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setTask((prevTask) => ({ ...prevTask, [field]: value }))
    }

    function renderCheckList(todos, task, { id: checklistId, title }) {
        return (<div className="todo-list-preview edit">
            <h3>{title}</h3>
            {todos.map((item, i) =>
                item &&
                <label className="checkbox-label-preview edit" key={item.id} >
                    <input
                        type="checkbox"
                        checked={item.isDone || false}
                        value={item.title}
                        onChange={() => changeIsCheckedTodo(item.id, task, checklistId)} />
                    <span className="todo-text">{item.title}</span>
                </label>)}
            {(checklistIdToEdit === checklistId) && isAddingTodo ? (
                <>
                    <input
                        type="text"
                        placeholder="Add an item"
                        value={newTodoValue}
                        onChange={handleNewTodoChange}
                    />
                    <button className="btn btn-add-todo"
                        onClick={() => { addTodo(checklistId, newTodoValue); setIsAddingTodo(false); setNewTodoValue('') }}>
                        Add
                    </button>
                    <button onClick={() => { setIsAddingTodo(false); setNewTodoValue('') }}>Cancel</button>
                </>
            ) : (
                <button className="btn btn-open-todo" onClick={() => { setChecklistIdToEdit(checklistId); setIsAddingTodo(true) }}>
                    Add an item
                </button>
            )}
        </div>)
    }

    function handleNewTodoChange({ target }) {
        setNewTodoValue(target.value)
    }

    function addTodo(checklistId, newTodoValue) {
        // const checklist = task.checklists.filter(checklist => checklist.id === checklistId)
        const newTodo = {
            id: makeId(),
            title: newTodoValue,
            isDone: false
        }

        const updatedChecklists = task.checklists.map(checklist => {
            if (checklist.id === checklistId) {
                return { ...checklist, todos: [newTodo, ...checklist.todos] }
            }
            return checklist
        })
        const updatedTask = { ...task, checklists: updatedChecklists }
        setTask(updatedTask)
    }

    function changeIsCheckedTodo(todoId, task, checklistId) {
        const updatedChecklists = task.checklists.map(checklist => {
            if (checklist.id === checklistId) {
                const updatedTodos = checklist.todos.map(todo =>
                    todo.id === todoId ? { ...todo, isDone: !todo.isDone } : todo
                )
                return { ...checklist, todos: updatedTodos }
            }
            return checklist
        })
        const updatedTask = { ...task, checklists: updatedChecklists }
        setTask(updatedTask)
    }

    function handleChangeChecklistTitle({ target }) {
        setChecklist(prevChecklist => ({ ...prevChecklist, title: target.value }))
    }
    function addChecklist() {
        const newChecklistToSave = { ...newChecklist, id: makeId() }
        setTask(prevTask => ({ ...prevTask, checklists: [...prevTask.checklists, newChecklistToSave] }))
    }

    if (!boards.length) return <div>Loading...</div>

    return (
        <article className="task-details">
            <div className="cover">
                {task.imgUrl && <img src={task.imgUrl} />}
            </div>

            <div className="info-area">
                <textarea
                    ref={titleAreaRef}
                    className="textarea-input"
                    type="text"
                    name="title"
                    id="title-update"
                    placeholder="Title"
                    value={task.title}
                    onChange={handleInfoChange} />

                {task.labelIds && task.labelIds.length !== 0 &&
                    <div className="label-list">
                        {task.labelIds.map((labelId, i) => {
                            const matchingLabel = labels.find(label => label.id === labelId)
                            if (matchingLabel) {
                                return <span className="label"
                                    key={labelId}
                                    style={{ backgroundColor: matchingLabel.color }}>
                                    {matchingLabel.txt || 'test'}
                                </span>
                            }
                        })
                        }
                    </div>}

                {task.dueDate &&
                    <div className="due-date">
                        <span>{task.dueDate}</span>
                    </div>}

                <textarea
                    className="textarea-input"
                    type="text"
                    name="description"
                    id="description-update"
                    placeholder="Description"
                    value={task.description || ''}
                    onChange={handleInfoChange} />

                {task.checklists?.length > 0 && task.checklists.map((checklist) => (

                    renderCheckList(checklist.todos, task, checklist)
                ))}

                <button onClick={() => setIsEditLabels(prev => !prev)}>Labels</button>
                <button onClick={() => setIsEditDates(prev => !prev)}>Dates</button>
                <button onClick={() => setIsAddChecklist(prev => !prev)}>Checklist</button>

                {isEditLabels && <Labels task={task} setTask={setTask} handleChange={handleInfoChange} />}
                {isEditDates && <Dates task={task} setTask={setTask} handleChange={handleInfoChange} />}

                {isAddChecklist &&
                    <div className="modal-adding-checklist">
                        <h4>Title</h4>
                        <input
                            type="text"
                            placeholder="Add an item"
                            value={newChecklist.title}
                            onChange={handleChangeChecklistTitle}
                        />
                        <button className="btn btn-add-checklist"
                            onClick={() => { addChecklist(); setIsAddChecklist(false); setNewTodoValue(''); setChecklist({ id: '', title: 'Checklist', todos: [] }) }}>
                            Add
                        </button>
                    </div>
                }

                {console.log(task)}

            </div>
            {/* <h1>Task Details</h1>
            <p>{task.id}</p>
            <p>{task.title}</p> */}
        </article>
    )
}