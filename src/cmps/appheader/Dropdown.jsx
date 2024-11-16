import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

export function Dropdown({ title = 'dropdown', setIsModalOpen }) {
    const boards = useSelector((storeState) => storeState.boardModule.boards)
    const navigate = useNavigate()
    function toBoard(boardId) {
        navigate(`/board/${boardId}`)
        setIsModalOpen(false)
    }
    const filter = title === 'starred' ? 'isStarred' : 'recent'
    return (
        <div className="dropdown">
            <header className="dropdown-header"></header>
            <ul className="dropdown-list">
                {boards.map((board) => {
                    if (!board[filter]) return
                    return (
                        <li key={board._id} onClick={() => toBoard(board._id)}>
                            {board.title}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
