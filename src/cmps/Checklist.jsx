import { useState, useEffect, useRef } from 'react'
import { makeId } from '../services/util.service.js'

export function Checklist({ todos, task, checklist, setTask }) {

    const { id: checklistId, title } = checklist
    const [isAddingTodo, setIsAddingTodo] = useState(false)
    const [checklistIdToEdit, setChecklistIdToEdit] = useState('')
    const [newTodoValue, setNewTodoValue] = useState('')


    function onUpdateTodo(todoId, task, checklistId, action) {
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
                const doneTodosPercent = getDoneTodosPercent(checklistId, updatedTodos)
                return { ...checklist, todos: updatedTodos, doneTodosPercent }
            }
            return checklist
        })
        const updatedTask = { ...task, checklists: updatedChecklists }
        setTask(updatedTask)
    }

    function getDoneTodosPercent(checklistId, updatedTodos) {
        // const checklist = task.checklists.find(checklist => checklist.id === checklistId)
        const doneTodosCount = updatedTodos.reduce((acc, todo) => {
            if (todo.isDone) acc++
            return acc
        }, 0)

        return (doneTodosCount / updatedTodos.length) * 100 || 0
    }

    function handleNewTodoChange({ target }) {
        setNewTodoValue(target.value)
    }

    function onAddTodo(checklistId, newTodoValue) {
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

    function onRemoveChecklist(checklistId) {
        const updatedChecklists = task.checklists.filter(checklist => checklist.id !== checklistId)
        setTask(prevTask => ({ ...prevTask, checklists: updatedChecklists }))
    }

    return (
        <div className="checklist-details">
            <div className="checklist-header">
                <div className="checklist-title">
                    <img src="/img/icons/icon-checklist.svg" />
                    <h2>{title}</h2>
                </div>
                <button className="btn btn-remove-checklist btn-light" onClick={() => onRemoveChecklist(checklistId)}>Delete</button>
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


            {todos && todos.map((item, i) =>
                item &&
                <div className="todo-item" key={item.id}>
                    <div className="checkbox-todo"  >
                        <input
                            type="checkbox"
                            checked={item.isDone || false}
                            value={item.title}
                            onChange={() => onUpdateTodo(item.id, task, checklistId, 'isDone')} />
                        <span className={`todo-text ${item.isDone ? 'todo-done' : ''}`}>{item.title}</span>
                    </div>
                    <button className="btn btn-remove-todo btn-light" onClick={() => onUpdateTodo(item.id, task, checklistId, 'removeTodo')}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>)}

            {(checklistIdToEdit === checklistId) && isAddingTodo ? (
                <div className="adding-todo-area">
                    <input
                        className="adding-todo-title"
                        type="text"
                        placeholder="Add an item"
                        value={newTodoValue}
                        onChange={handleNewTodoChange}
                    />
                    <div className="add-todo-actions">
                        <button className="btn btn-add-todo btn-dark"
                            onClick={() => { onAddTodo(checklistId, newTodoValue); setIsAddingTodo(false); setNewTodoValue('') }}>
                            Add
                        </button>
                        <button className="btn btn-clear" onClick={() => { setIsAddingTodo(false); setNewTodoValue('') }}>Cancel</button>
                    </div>
                </div>
            ) : (
                <button className="btn btn-open-todo btn-light" onClick={() => { setChecklistIdToEdit(checklistId); setIsAddingTodo(true) }}>
                    Add an item
                </button>
            )}
        </div>
    )
}