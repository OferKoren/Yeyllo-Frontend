import { json, Link, useNavigate } from 'react-router-dom'

export function BoardPreview({ board }) {
    return (
        <article className="board-preview">
            <h3>{board.title}</h3>
            <div className=""></div>
        </article>
    )
}
