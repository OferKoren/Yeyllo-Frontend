import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { updateBoard } from '../../../store/actions/board.actions'

export function CloseBoard({ onUpdateBoard }) {
    const board = useSelector((storeState) => storeState.boardModule.board)
    const navigate = useNavigate()
    async function onClose() {
        const closedBoard = { ...board }
        closedBoard.isClosed = Date.now()
        await onUpdateBoard(closedBoard)
        console.log('closing')
        navigate('/workspace/home')
    }
    return (
        <div className="close-board">
            <p>
                You can find and reopen closed boards at the bottom of<Link to="/workspace/home"> your boards page</Link>
            </p>

            <button className="menu-btn btn1" onClick={onClose}>
                close
            </button>
        </div>
    )
}
