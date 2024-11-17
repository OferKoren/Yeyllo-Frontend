import { useState } from 'react'

export function LongTxt({ children, length = 40, showButton = true }) {
    const [isShowLong, setIsShowLong] = useState(false)

    function onToggleIsShowLong() {
        setIsShowLong(isShowLong => !isShowLong)
    }

    const isLongText = children.length > length
    const textToShow = (isShowLong || !isLongText) ? children : (children.substring(0, length)) + '...'
    return (
        <section className="long-txt">
            <p className="txt">{textToShow}</p>
            {isLongText &&
                <div>
                    {showButton && <button className="show-txt-btn" onClick={(ev) => { ev.stopPropagation(); onToggleIsShowLong() }}>
                        {isShowLong ? 'Show Less' : 'Read More'}
                    </button>}
                </div>
            }
        </section>
    );
}