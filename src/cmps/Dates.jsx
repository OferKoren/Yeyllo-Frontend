import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import dayjs from 'dayjs'

export function Dates({ task, setTask, handleCloseModal, openModal }) {

    const [endDate, setEndDate] = useState(task.dueDate ? new Date(task.dueDate) : new Date())
    const [startDate, setStartDate] = useState(task.startDate ? new Date(task.startDate) : null)
    const [latestDate, setLatestDate] = useState(task.dueDate ? new Date(task.dueDate) : new Date())
    const [isRangeEnabled, setIsRangeEnabled] = useState(!!startDate)
    const [dueTime, setDueTime] = useState(dayjs(new Date(task.dueDate)).format('hh:mm A') || dayjs(new Date()).format('hh:mm A'))

    console.log('startDate', startDate)
    console.log('endDate', endDate)
    console.log('formattedDate', dayjs(endDate).format('DD-MM-YYYY'))
    console.log('task', task)


    function onRemoveDueDate() {
        const { dueDate, status, ...updatedTask } = task
        setTask(updatedTask)
    }
    function handleDatePick(dates) {
        console.log('dates', dates)
        if (Array.isArray(dates)) {
            const [start, end] = dates
            if (isRangeEnabled) {
                setStartDate(start)
                setEndDate(end || endDate)
            }
        } else {
            setEndDate(dates)
        }
    }

    function toggleStartDate() {
        setIsRangeEnabled(prev => !prev)
        // if (isRangeEnabled) {
        //     setStartDate(null)
        // } else {
        //     setStartDate(new Date(endDate.getTime() - (24 * 60 * 60 * 1000)))
        // }
    }

    function handleDateChange(dueDate, beginnigDate) {
        // const formattedEndDate = dayjs(dueDate).format('DD-MM-YYYY')
        // const formattedStartDate = beginnigDate ? dayjs(beginnigDate).format('DD-MM-YYYY') : null
        // const formattedDueTime = dayjs(dueDate).format('hh:mm A')
        setTask((prevTask) => ({ ...prevTask, dueDate: endDate, startDate: startDate, dueTime: dueTime, status: 'inProgress' }))
    }

    return (
        <div className="modal-option">
            <div className="option-modal-header">
                <h2>Dates</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
            </div>

            <div className="date-picker-calendar-container">
                <DatePicker
                    swapRange
                    selected={endDate ? new Date(endDate) : ''}
                    onChange={handleDatePick}
                    name="dueDate"
                    className="task-dueDate date-picker-calendar"
                    startDate={startDate ? startDate : null}
                    endDate={new Date(endDate)}
                    selectsRange={isRangeEnabled}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select due date"
                    open={openModal === 'dates'}
                    inline
                />
            </div>

            <div className="dates">
                <h3>Start date</h3>
                <div className="start-date">
                    <div className="start-date">
                        <input type="checkbox" checked={isRangeEnabled}
                            onChange={toggleStartDate} />
                        <DatePicker
                            selected={isRangeEnabled ? startDate : null}
                            open={false}
                            disabled={!isRangeEnabled}
                            placeholderText='M/D/YYYY'
                            dateFormat="dd-MM-yyyy"
                            onChange={(date) => setStartDate(isRangeEnabled ? date : null)} />
                    </div>
                </div>

                <div className="due-date">
                    <h3>Due date</h3>
                    <div className="end-date-and-time">
                        <div className="end-date">
                            <input type="checkbox" checked={!!endDate}
                                onChange={() => setEndDate(prevDate => prevDate ? null : latestDate)} />
                            <DatePicker
                                selected={endDate ? new Date(endDate) : null}
                                open={false}
                                disabled={!endDate}
                                placeholderText='M/D/YYYY'
                                dateFormat="dd-MM-yyyy"
                                onChange={(date) => { setEndDate(date); setLatestDate(date) }} />
                            {/* if (date < endDate) setEndDate(dayjs(endDate).subtract(1, 'day').toDate()) */}
                        </div>

                        <div className="time-preview">
                            <DatePicker
                                selected={endDate ? new Date(endDate) : null}
                                onChange={(date) => setDueTime(date)}
                                disabled={!endDate}
                                placeholderText='h:mm a'
                                dateFormat="h:mm aa"
                                showTimeCaption={false}
                                open={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="dates-action-buttons">
                <button className="btn btn-dark" onClick={() => { handleDateChange(endDate, startDate); handleCloseModal() }}>Save</button>
                <button className="btn btn-clear" onClick={onRemoveDueDate}>Remove</button>
            </div>
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