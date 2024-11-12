
export function Cover({ setTask, handleCloseModal }) {

    const colorPalette = [
        '#4BCE97', '#F5CD47', '#FEA362', '#F87168', '#9F8FEF',
        '#579DFF', '#6CC3E0', '#94C748', '#E774BB', '#8590A2']

    function onSetCover(color) {
        setTask(prevTask => ({ ...prevTask, style: { backgroundColor: color } }))
    }

    function onRemoveCover() {
        setTask(prevTask => {
            const updatedTask = { ...prevTask }
            delete updatedTask.style
            return updatedTask
        })
    }


    return (
        <div className="modal-option task-labels">
            <div className="task-labels-header option-modal-header">
                <h2>Cover</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
            </div>

            <div className="cover-colors">
                <h3>Colors</h3>
                <div className="color-palette">
                    {colorPalette.map(color =>
                        <div key={color} style={{ backgroundColor: color }}
                            onClick={() => onSetCover(color)}></div>
                    )}
                </div>

                <button className="btn btn-remove-cover-color btn-clear" onClick={() => onRemoveCover()}>Remove cover</button>
            </div>
        </div>
    )
}