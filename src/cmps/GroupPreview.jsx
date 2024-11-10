import { Link } from 'react-router-dom'
import { TaskList } from './TaskList'
import { useEffect, useState } from 'react'
import { GroupMenu } from './GroupMenu'

export function GroupPreview({ onUpdateBoard, board, group, setIsGroupDeleted }) {
    const { title, tasks, id } = group

    const [currTitle, setCurrTitle] = useState(title)
    const [isGroupHeaderEdit, setIsGroupHeaderEdit] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {

    }, [isMenuOpen])

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

    async function onEditTitleGroup(ev) {
        ev.preventDefault()
        if (!currTitle) return alert('Text field is required')
        try {
            const currGroup = board.groups.find(group => group.id === id)
            currGroup.title = currTitle
            await onUpdateBoard(board)
            onEditGroupHeader()
        } catch (err) {
            console.log('err: ', err);
        }
    }
    function toggleMenu() {
        setIsMenuOpen(isOpen => !isOpen)
    }

    async function onRemoveGroup(ev) {
        ev.preventDefault()
        try {
            const currGroupIdx = board.groups.findIndex(group => group.id === id)
            board.groups.splice(currGroupIdx, 1)
            await onUpdateBoard(board)
            toggleMenu()
            setIsGroupDeleted(isGroupDeleted => !isGroupDeleted)
        } catch (err) {
            console.log('err: ', err);
        }
    }

    function onBlurInput() {
        setIsGroupHeaderEdit(false)
        setCurrTitle(title)
    }




    return (
        <article className="group-preview">
            <header className="group-header">
                {isGroupHeaderEdit ?
                    <form onSubmit={onEditTitleGroup}>
                        <input autoFocus onBlur={onBlurInput} className="group-title-input" type="text" id="title" name="title" value={currTitle} onChange={handleChange} />
                    </form>
                    : <button onClick={onEditGroupHeader} className="group-header-btn">{title}</button>
                }
                {isMenuOpen ? <GroupMenu setIsMenuOpen={setIsMenuOpen} onRemoveGroup={onRemoveGroup} /> : ''}
                <button className='group-menu-button' onClick={toggleMenu} ><img src="/img/menu-group/group-menu-icon.png" alt="" /></button>
            </header>
            <section>
                <TaskList groupId={id} onUpdateBoard={onUpdateBoard} board={board} tasks={tasks} />
            </section>
        </article>
    )
}