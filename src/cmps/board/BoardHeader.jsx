import { useEffect, useRef, useState } from 'react'

const starEmpty = '/img/workspace/star-empty-small.svg'
const starEmptyGold = '/img/workspace/star-empty-gold.svg'
const starFullGold = '/img/workspace/star-full-gold.svg'
export function BoardHeader({ board, onUpdateBoard, onToggleMenu, setIsShrink, isMenuOpen }) {
    const [isEditing, setIsEditing] = useState(false)
    const [text, setText] = useState() // Initial text for the header
    const inputRef = useRef(null)
    const headerRef = useRef(null)
    const spanRef = useRef(null)
    const [textWidth, setTextWidth] = useState(0)
    // Toggle to edit mode
    useEffect(() => {
        if (board) {
            setText(board.title)
        }
    }, [board.title])
    function handleHeaderClick() {
        setIsEditing(true)
    }

    // Update text and exit edit mode
    function handleBlur() {
        setIsEditing(false)
        const boardToUpdate = { ...board }
        if (text !== '') {
            boardToUpdate.title = text
            onUpdateBoard(boardToUpdate)
        } else {
            setText(board.title)
        }
    }

    function handleInputChange() {
        // Get the width of the input's text
        if (inputRef.current) {
            setTextWidth(inputRef.current.scrollWidth)
        }
    }
    function updateTextWidht(text) {
        if (spanRef.current) {
            spanRef.current.textContent = text || ''
            const width = spanRef.current.offsetWidth

            setTextWidth(width * 1.05 + 15) //
        }
    }

    function onStarBoard(ev) {
        ev.stopPropagation()
        const boardToUpdate = { ...board }
        boardToUpdate.isStarred = !boardToUpdate.isStarred
        onUpdateBoard(boardToUpdate)
    }
    useEffect(() => {
        updateTextWidht(text)
    }, [isEditing, text])
    /*     useEffect(() => {
        console.log(textWidth)
    }, [textWidth]) */
    if (!board._id) return

    return (
        <header className="board-header flex">
            <div className="title-wrapper" style={{ width: `${textWidth + 10}px` }}>
                {isEditing ? (
                    <input
                        className="title-input"
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value)
                            handleInputChange()
                        }}
                        onFocus={() => {
                            setTimeout(() => {
                                inputRef.current.select()
                            }, 10)
                        }}
                        style={{ width: `${textWidth}px` }}
                        onBlur={handleBlur} // Exit edit mode when focus is lost
                        autoFocus
                    />
                ) : (
                    <h3 ref={headerRef} onClick={handleHeaderClick} className="title-text">
                        {text}
                    </h3>
                )}
            </div>
            <span ref={spanRef} className="text-measurer" />

            <button className="header-btn btn2 star" onClick={(ev) => onStarBoard(ev, board)}>
                {board.isStarred ? <StarFull /> : <StarEmpty />}
            </button>

            <div className="board-members">
                {board.members.map((member) => (
                    <img className="member-img" key={member._id} src={member.imgUrl} alt="" />
                ))}
            </div>

            {!isMenuOpen && (
                <button
                    className="header-btn btn2"
                    onClick={() => {
                        onToggleMenu()
                        // if (isMenuOpen) setIsShrink(true)
                    }}
                >
                    <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
            )}
        </header>
    )

    function StarEmpty() {
        return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        )
    }
    function StarFull() {
        return (
            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        )
    }
}
