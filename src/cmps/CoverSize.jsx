export function CoverSize({ coverType, setTask, task }) {

    function onSetCoveSize(size) {
        setTask(prevTask => ({ ...prevTask, coverSize: size }))
    }

    return (
        <div className="cover-size-buttons-area">
            <button className={`cover-size-btn cover-size-btn-left ${task.coverSize === 'half' && 'active'}`} type="button" aria-label="Title on cover"
                onClick={() => onSetCoveSize('half')}>
                <div className="cove-size-main">
                    <div
                        style={{
                            backgroundImage: (coverType.type === 'image') ? coverType.value : '',
                            height: '2em',
                            borderTopRightRadius: '0.2em',
                            borderTopLeftRadius: '0.2em',
                            marginBlockEnd: '0.8em',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: (coverType.type === 'color') ? coverType.value : '#DCDFE4'
                        }}
                    >
                    </div>
                    <div className="lines">
                        <div className="line upper-line"></div>
                        <div className="line lower-line"></div>
                        <div className="shapes">
                            <div className="line shape rec"></div>
                            <div className="line shape rec"></div>
                            <div className="line shape circle"></div>
                        </div>
                    </div>
                </div>
            </button>

            <button className={`cover-size-btn cover-size-btn-right ${task.coverSize === 'full' && 'active'}`} type="button" aria-label="Title on cover"
                onClick={() => onSetCoveSize('full')}
                style={{
                    backgroundImage: (coverType.type === 'image') ? coverType.value : '',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: (coverType.type === 'image') ? '0.8' : '1',
                    backgroundColor: (coverType.type === 'color') ? coverType.value : '#DCDFE4'
                }}>
                <div className="cove-size-main">
                    <div className="lines">
                        <div className="line upper-line"></div>
                        <div className="line lower-line"></div>

                    </div>
                </div>
            </button>
        </div>
    )
}