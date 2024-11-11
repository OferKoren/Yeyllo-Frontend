import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import dayjs from 'dayjs'

export function Dates({ task, setTask, handleCloseModal, openModal }) {

    const [endDate, setEndDate] = useState(task.dueDate || dayjs(Date.now()).format('MM/DD/YYYY'))
    const [startDate, setStartDate] = useState(task.startDate || null)
    const [latestDate, setLatestDate] = useState(task.dueDate || dayjs(Date.now()).format('MM/DD/YYYY'))
    const [isRangeEnabled, setIsRangeEnabled] = useState(!!startDate)

    function onRemoveDueDate() {
        const { dueDate, status, ...updatedTask } = task
        setTask(updatedTask)
    }
    function handleDatePick(dates) {
        if (Array.isArray(dates)) {
            const [start, end] = dates;
            if (isRangeEnabled) {
                setStartDate(start ? dayjs(start).format('MM/DD/YYYY') : null);
                setEndDate(end ? dayjs(end).format('MM/DD/YYYY') : null);
            }
        } else {
            // Single date mode
            setEndDate(dayjs(dates).format('MM/DD/YYYY'));
        }
    }

    function toggleStartDate() {
        setIsRangeEnabled(prev => !prev)
        if (!isRangeEnabled) {
            setStartDate(null)
        } else {
            setStartDate(dayjs(endDate).subtract(1, 'day').toDate()); // Clear start date if range is disabled
        }
    }

    function handleDateChange(date) {
        setTask((prevTask) => ({ ...prevTask, dueDate: date, status: 'inProgress' }))
    }

    return (
        <div className="modal-option">
            <div className="option-modal-header">
                <h2>Dates</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
            </div>

            <DatePicker
                swapRange
                selected={endDate ? new Date(endDate) : ''}
                onChange={handleDatePick}
                name="dueDate"
                className="task-dueDate"
                startDate={isRangeEnabled && startDate ? new Date(startDate) : null}
                endDate={new Date(endDate)}
                selectsRange={isRangeEnabled}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select due date"
                open={openModal === 'dates'}
                inline
            />

            <div className="dates">
                <div className="start-date-and-time">
                    <h3>Start date</h3>
                    <div className="start-date">
                        <input type="checkbox" checked={isRangeEnabled}
                            onChange={toggleStartDate} />
                        <DatePicker
                            selected={startDate ? new Date(startDate) : null}
                            open={false}
                            disabled={!isRangeEnabled}
                            placeholderText='MM/DD/YYYY'
                            onChange={(date) => setStartDate(date)} />
                    </div>

                    {console.log('isRangeEnabled', isRangeEnabled)}

                    <div className="end-date-and-time">
                        <h3>Due date</h3>
                        <div className="end-date">
                            <input type="checkbox" checked={!!endDate}
                                onChange={() => setEndDate(prevDate => prevDate ? null : latestDate)} />
                            <DatePicker
                                selected={endDate ? new Date(endDate) : null}
                                open={false}
                                disabled={!!endDate}
                                placeholderText='MM/DD/YYYY'
                                onChange={(date) => { setEndDate(date); setLatestDate(date) }} />

                            {/* if (date < endDate) setEndDate(dayjs(endDate).subtract(1, 'day').toDate()) */}
                        </div>
                    </div>

                    <div className="time-preview">
                        time
                    </div>
                </div>
            </div>
            <button className="btn btn-dark" onClick={() => { handleDateChange(endDate); handleCloseModal() }}>Save</button>
            <button className="btn btn-clear" onClick={onRemoveDueDate}>Remove</button>
        </div>
    )
}

{/* <DatePicker
selected={startDate}
onChange={(date) => setStartDate(date)}
showTimeSelect
showTimeSelectOnly
timeIntervals={15}
dateFormat="h:mm aa"
showTimeCaption={false}
/> */}

{/* <input value={task.dueDate || "2024-10-23"}
                type="date"
                id="dueDate"
                className="task-dueDate"
                name="dueDate"
                onChange={handleChange}
            ></input> */}