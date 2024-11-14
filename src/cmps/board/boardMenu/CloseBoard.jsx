import { Link } from 'react-router-dom'

export function CloseBoard() {
    return (
        <div className="close-board">
            <p>
                You can find and reopen closed boards at the bottom of<Link to="/workspace/home"> your boards page</Link>
            </p>

            <button className="close-board-btn btn1">close</button>
        </div>
    )
}
