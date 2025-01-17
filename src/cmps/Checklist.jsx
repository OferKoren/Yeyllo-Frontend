import { useState, useEffect, useRef } from 'react'
import { makeId } from '../services/util.service.js'
import { DeleteTodoModal } from '../cmps/DeleteTodoModal.jsx'
import { DeleteChecklistModal } from '../cmps/DeleteChecklistModal.jsx'
import { TextareaAutosize } from '@mui/base/TextareaAutosize'

export function Checklist({ todos, task, checklist, setTask, openModal, handleToggleModal, handleCloseModal, addActivity }) {

    const { id: checklistId, title } = checklist
    const [isAddingTodo, setIsAddingTodo] = useState(false)
    const [checklistIdToEdit, setChecklistIdToEdit] = useState('')
    const [newTodoValue, setNewTodoValue] = useState('')
    const [isButtonsVisible, setIsButtonsVisible] = useState(false)

    function onUpdateTodo(todoId, task, checklistId, action, newTodoValue) {
        const updatedChecklists = task.checklists.map(checklist => {
            if (checklist.id === checklistId) {
                let updatedTodos = []
                if (action === 'isDone') {
                    updatedTodos = checklist.todos.map(todo =>
                        todo.id === todoId ? { ...todo, isDone: !todo.isDone } : todo)
                }
                if (action === 'removeTodo') {
                    updatedTodos = checklist.todos.filter(todo => todo.id !== todoId)
                }
                if (action === 'addTodo') {
                    const newTodo = {
                        id: makeId(),
                        title: newTodoValue.trim(),
                        isDone: false
                    }
                    updatedTodos = [...checklist.todos, newTodo]
                }
                const doneTodosPercent = getDoneTodosPercent(checklistId, updatedTodos)
                return { ...checklist, todos: updatedTodos, doneTodosPercent }
            }
            return checklist
        })
        const updatedTask = { ...task, checklists: updatedChecklists }
        setTask(updatedTask)
    }

    function getDoneTodosPercent(checklistId, updatedTodos) {
        const doneTodosCount = updatedTodos.reduce((acc, todo) => {
            if (todo.isDone) acc++
            return acc
        }, 0)

        return (doneTodosCount / updatedTodos.length) * 100 || 0
    }

    function handleNewTodoChange({ target }) {
        setNewTodoValue(target.value)
    }

    function handleToggleButtons(todoName) {
        setIsButtonsVisible(prevState => {
            if (prevState) {
                handleCloseModal()
                return null
            } else return todoName
            // return prevState ? null : todoName
        })
    }

    function onRemoveChecklist(checklistId) {
        const updatedChecklists = task.checklists.filter(checklist => checklist.id !== checklistId)
        setTask(prevTask => ({ ...prevTask, checklists: updatedChecklists }))

        addActivity(`removed ${checklist.title} from card "${task.title}"`)
    }

    return (
        <div className="area-layout checklist-details">
            <img className="icon-area" src="/img/icons/icon-checklist.svg" />
            <div className="title-area checklist-header">
                <h2 >{title}</h2>
                <div className="delete-checklist-area">
                    <button className="btn btn-remove-checklist btn-light"
                        onClick={() => handleToggleModal(`delete-checklist-${checklist.id}`)}>
                        Delete
                    </button>
                    {openModal === `delete-checklist-${checklist.id}` &&
                        <DeleteChecklistModal checklistId={checklistId} handleCloseModal={handleCloseModal} onRemoveChecklist={onRemoveChecklist} />}
                </div>
            </div>

            <div className="progress-bar-container">
                <span>{Math.round(checklist.doneTodosPercent || 0)}%</span>
                <div className="progress-bar">
                    <div className="progress"
                        style={{
                            width: `${checklist.doneTodosPercent || 0}%`,
                            backgroundColor: (checklist.doneTodosPercent === 100) ? '#4caf50' : '#44546F'
                        }}></div>
                </div>
            </div>

            {todos && todos.length > 0 &&
                <div className="todo-list">
                    {todos.map((item, i) =>
                        item &&
                        <div className="todo-item" key={item.id}>
                            <div className="checkbox-todo icon-area"  >
                                <input
                                    type="checkbox"
                                    checked={item.isDone || false}
                                    value={item.title}
                                    onChange={() => onUpdateTodo(item.id, task, checklistId, 'isDone')} />
                            </div>
                            <div className="todo-content title-area">
                                <span className={`todo-text ${item.isDone ? 'todo-done' : ''}`}>{item.title}</span>
                                <div className={`todo-content-buttons ${isButtonsVisible === `todoActions-${item.id}` ? 'visible' : ''}`}>
                                    <div>
                                        <button className={"btn btn-item-actions btn-action"}
                                            onClick={() => { handleToggleModal(`todoActions-${item.id}`); handleToggleButtons(`todoActions-${item.id}`) }}>
                                            <i className="fa-solid fa-ellipsis"></i>
                                        </button>
                                        {openModal === `todoActions-${item.id}` &&
                                            <DeleteTodoModal
                                                onUpdateTodo={onUpdateTodo}
                                                itemId={item.id}
                                                task={task}
                                                checklistId={checklistId}
                                                action={'removeTodo'}
                                                handleCloseModal={handleCloseModal} />}
                                    </div>
                                </div>
                            </div>
                        </div>)}
                </div>}

            {(checklistIdToEdit === checklistId) && isAddingTodo ? (
                <form className="adding-todo-area" onSubmit={(ev) => { ev.preventDefault(); onUpdateTodo(undefined, task, checklistId, 'addTodo', newTodoValue); setNewTodoValue('') }}>
                    <TextareaAutosize
                        placeholder="Add an item"
                        className="adding-todo-title"
                        autoFocus
                        type="text"
                        value={newTodoValue}
                        onChange={handleNewTodoChange}
                    />
                    <div className="add-todo-actions" >
                        <button className="btn btn-add-todo btn-dark">
                            Add
                        </button>
                        <button type="button" className="btn btn-clear" onClick={() => { setIsAddingTodo(false); setNewTodoValue('') }}>Cancel</button>
                    </div>
                </form>
            ) : (
                <button className="btn btn-open-todo btn-light" onClick={() => { setChecklistIdToEdit(checklistId); setIsAddingTodo(true) }}>
                    Add an item
                </button>
            )}
        </div>
    )
}