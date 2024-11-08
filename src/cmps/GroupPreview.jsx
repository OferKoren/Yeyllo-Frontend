import { Link } from 'react-router-dom'
import { TaskList } from './TaskList'

export function GroupPreview({ group }) {

    const { title, tasks } = group

    return (
        <article className="group-preview">
            <header>
                {title}
            </header>
            <section>
                <TaskList tasks={tasks} />
            </section>
        </article>
    )
}