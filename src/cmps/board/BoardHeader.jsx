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
    }, [])
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
                <img className={board.isStarred ? 'active' : 'empty'} src={board.isStarred ? starFullGold : starEmpty} alt="" />
            </button>

            <div className="board-members">
                {board.members.map((member) => (
                    <img className="member-img" key={member._id} src={member.imgUrl} alt="" />
                ))}
            </div>

            <button
                className="header-btn btn2"
                onClick={() => {
                    onToggleMenu()
                    // if (isMenuOpen) setIsShrink(true)
                }}
            >
                <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z"
                        fill="currentColor"
                    />
                </svg>
            </button>
        </header>
    )
}
