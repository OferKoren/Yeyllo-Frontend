export function Dates({ task, handleChange }) {

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