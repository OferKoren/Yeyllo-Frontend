import { useEffect, useRef, useState } from 'react'
import { updateBoard } from '../store/actions/board.actions.js'
export function BoardHeader({ board, onUpdateBoard }) {
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
    const handleHeaderClick = () => {
        setIsEditing(true)
    }

    // Update text and exit edit mode
    const handleBlur = () => {
        setIsEditing(false)
        const boardToUpdate = { ...board }
        if (text !== '') {
            boardToUpdate.title = text
            onUpdateBoard(boardToUpdate)
        } else {
            setText(board.title)
        }
    }

    const handleInputChange = () => {
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
            <div>
                {board.members.map((member) => (
                    <img className="member-img" key={member._id} src={member.imgUrl} alt="" />
                ))}
            </div>
        </header>
    )
}
