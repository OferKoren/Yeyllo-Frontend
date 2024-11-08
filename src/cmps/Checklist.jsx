import { useState, useEffect, useRef } from 'react'
import { makeId } from '../services/util.service.js'

export function Checklist({ todos, task, checklist, setTask }) {

    const { id: checklistId, title } = checklist
    const [isAddingTodo, setIsAddingTodo] = useState(false)
    const [checklistIdToEdit, setChecklistIdToEdit] = useState('')
    const [newTodoValue, setNewTodoValue] = useState('')


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

    return (
        <div className="todo-list-preview edit">
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
        </div>
    )
}