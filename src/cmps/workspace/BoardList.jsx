import { useNavigate } from 'react-router'
import { userService } from '../../services/user'
import { BoardPreview } from './BoardPreview'

export function BoardList({ boards, onAddBoard, onOpenModal }) {
    /* function shouldShowActionBtns(board) {
        const user = userService.getLoggedinUser()

        if (!user) return false
        if (user.isAdmin) return true
        return board.owner?._id === user._id
    } */
    const navigate = useNavigate()
    function toBoard(boardId) {
        navigate(`/board/${boardId}`)
    }
    return (
        <section>
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
                            <div className="board-actions"></div>
                        </div>

                        {/* {shouldShowActionBtns(board) && (
                            <div className="actions">
                                <button>Edit</button>
                                <button>x</button>
                            </div>
                        )} */}
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
