export function CoverSize({ coverType, setTask, task }) {
    console.log('coverType', coverType)

    function onSetCoveSize(size) {
        setTask(prevTask => ({ ...prevTask, coverSize: size }))
    }

    return (
        <div className="cover-size-buttons-area">
            <button class={`cover-size-btn cover-size-btn-left ${task.coverSize === 'half' && 'active'}`} type="button" aria-label="Title on cover"
                onClick={() => onSetCoveSize('half')}>
                <div class="cove-size-main">
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
                    <div class="lines">
                        <div class="line upper-line"></div>
                        <div class="line lower-line"></div>
                        <div className="shapes">
                            <div className="line shape rec"></div>
                            <div className="line shape rec"></div>
                            <div className="line shape circle"></div>
                        </div>
                    </div>
                </div>
            </button>

            <button class={`cover-size-btn cover-size-btn-right ${task.coverSize === 'full' && 'active'}`} type="button" aria-label="Title on cover"
                onClick={() => onSetCoveSize('full')}
                style={{
                    backgroundImage: (coverType.type === 'image') ? coverType.value : '',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: (coverType.type === 'image') ? '0.8' : '1',
                    backgroundColor: (coverType.type === 'color') ? coverType.value : '#DCDFE4'
                }}>
                <div class="cove-size-main">
                    <div class="lines">
                        <div class="line upper-line"></div>
                        <div class="line lower-line"></div>

                    </div>
                </div>
            </button>
        </div>
    )
}