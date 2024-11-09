import { useState, useEffect, useRef } from 'react'

export function Dates({ task, handleChange, setIsEditDates }) {

    const dateInputRef = useRef(null)

    return (
        <input value={task.dueDate || "2024-10-23"}
            type="date"
            id="dueDate"
            className="task-dueDate"
            name="dueDate"
            onChange={handleChange}
        ></input>
    )
}