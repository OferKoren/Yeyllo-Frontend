import { useNavigate } from 'react-router'
import { userService } from '../../services/user'
import { BoardPreview } from './BoardPreview'
import { useState } from 'react'

export function BoardList({ boards, onAddBoard, onOpenModal, onUpdateBoard }) {
    const starEmpty = '/img/workspace/star-empty-small.svg'
    const starEmptyGold = '/img/workspace/star-empty-gold.svg'
    const starFullGold = '/img/workspace/star-full-gold.svg'
    const [starSrc, setStarSrc] = useState(starFullGold)

    const navigate = useNavigate()
    function toBoard(boardId) {
        navigate(`/board/${boardId}`)
    }
    function onStarBoard(ev, board) {
        ev.stopPropagation()
        const boardToUpdate = { ...board }
        boardToUpdate.isStarred = !boardToUpdate.isStarred
        console.log(boardToUpdate.isStarred)
        onUpdateBoard(boardToUpdate)
    }
    function handleMouseEnter() {
        setStarSrc(starEmptyGold)
    }
    function handleMouseLeave() {
        setStarSrc(starFullGold)
    }

    return (
        <section className="board-lists">
            {/* starred boards */}
            <h2>
                <img src="/img/workspace/star-empty.svg" alt="" />
                <span>starred boards</span>
            </h2>
            <ul className="list board-list">
                {boards.map((board) => {
                    if (!board.isStarred) return null
                    return (
                        <li
                            key={board._id}
                            onClick={() => {
                                toBoard(board._id)
                            }}
                        >
                            <div className="board-wrapper" style={board.style}>
                                <BoardPreview board={board} />
                                <div className="board-actions shown">
                                    <button
                                        className="star-btn btn2"
                                        onClick={(ev) => onStarBoard(ev, board)}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <img src={starFullGold} className="active" alt="" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>

            {/* all boards */}
            <h2>
                <img src="/img/workspace/user.svg" alt="" />
                <span>your boards</span>
            </h2>

            <ul className="list board-list">
                {boards.map((board) => (
                    <li
                        key={board._id}
                        onClick={() => {
                            toBoard(board._id)
                        }}
                    >
                        <div className="board-wrapper" style={board.style}>
                            <BoardPreview board={board} />
                            <div className={board.isStarred ? 'board-actions shown' : 'board-actions'}>
                                <button className="star-btn btn2" onClick={(ev) => onStarBoard(ev, board)}>
                                    <img className={board.isStarred ? 'active' : 'empty'} src={board.isStarred ? starFullGold : starEmpty} alt="" />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}

                <li key="add-board">
                    <div className="board-wrapper " onClick={onOpenModal}>
                        <div className="add-board">
                            <span>Create new board</span>
                        </div>
                        <div className="board-actions"></div>
                    </div>
                </li>
            </ul>
        </section>
    )
}
