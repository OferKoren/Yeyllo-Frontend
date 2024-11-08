
export function Labels({ task, setTask }) {

    const labels = [
        { id: 'l101', color: '#4BCE97', title: '' },
        { id: 'l102', color: '#F5CD47', title: '' },
        { id: 'l103', color: '#FEA362', title: '' },
        { id: 'l104', color: '#F87168', title: '' },
        { id: 'l105', color: '#9F8FEF', title: '' },
        { id: 'l106', color: '#579DFF', title: '' },
    ]

    function toggleLabel(labelId) {
        setTask((prevTask) => {
            if (prevTask.labelIds.includes(labelId)) {
                return { ...prevTask, labelIds: prevTask.labelIds.filter(item => item !== labelId) }
            } else {
                return { ...prevTask, labelIds: [...prevTask.labelIds, labelId] }
            }
        })
    }

    return (
        <div className="task-labels">
            <h4>Labels</h4>
            {labels.map((label) => (
                <div key={label.id} className="checkbox-item">
                    <input
                        type="checkbox"
                        id={label.id}
                        value={label.txt}
                        checked={task.labelIds?.includes(label.id) || false}
                        onChange={() => toggleLabel(label.id)}
                    />
                    <label className="task-label"
                        htmlFor={label.id}
                        style={{ backgroundColor: label.color }}>
                        {label.title || 'test'}
                    </label>
                </div>
            ))}
        </div>
    )
}