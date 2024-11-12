import { Link } from 'react-router-dom'
import { TaskList } from './TaskList'
import { useEffect, useState } from 'react'
import { GroupMenu } from './GroupMenu'

export function GroupPreview({ isLabelsClicked, setIsLabelsClicked, onUpdateBoard, board, group, setIsGroupDeleted }) {
    const { title, tasks, id } = group

    const [currTitle, setCurrTitle] = useState(title)
    const [isGroupHeaderEdit, setIsGroupHeaderEdit] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const [isCopyGroupClicked, setIsCopyGroupClicked] = useState(false)
    const [isAddTaskClicked, setIsAddTaskClicked] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')


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
        setCurrTitle(value)
    }

    async function onEditTitleGroup(ev) {
        if(ev) ev.preventDefault()
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
        setIsCopyGroupClicked(isOpen => isOpen =false)
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
        onEditTitleGroup()
        // setIsGroupHeaderEdit(false)
        // setCurrTitle(currTitle)
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
                {isMenuOpen ? <GroupMenu onUpdateBoard={onUpdateBoard} board={board} group={group} isCopyGroupClicked={isCopyGroupClicked} setIsCopyGroupClicked={setIsCopyGroupClicked} setIsAddTaskClicked={setIsAddTaskClicked}  setIsMenuOpen={setIsMenuOpen} onRemoveGroup={onRemoveGroup} /> : ''}
                <button className='group-menu-button' onClick={toggleMenu} ><img src="/img/menu-group/group-menu-icon.png" alt="" /></button>
            </header>
            <section>
                <TaskList isLabelsClicked={isLabelsClicked} setIsLabelsClicked={setIsLabelsClicked} taskTitle={taskTitle} setTaskTitle={setTaskTitle} isAddTaskClicked={isAddTaskClicked} setIsAddTaskClicked={setIsAddTaskClicked} groupId={id} onUpdateBoard={onUpdateBoard} board={board} tasks={tasks} />
            </section>
        </article>
    )
}