import { Link } from 'react-router-dom'

export function TaskPreview({ task }) {
    return (
        <article className="task-preview">
            {task.title}
        </article>
    )
}