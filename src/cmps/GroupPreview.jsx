import { Link } from 'react-router-dom'
import { TaskList } from './TaskList'
import { useState } from 'react'

export function GroupPreview({ onUpdateBoard, board, group }) {
    const { title, tasks, id } = group

    const [currTitle, setCurrTitle] = useState(title)
    const [isGroupHeaderEdit, setIsGroupHeaderEdit] = useState(false)

    function onEditGroupHeader() {
        setIsGroupHeaderEdit(isEdit => !isEdit)
    }

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name
        let value = ev.target.value

        switch (type) {
            case 'text':
                break
            case 'number': {
                value = +ev.target.value || ''
                break
            }
        }
        console.log(value)
        setCurrTitle(value)
    }

    async function onEditGroup(ev) {
        ev.preventDefault()
        if (!currTitle) return alert('Text field is required')

        // const group = {
        //     style: {},
        //     tasks: [],
        //     title: currTitle
        // }
        try {
            const currGroup = board.groups.find(group => group.id === id)
            currGroup.title = currTitle
            await onUpdateBoard(board)
            onEditGroupHeader()
        } catch (err) {
            console.log('err: ', err);
        }
        // updateBoard(newBoard)
    }

    return (
        <article className="group-preview">
            <header className="group-header">
                {isGroupHeaderEdit ?
                    <form onSubmit={onEditGroup}>
                        <input autoFocus onBlur={() => setIsGroupHeaderEdit(false)} className="group-title-input" type="text" id="title" name="title" value={currTitle} onChange={handleChange} />
                    </form>
                    : <button onClick={onEditGroupHeader} className="group-header-btn">{title}</button>
                }
                <button><img src="/img/menu-group/group-menu-icon.png" alt="" /></button>
            </header>
            <section>
                <TaskList tasks={tasks} />
            </section>
        </article>
    )
}