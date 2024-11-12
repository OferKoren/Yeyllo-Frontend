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
        if (ev) ev.preventDefault()
        if (!currTitle) {
            setCurrTitle(title)
            onEditGroupHeader()
            return
            /*alert('Text field is required')*/
        }

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
        setIsCopyGroupClicked(isOpen => isOpen = false)
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



    function colorLuminance(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }

        return rgb;
    }

    return (
        <article className="group-preview">
            <header className="group-header">
                {isGroupHeaderEdit ?
                    <form onSubmit={onEditTitleGroup}>
                        <input autoFocus onBlur={onBlurInput} className="group-title-input" type="text" id="title" name="title" value={currTitle} onChange={handleChange} />
                        <button></button>
                    </form>
                    : <button onClick={onEditGroupHeader} className={`group-header-btn ${group?.style?.backgroundColor?.substr(1)}`}>{title}</button>
                }
                {isMenuOpen ? <GroupMenu onUpdateBoard={onUpdateBoard} board={board} group={group} isCopyGroupClicked={isCopyGroupClicked} setIsCopyGroupClicked={setIsCopyGroupClicked} setIsAddTaskClicked={setIsAddTaskClicked} setIsMenuOpen={setIsMenuOpen} onRemoveGroup={onRemoveGroup} /> : ''}
                <button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className={`group-menu-button ${group?.style?.backgroundColor?.substr(1)}`} onClick={toggleMenu} ><svg width="15" height="15" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z" fill={`${group.style.backgroundColor ? colorLuminance(group.style.backgroundColor, -0.55) : 'currentcolor'}`} /></svg></button>
            </header>
            <section>
                <TaskList group={group} isLabelsClicked={isLabelsClicked} setIsLabelsClicked={setIsLabelsClicked} taskTitle={taskTitle} setTaskTitle={setTaskTitle} isAddTaskClicked={isAddTaskClicked} setIsAddTaskClicked={setIsAddTaskClicked} groupId={id} onUpdateBoard={onUpdateBoard} board={board} tasks={tasks} />
            </section>
        </article>
    )
}