import { json, Link, useNavigate } from 'react-router-dom'

export function BoardPreview({ board }) {
    return (
        <article className="board-preview" style={board.style}>
            <h3>{board.title}</h3>
            <div className=""></div>
        </article>
    )
}
