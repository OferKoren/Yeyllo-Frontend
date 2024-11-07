import { json, Link } from 'react-router-dom'

export function BoardPreview({ board }) {
    return (
        <article className="board-preview">
            <header>
                <Link to={`/board/${board._id}`}></Link>
            </header>
            <pre>{JSON.stringify(board, null, 2)}</pre>
        </article>
    )
}
