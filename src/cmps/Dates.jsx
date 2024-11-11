import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

export function Dates({ task, setIsEditDates, setTask, isEditDates, setIsEditDatesChevronBtn }) {

    function onRemoveDueDate() {
        const { dueDate, status, ...updatedTask } = task
        setTask(updatedTask)
    }
    function handleDateChange(dates) {
        const [startDate, endDate] = dates
        if (startDate) {
            const formattedDate = startDate.toISOString().split('T')[0]
            setTask((prevTask) => ({ ...prevTask, dueDate: formattedDate, status: 'inProgress' }))
        }
    }

    return (
        <div className="modal-option">
            <div className="option-modal-header">
                <h2>Dates</h2>
                <i className="btn fa-solid fa-xmark" onClick={() => { setIsEditDates(false); setIsEditDatesChevronBtn(false) }}></i>
            </div>

            <DatePicker
                selected={task.dueDate ? new Date(task.dueDate) : null} // Initialize with task's dueDate
                onChange={handleDateChange}
                name="dueDate"
                className="task-dueDate"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select due date"
                open={isEditDates}
                selectsRange
                inline
            />

            {/* <input value={task.dueDate || "2024-10-23"}
                type="date"
                id="dueDate"
                className="task-dueDate"
                name="dueDate"
                onChange={handleChange}
            ></input> */}
            <button className="btn btn-clear" onClick={onRemoveDueDate}>Remove</button>
        </div>
    )
}