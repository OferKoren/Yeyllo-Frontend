
export function Cover({ setTask, handleCloseModal, task }) {

    const colorPalette = [
        '#4BCE97', '#F5CD47', '#FEA362', '#F87168', '#9F8FEF',
        '#579DFF', '#6CC3E0', '#94C748', '#E774BB', '#8590A2']

    function onSetCover(cover, type) {
        if (type === 'color') {
            setTask(prevTask => {
                if (prevTask.style.backgroundImage) {
                    const updatedAttachments = prevTask.attachments.map(file =>
                        (file.id === prevTask.style.backgroundImage.imgId ? { ...file, isCover: false } : file))
                    return { ...prevTask, attachments: updatedAttachments, style: { backgroundColor: cover } }
                }
                return ({ ...prevTask, style: { backgroundColor: cover } })
            })
        } else {
            // setTask(prevTask => ({ ...prevTask, style: { backgroundImage: { ...cover } } }))
            setTask(prevTask => {
                const updatedAttachments = prevTask.attachments.map(file =>
                    (file.id === cover.imgId ? { ...file, isCover: true } : file)
                )
                return { ...prevTask, attachments: updatedAttachments, style: { backgroundImage: { ...cover } } }
            })
        }

    }

    function onRemoveCover() {
        setTask(prevTask => {
            const updatedTask = { ...prevTask }
            if (prevTask.style.backgroundColor) {
                delete updatedTask.style
                return updatedTask
            } else {
                const updatedAttachments = updatedTask.attachments.map(file =>
                    (file.id === prevTask.style.backgroundImage.imgId ? { ...file, isCover: false } : file)
                )
                delete updatedTask.style
                return { ...updatedTask, attachments: updatedAttachments }
            }
        })
        // setTask(prevTask => {
        //     const updatedTask = { ...prevTask }
        //     delete updatedTask.style
        //     return updatedTask
        // })
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
                            onClick={() => onSetCover(color, 'color')}></div>
                    )}
                </div>

                {console.log('attachments', task.attachments)}

                {task.attachments?.length > 0 &&
                    <div className="img-attachments">
                        <h3>Attachments</h3>
                        <div className="img-attachments-list">
                            {task.attachments.map(file =>
                                <div key={file.id} className={`attachment-thumbnail`}
                                    style={{
                                        backgroundImage: `url(${file.url})`,
                                        backgroundColor: file.bgColor || 'rgb(154, 139, 127)',
                                        height: '50px',
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                    }}
                                    onClick={() => onSetCover({ url: `url(${file.url})`, bgColor: file.bgColor, imgId: file.id }, 'image')}></div>
                            )}
                        </div>
                    </div>
                }

                <button className="btn btn-remove-cover-color btn-clear" onClick={() => onRemoveCover()}>Remove cover</button>
            </div>
        </div>
    )
}